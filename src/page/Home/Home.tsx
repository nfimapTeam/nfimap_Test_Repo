import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Input,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  InputGroup,
  InputRightElement,
  Icon,
  SimpleGrid,
  useBreakpointValue,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { toggleState } from "../../atom/toggleState";
import {
  searchQueryState,
  sortOrderState,
  selectedYearState,
  scrollPositionState
} from "../../atom/listState";
import Card from "./component/Card";
import "react-calendar/dist/Calendar.css";
import { Helmet } from "react-helmet-async";
import NoData from "../../components/NoData";
import { useTranslation } from "react-i18next";
import BirrthDay from "../../components/BirthDay";
import { useConcertList } from "../../api/concerts/concertsApi";

// RawConcert: API에서 오는 원시 데이터 타입
interface RawConcert {
  id: number;
  name: string;
  location: string;
  type: string;
  performanceType: string;
  concertDate: { date: string; start_time: string; duration_minutes: number }[];
  startTime: string;
  artists: string[];
  ticketLink: string[];
  poster: string;
  lat: string | number;
  lng: string | number;
  ticketOpen: {
    date: string;
    time: string;
  };
}

// Concert: 변환 후 Card에 전달될 타입
interface Concert extends RawConcert {
  date: string[];
}

const Home = () => {
  const { t, i18n } = useTranslation();

  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
  const isMobileOrTablet = useBreakpointValue({ base: true, md: true, lg: false });
  const [currentTime, setCurrentTime] = useState(moment());

  // 전역 상태로 관리
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
  const [sortOrder, setSortOrder] = useRecoilState(sortOrderState);
  const [selectedYear, setSelectedYear] = useRecoilState(selectedYearState);
  const [scrollPosition, setScrollPosition] = useRecoilState(scrollPositionState);

  const [toggle, setToggle] = useRecoilState(toggleState);
  const navigate = useNavigate();
  const [lang, setLang] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: concertsData, refetch: refetchConcertsData } = useConcertList(lang);

  // 2024년부터 현재 연도까지의 배열 생성
  const currentYear = moment().year();
  const yearOptions = Array.from(
    { length: currentYear - 2024 + 2 },
    (_, i) => 2024 + i
  );

  useEffect(() => {
    if (i18n.language === "ko") {
      setLang("ko");
    } else {
      setLang("en");
    }
  }, [i18n.language]);

  useEffect(() => {
    setTimeout(() => {
      refetchConcertsData();
    }, 50);
  }, [lang]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // sortOrder 초기값 설정
  useEffect(() => {
    if (sortOrder !== "latest" && sortOrder !== "byName") {
      setSortOrder("latest");
    }
  }, [sortOrder, setSortOrder]);

  useEffect(() => {
    if (toggle) {
      setSortOrder("latest");
    }
  }, [toggle, setSortOrder]);

  // 스크롤 위치 복원
  useEffect(() => {
    if (scrollContainerRef.current && scrollPosition > 0) {
      scrollContainerRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  // 스크롤 위치 저장
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setScrollPosition(scrollContainerRef.current.scrollTop);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [setScrollPosition]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const getButtonText = (
    concert: Concert,
    isPastEvent: boolean,
    timeRemaining: { days: number; hours: number; minutes: number } | null
  ) => {
    if (isPastEvent || concert.type === "행사" || concert.type === "Event") {
      return t("performanceInfo");
    } else if (concert.ticketOpen.date === "0000-00-00") {
      return t("waitingForTicketSchedule");
    } else if (concert.ticketLink.length === 0) {
      return timeRemaining
        ? t("timeUntilTicketing", {
          days: timeRemaining.days,
          hours: timeRemaining.hours,
          minutes: timeRemaining.minutes,
        })
        : t("waitingForTicketInfo");
    } else {
      return t("buyTickets");
    }
  };

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    concert: Concert,
    isPastEvent: boolean
  ) => {
    e.stopPropagation();
    if (isPastEvent) {
      navigate(`/${concert.id}`);
    }
  };

  const calculateTimeRemaining = (openDate: string, openTime: string) => {
    const ticketOpenMoment = moment(`${openDate} ${openTime}`, "YYYY-MM-DD HH:mm");
    const diffDuration = moment.duration(ticketOpenMoment.diff(currentTime));
    const days = Math.floor(diffDuration.asDays());
    const hours = diffDuration.hours();
    const minutes = diffDuration.minutes();

    if (days < 0 || hours < 0) {
      return null;
    }

    return { days, hours, minutes };
  };

  const isEventTodayOrFuture = (dates: string[]) => {
    return dates.some((date) =>
      moment(date, "YYYY-MM-DD").isSameOrAfter(currentTime, "day")
    );
  };

  const isEventToday = (dates: string[]) => {
    const today = moment().format("YYYY-MM-DD");
    return dates.includes(today);
  };

  const sortConcerts = (concerts: Concert[]) => {
    const upcomingConcerts = concerts.filter((concert) =>
      isEventTodayOrFuture(concert.date)
    );

    const pastConcerts = concerts.filter(
      (concert) => !isEventTodayOrFuture(concert.date)
    );

    const sortFunction = (a: Concert, b: Concert) => {
      const today = moment().format("YYYY-MM-DD");

      const ticketOpenA = a.ticketOpen?.date === today;
      const ticketOpenB = b.ticketOpen?.date === today;

      if (ticketOpenA && !ticketOpenB) return -1;
      if (!ticketOpenA && ticketOpenB) return 1;

      if (sortOrder === "latest") {
        const dateA = moment(
          a.date.reduce((earliest, date) =>
            moment(date, "YYYY-MM-DD").isBefore(moment(earliest, "YYYY-MM-DD"))
              ? date
              : earliest
          ),
          "YYYY-MM-DD"
        );
        const dateB = moment(
          b.date.reduce((earliest, date) =>
            moment(date, "YYYY-MM-DD").isBefore(moment(earliest, "YYYY-MM-DD"))
              ? date
              : earliest
          ),
          "YYYY-MM-DD"
        );
        return dateA.diff(dateB);
      } else if (sortOrder === "byName") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    };

    upcomingConcerts.sort(sortFunction);
    pastConcerts.sort((a, b) => {
      if (sortOrder === "latest") {
        const dateA = moment(
          a.date.reduce((latest, date) =>
            moment(date, "YYYY-MM-DD").isAfter(moment(latest, "YYYY-MM-DD"))
              ? date
              : latest
          ),
          "YYYY-MM-DD"
        );
        const dateB = moment(
          b.date.reduce((latest, date) =>
            moment(date, "YYYY-MM-DD").isAfter(moment(latest, "YYYY-MM-DD"))
              ? date
              : latest
          ),
          "YYYY-MM-DD"
        );
        return dateB.diff(dateA);
      }
      return sortFunction(a, b);
    });

    return [...upcomingConcerts, ...pastConcerts];
  };

  const translateType = (type: string) => {
    switch (type.toLowerCase().trim()) {
      case "콘서트":
      case "concert":
        return t("concert");
      case "페스티벌":
      case "festival":
        return t("festival");
      case "행사":
      case "event":
        return t("event");
      default:
        return type;
    }
  };

  const filteredAndSortedConcerts = (concertsData || []).filter((concert: RawConcert) => {
    const matchesSearch =
      (concert.name && concert.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (concert.location && concert.location.toLowerCase().includes(searchQuery.toLowerCase()));

    // 연도 필터링: selectedYear가 비어있거나 concertDate에 해당 연도가 포함되어 있는지 확인
    const matchesYear =
      selectedYear === "" ||
      concert.concertDate.some((item) => {
        const year = moment(item.date, "YYYY-MM-DD").year();
        return year === parseInt(selectedYear);
      });

    const isFutureOrToday = concert.concertDate.some((item) =>
      moment(item.date, "YYYY-MM-DD").isSameOrAfter(currentTime, "day")
    );
    const isPastEvent = !isFutureOrToday;

    if (toggle) {
      return matchesSearch && isPastEvent && matchesYear;
    } else {
      return matchesSearch && isFutureOrToday && matchesYear;
    }
  }).map((concert: RawConcert): Concert => ({
    ...concert,
    date: concert.concertDate.map((d: { date: string }) => d.date),
  }));

  const sortedConcerts = sortConcerts(filteredAndSortedConcerts);

  return (
    <Box
      ref={scrollContainerRef}
      h={isMobileOrTablet ? "calc(100svh - 120px)" : "calc(100svh - 70px)"}
      width="100%"
      mx="auto"
      p="16px 16px 70px 16px"
      overflowY="auto"
      css={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
    >
      <Box maxWidth="1200px" margin="auto">
        <Helmet>
          <title>{t("helmettitle")}</title>
          <meta name="description" content={t("helmetdescription")} />
          <meta property="og:image" content="/image/nfimap.png" />
          <meta property="og:url" content="https://nfimap.co.kr" />
        </Helmet>
        <Box mb={4}>
          <BirrthDay />
          <InputGroup size="lg">
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              mb={4}
              borderColor="purple.200"
              focusBorderColor="#9F7AEA"
              bg="whiteAlpha.900"
              _hover={{ borderColor: "#9F7AEA" }}
              _placeholder={{ color: "gray.400" }}
              size="lg"
              borderRadius="md"
              boxShadow="md"
            />
            <InputRightElement width="4.5rem">
              {searchQuery ? (
                <Icon
                  as={CloseIcon}
                  color="gray.500"
                  cursor="pointer"
                  onClick={clearSearch}
                  boxSize="12px"
                />
              ) : (
                <Icon as={SearchIcon} color="gray.500" cursor="pointer" />
              )}
            </InputRightElement>
          </InputGroup>

          <Flex width="100%" justifyContent="start" gap={4} alignItems="center">
            {/* Year Filter Dropdown */}
            <FormControl maxW="100px">
              <Menu>
                <MenuButton
                  minW="100px"
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  borderColor="purple.200"
                  bg="white"
                  borderWidth="1px"
                  color="gray.800"
                  fontSize="sm"
                  fontWeight="medium"
                  height="40px"
                  width="100px"
                  borderRadius="md"
                  boxShadow="sm"
                  _hover={{
                    borderColor: "purple.400",
                    boxShadow: "md",
                  }}
                  _active={{
                    bg: "purple.50",
                    borderColor: "purple.500",
                  }}
                  _focus={{
                    borderColor: "purple.500",
                    boxShadow: "0 0 0 1px #9F7AEA",
                  }}
                  textAlign="left"
                  justifyContent="space-between"
                  px={3}
                >
                  {selectedYear ? selectedYear : t("all")}
                </MenuButton>
                <MenuList
                  bg="white"
                  borderColor="purple.200"
                  borderRadius="md"
                  boxShadow="lg"
                  minW="200px"
                  zIndex={10}
                  py={1}
                  mt={1}
                >
                  <MenuItem
                    onClick={() => setSelectedYear("")}
                    bg="white"
                    color="gray.800"
                    fontSize="sm"
                    _hover={{ bg: "purple.50", color: "purple.700" }}
                    _focus={{ bg: "purple.50" }}
                    px={4}
                    py={2}
                  >
                    {t("all")}
                  </MenuItem>
                  {yearOptions.map((year) => (
                    <MenuItem
                      key={year}
                      onClick={() => setSelectedYear(year.toString())}
                      bg="white"
                      color="gray.800"
                      fontSize="sm"
                      _hover={{ bg: "purple.50", color: "purple.700" }}
                      _focus={{ bg: "purple.50" }}
                      px={4}
                      py={2}
                    >
                      {year}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </FormControl>

            {/* Sort Order Dropdown */}
            <FormControl maxW="100px">
              <Menu>
                <MenuButton
                  minW="100px"
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  borderColor="purple.200"
                  bg="white"
                  borderWidth="1px"
                  color="gray.800"
                  fontSize="sm"
                  fontWeight="medium"
                  height="40px"
                  borderRadius="md"
                  boxShadow="sm"
                  _hover={{
                    borderColor: "purple.400",
                    boxShadow: "md",
                  }}
                  _active={{
                    bg: "purple.50",
                    borderColor: "purple.500",
                  }}
                  _focus={{
                    borderColor: "purple.500",
                    boxShadow: "0 0 0 1px #9F7AEA",
                  }}
                  textAlign="left"
                  justifyContent="space-between"
                  px={3}
                >
                  {t(sortOrder)}
                </MenuButton>
                <MenuList
                  bg="white"
                  borderColor="purple.200"
                  borderRadius="md"
                  boxShadow="lg"
                  minW="200px"
                  zIndex={10}
                  mt={1}
                >
                  <MenuItem
                    onClick={() => setSortOrder("latest")}
                    bg="white"
                    color="gray.800"
                    fontSize="sm"
                    _hover={{ bg: "purple.50", color: "purple.700" }}
                    _focus={{ bg: "purple.50" }}
                    px={4}
                    py={2}
                  >
                    {t("latest")}
                  </MenuItem>
                  <MenuItem
                    onClick={() => setSortOrder("byName")}
                    bg="white"
                    color="gray.800"
                    fontSize="sm"
                    _hover={{ bg: "purple.50", color: "purple.700" }}
                    _focus={{ bg: "purple.50" }}
                    px={4}
                    py={2}
                  >
                    {t("byName")}
                  </MenuItem>
                </MenuList>
              </Menu>
            </FormControl>

            {/* Toggle Switch */}
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="show-past-events" mb="0">
                {t("showPastEvents")}
              </FormLabel>
              <Switch
                id="show-past-events"
                isChecked={toggle}
                onChange={() => setToggle(!toggle)}
                sx={{
                  ".chakra-switch__track": {
                    bg: toggle ? "#9F7AEA" : "gray.200",
                  },
                }}
              />
            </FormControl>
          </Flex>
        </Box>

        {sortedConcerts.length === 0 && (
          <Box h={isMobileOrTablet ? "calc(100svh - 120px)" : "calc(100svh - 70px)"}>
            <NoData />
          </Box>
        )}

        <SimpleGrid columns={columns} spacing={6}>
          {sortedConcerts.map((concert, index) => {
            const isTodayEvent = isEventToday(concert.date);
            const isFutureOrToday = isEventTodayOrFuture(concert.date);
            const isPastEvent = !isFutureOrToday;

            const isTicketOpen = concert.ticketOpen?.date === moment().format("YYYY-MM-DD");
            const timeRemaining = calculateTimeRemaining(
              concert.ticketOpen.date,
              concert.ticketOpen.time
            );

            return (
              <Card
                key={index}
                lang={lang}
                concert={concert}
                isTodayEvent={isTodayEvent}
                isTicketOpen={isTicketOpen}
                isPastEvent={isPastEvent}
                timeRemaining={timeRemaining}
                getButtonText={getButtonText}
                handleButtonClick={handleButtonClick}
              />
            );
          })}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default Home;