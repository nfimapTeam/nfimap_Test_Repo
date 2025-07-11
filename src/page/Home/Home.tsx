import React, { useState, useEffect } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState(t("latest"));
  const [toggle, setToggle] = useRecoilState(toggleState);
  const [selectedType, setSelectedType] = useState("");
  const navigate = useNavigate();
  const [lang, setLang] = useState("");

  const { data: concertsData, refetch: refetchConcertsData } = useConcertList(lang);

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

  useEffect(() => {
    if (toggle) {
      setSortOrder(t("latest"));
    }
  }, [toggle, t]);

  useEffect(() => {
    setSortOrder(t("latest"));
    setSelectedType("");
  }, [i18n.language, t]);

  useEffect(() => {
    translateType(selectedType)
  }, [selectedType])

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
    // 수정: 배열에 오늘 또는 미래 날짜가 하나라도 있으면 true 반환
    return dates.some((date) =>
      moment(date, "YYYY-MM-DD").isSameOrAfter(currentTime, "day")
    );
  };

  const isEventToday = (dates: string[]) => {
    // 수정: 배열에 오늘 날짜가 하나라도 있으면 true 반환
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

      if (sortOrder === t("latest")) {
        // 다가오는 공연은 가장 이른 날짜로 정렬
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
      } else if (sortOrder === t("byName")) {
        return a.name.localeCompare(b.name);
      }
      return 0;
    };

    upcomingConcerts.sort(sortFunction);
    pastConcerts.sort((a, b) => {
      if (sortOrder === t("latest")) {
        // 과거 공연은 가장 늦은 날짜로 내림차순 정렬
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
        return dateB.diff(dateA); // Reverse for past concerts
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

  // API type 값을 정규화
  const normalizeType = (type: string) => {
    return type.toLowerCase().trim();
  };

  const filteredAndSortedConcerts = (concertsData || []).filter((concert: RawConcert) => {
    const matchesSearch =
      (concert.name && concert.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (concert.location && concert.location.toLowerCase().includes(searchQuery.toLowerCase()));

    // 필터링: selectedType이 비어있거나 정규화된 concert.type과 일치하는지 확인
    const matchesType =
      selectedType === "" || normalizeType(concert.type) === normalizeType(selectedType);

    // 수정: 오늘 또는 미래 날짜가 있는지 확인
    const isFutureOrToday = concert.concertDate.some((item) =>
      moment(item.date, "YYYY-MM-DD").isSameOrAfter(currentTime, "day")
    );
    const isPastEvent = !isFutureOrToday;

    if (toggle) {
      return matchesSearch && isPastEvent && matchesType;
    } else {
      return matchesSearch && isFutureOrToday && matchesType;
    }
  }).map((concert: RawConcert): Concert => ({
    ...concert,
    date: concert.concertDate.map((d: { date: string }) => d.date),
  }));

  const sortedConcerts = sortConcerts(filteredAndSortedConcerts);

  return (
    <Box
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
          <meta property="og:image" content="/image/nfimap.png" /> {/* 로컬 경로로 수정 */}
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
                  {selectedType ? translateType(selectedType) : t("all")}
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
                    onClick={() => setSelectedType("")}
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
                  <MenuItem
                    onClick={() => setSelectedType(i18n.language === "ko" ? "콘서트" : "concert")}
                    bg="white"
                    color="gray.800"
                    fontSize="sm"
                    _hover={{ bg: "purple.50", color: "purple.700" }}
                    _focus={{ bg: "purple.50" }}
                    px={4}
                    py={2}
                  >
                    {t("concert")}
                  </MenuItem>
                  <MenuItem
                    onClick={() => setSelectedType(i18n.language === "ko" ? "페스티벌" : "festival")} // API type에 맞게 고정
                    bg="white"
                    color="gray.800"
                    fontSize="sm"
                    _hover={{ bg: "purple.50", color: "purple.700" }}
                    _focus={{ bg: "purple.50" }}
                    px={4}
                    py={2}
                  >
                    {t("festival")}
                  </MenuItem>
                  <MenuItem
                    onClick={() => setSelectedType(i18n.language === "ko" ? "행사" : "event")} // API type에 맞게 고정
                    bg="white"
                    color="gray.800"
                    fontSize="sm"
                    _hover={{ bg: "purple.50", color: "purple.700" }}
                    _focus={{ bg: "purple.50" }}
                    px={4}
                    py={2}
                  >
                    {t("event")}
                  </MenuItem>
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
                  {sortOrder}
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
                    onClick={() => setSortOrder(t("latest"))}
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
                    onClick={() => setSortOrder(t("byName"))}
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
            // 수정: isTodayEvent는 배열에 오늘 날짜가 포함되어 있는지 확인
            const isTodayEvent = isEventToday(concert.date);
            // 수정: isPastEvent는 배열에 오늘 또는 미래 날짜가 하나도 없는 경우
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