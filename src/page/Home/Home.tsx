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
  VStack,
  Text,
  Collapse,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import moment from "moment";
import { List as ListIcon, Calendar as CalendarIcon, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { toggleState } from "../../atom/toggleState";
import {
  searchQueryState,
  selectedYearState,
  selectedTypeState,
  scrollPositionState
} from "../../atom/listState";
import Card from "./component/Card";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Helmet } from "react-helmet-async";
import NoData from "../../components/NoData";
import { useTranslation } from "react-i18next";
import BirrthDay from "../../components/BirthDay";
import { useConcertList } from "../../api/concerts/concertsApi";
import SegmentedToggle from "../../components/SegmentedToggle";

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

interface Concert extends RawConcert {
  date: string[];
}

const Home = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language ? i18n.language.split("-")[0] : "ko";

  // 2-column on mobile, 2-column on small screens, 3-column on tablet, 4-column on desktop
  const columns = useBreakpointValue({ base: 1, md: 3, lg: 4 });
  const isMobileOrTablet = useBreakpointValue({ base: true, md: true, lg: false });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [currentTime, setCurrentTime] = useState(moment());

  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
  const [selectedType, setSelectedType] = useRecoilState(selectedTypeState);
  const [selectedYear, setSelectedYear] = useRecoilState(selectedYearState);
  const [scrollPosition, setScrollPosition] = useRecoilState(scrollPositionState);

  const [toggle, setToggle] = useRecoilState(toggleState);
  const navigate = useNavigate();
  const [lang, setLang] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calendar states
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const viewModeOptions = [
    { value: "list", label: t("list"), icon: ListIcon },
    { value: "calendar", label: t("calendar") || "달력", icon: CalendarIcon },
  ] as const;

  const { data: concertsData, refetch: refetchConcertsData } = useConcertList(lang);

  const currentYear = moment().year();
  const yearOptions = Array.from(
    { length: currentYear - 2024 + 2 },
    (_, i) => 2024 + i
  );

  useEffect(() => {
    const baseLang = i18n.language ? i18n.language.split("-")[0] : "ko";
    // 서버는 ko/en만 지원 — zh/ja는 en으로 폴백
    setLang(baseLang === "ko" ? "ko" : "en");
  }, [i18n.language]);

  useEffect(() => {
    setTimeout(() => {
      refetchConcertsData();
    }, 50);
  }, [lang, refetchConcertsData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current && scrollPosition > 0 && viewMode === "list") {
      scrollContainerRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition, viewMode]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current && viewMode === "list") {
        setScrollPosition(scrollContainerRef.current.scrollTop);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [setScrollPosition, viewMode]);

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
    };

    upcomingConcerts.sort(sortFunction);
    pastConcerts.sort((a, b) => {
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
    });

    return [...upcomingConcerts, ...pastConcerts];
  };

  const filteredAndSortedConcerts = (concertsData || []).filter((concert: RawConcert) => {
    const matchesSearch =
      (concert.name && concert.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (concert.location && concert.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesYear =
      selectedYear === "" ||
      (concert.concertDate && concert.concertDate.some((item) => {
        const year = moment(item.date, "YYYY-MM-DD").year();
        return year === parseInt(selectedYear);
      }));

    const matchesType =
      selectedType === "" ||
      (concert.type &&
        (concert.type.toLowerCase() === selectedType.toLowerCase() ||
          (selectedType === "concert" && concert.type === "콘서트") ||
          (selectedType === "festival" && concert.type === "페스티벌") ||
          (selectedType === "event" && concert.type === "행사")));

    const isFutureOrToday = concert.concertDate && concert.concertDate.some((item) =>
      moment(item.date, "YYYY-MM-DD").isSameOrAfter(currentTime, "day")
    );
    const isPastEvent = !isFutureOrToday;

    if (toggle) {
      return matchesSearch && isPastEvent && matchesYear && matchesType;
    } else {
      return matchesSearch && isFutureOrToday && matchesYear && matchesType;
    }
  }).map((concert: RawConcert): Concert => ({
    ...concert,
    date: concert.concertDate ? concert.concertDate.map((d: { date: string }) => d.date) : [],
  }));

  const sortedConcerts = sortConcerts(filteredAndSortedConcerts);

  // 캘린더 전용 헬퍼 함수
  const hasConcertOnDate = (date: Date) => {
    const dateStr = moment(date).utcOffset(9).format("YYYY-MM-DD");
    return sortedConcerts.some((concert) => concert.date && concert.date.includes(dateStr));
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month" && hasConcertOnDate(date)) {
      return (
        <span className="react-calendar-dot" />
      );
    }
    return null;
  };

  const getConcertsOnSelectedDate = () => {
    const dateStr = moment(selectedDate).utcOffset(9).format("YYYY-MM-DD");
    return sortedConcerts.filter((concert) => concert.date && concert.date.includes(dateStr));
  };

  return (
    <Box
      ref={scrollContainerRef}
      h={isMobileOrTablet ? "calc(100svh - 120px)" : "calc(100svh - 70px)"}
      width="100%"
      mx="auto"
      p={{ base: "8px 8px 80px 8px", md: "24px 24px 80px 24px" }}
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

        {/* Top Search & Filter Panel */}
        <Box mb={6} className="search-filter-panel">
          <BirrthDay />

          {/* Rounded Capsule Search Bar */}
          <InputGroup size="lg" mb={4}>
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              borderColor="purple.100"
              focusBorderColor="brand.main"
              bg="white"
              _hover={{ borderColor: "purple.300" }}
              _placeholder={{ color: "gray.400" }}
              size="lg"
              borderRadius="full"
              boxShadow="soft"
              height="50px"
              pl={6}
              pr={12}
              transition="all 0.3s ease"
              _focus={{
                boxShadow: "glow",
                transform: "translateY(-1px)"
              }}
            />
            <InputRightElement width="4rem" height="50px">
              {searchQuery ? (
                <Icon
                  as={CloseIcon}
                  color="gray.400"
                  cursor="pointer"
                  onClick={clearSearch}
                  boxSize="10px"
                  _hover={{ color: "brand.main" }}
                />
              ) : (
                <Icon as={SearchIcon} color="gray.400" />
              )}
            </InputRightElement>
          </InputGroup>

          {/* Filtering & View Switch Row */}
          <Flex
            width="100%"
            flexDirection="column"
            gap={3}
            bg="white"
            p={3}
            borderRadius="2xl"
            boxShadow="soft"
            borderWidth="1px"
            borderColor="purple.50"
          >
            {/* Row 1: View Switcher (left) & Actions (right) */}
            <Flex
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              flexWrap="wrap"
              gap={2}
            >
              {/* View Switch ButtonGroup (List / Calendar) */}
              <SegmentedToggle
                layoutId="homeViewMode"
                options={viewModeOptions}
                value={viewMode}
                onChange={setViewMode}
              />

              {/* Actions Group (Past Events Toggle + Filter Toggle) */}
              <Flex gap={2} alignItems="center">
                {/* Toggle Switch */}


                {/* Filter Toggle Button */}
                <Button
                  leftIcon={<SlidersHorizontal size={isMobile ? 12 : 14} />}
                  onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                  variant="outline"
                  size={isMobile ? "xs" : "sm"}
                  height={isMobile ? "30px" : "36px"}
                  borderColor={isFilterExpanded ? "brand.main" : "purple.100"}
                  bg={isFilterExpanded ? "brand.purpleSoft" : "white"}
                  borderRadius="full"
                  fontSize={isMobile ? "10px" : "xs"}
                  fontWeight="extrabold"
                  color={isFilterExpanded ? "brand.main" : "gray.600"}
                  _hover={{
                    borderColor: "brand.main",
                    bg: "brand.purpleSoft",
                    color: "brand.main",
                  }}
                  _active={{
                    bg: "brand.purpleSoft",
                    borderColor: "brand.main",
                  }}
                >
                  {t("filter")}
                </Button>
              </Flex>
            </Flex>

            {/* Row 2: Collapsible Dropdowns */}
            <Collapse in={isFilterExpanded} style={{ width: "100%" }}>
              <Flex
                gap={2.5}
                alignItems="center"
                justifyContent="flex-start"
                width="100%"
                pt={3}
                borderTop="1px solid"
                borderColor="purple.50"
              >
                <Flex w="100%" gap={4}>
                  {/* Year Filter Menu */}
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                      borderColor="purple.100"
                      bg="white"
                      borderWidth="1px"
                      color="gray.700"
                      fontSize="xs"
                      fontWeight="bold"
                      height="36px"
                      minW="110px"
                      borderRadius="full"
                      _hover={{
                        borderColor: "purple.300",
                        bg: "brand.purpleSoft",
                      }}
                      _active={{
                        bg: "brand.purpleSoft",
                        borderColor: "brand.main",
                      }}
                      textAlign="left"
                      px={4}
                    >
                      {selectedYear ? selectedYear : t("all")}
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => setSelectedYear("")}>
                        {t("all")}
                      </MenuItem>
                      {yearOptions.map((year) => (
                        <MenuItem
                          key={year}
                          onClick={() => setSelectedYear(year.toString())}
                        >
                          {year}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>

                  {/* 공연 유형 필터 드롭다운 */}
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                      borderColor={selectedType ? "brand.main" : "purple.100"}
                      bg={selectedType ? "brand.purpleSoft" : "white"}
                      borderWidth="1px"
                      color={selectedType ? "brand.main" : "gray.700"}
                      fontSize="xs"
                      fontWeight="bold"
                      height="36px"
                      minW="110px"
                      borderRadius="full"
                      _hover={{
                        borderColor: "purple.300",
                        bg: "brand.purpleSoft",
                      }}
                      _active={{
                        bg: "brand.purpleSoft",
                        borderColor: "brand.main",
                      }}
                      textAlign="left"
                      px={4}
                    >
                      {selectedType === "" 
                        ? t("selectConcertType") 
                        : selectedType === "concert" 
                          ? t("concert") 
                          : selectedType === "festival" 
                            ? t("festival") 
                            : t("event")}
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => setSelectedType("")}>
                        {t("all")}
                      </MenuItem>
                      <MenuItem onClick={() => setSelectedType("concert")}>
                        {t("concert")}
                      </MenuItem>
                      <MenuItem onClick={() => setSelectedType("festival")}>
                        {t("festival")}
                      </MenuItem>
                      <MenuItem onClick={() => setSelectedType("event")}>
                        {t("event")}
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
                <Flex w="100%" justifyContent={"flex-end"}>
                  <FormControl
                    display="flex"
                    alignItems="center"
                    width="auto"
                    bg="brand.purpleSoft"
                    px={{ base: 3, md: 4 }}
                    py={{ base: 1, md: 1.5 }}
                    borderRadius="full"
                    m={0}
                  >
                    <FormLabel
                      htmlFor="show-past-events"
                      mb="0"
                      mr={{ base: 2, md: 3 }}
                      fontSize={{ base: "10px", md: "xs" }}
                      fontWeight="extrabold"
                      color="brand.main"
                      cursor="pointer"
                    >
                      {t("showPastEvents")}
                    </FormLabel>
                    <Switch
                      id="show-past-events"
                      colorScheme="purple"
                      size={isMobile ? "sm" : "md"}
                      isChecked={toggle}
                      onChange={() => setToggle(!toggle)}
                    />
                  </FormControl>
                </Flex>
              </Flex>
            </Collapse>
          </Flex>
        </Box>

        {viewMode === "list" && sortedConcerts.length === 0 && (
          <Box h="calc(100svh - 220px)">
            <NoData />
          </Box>
        )}

        {/* Dynamic View rendering */}
        {viewMode === "calendar" ? (
          <VStack spacing={6} align="stretch" width="100%" animation="fadeIn 0.4s ease">
            {/* Calendar Widget Box */}
            <Box
              bg="white"
              p={4}
              borderRadius="24px"
              boxShadow="soft"
              borderWidth="1px"
              borderColor="purple.50"
              overflow="hidden"
            >
              <Calendar
                onChange={(value) => {
                  if (value instanceof Date) {
                    setSelectedDate(value);
                  } else if (Array.isArray(value) && value[0] instanceof Date) {
                    setSelectedDate(value[0]);
                  }
                }}
                value={selectedDate}
                tileContent={tileContent}
                locale={
                  currentLang === "ko"
                    ? "ko-KR"
                    : currentLang === "ja"
                      ? "ja-JP"
                      : currentLang === "zh"
                        ? "zh-CN"
                        : "en-US"
                }
                formatMonthYear={(locale, date) => {
                  if (currentLang === "ko") return moment(date).utcOffset(9).format("YYYY년 M월");
                  if (currentLang === "ja" || currentLang === "zh") return moment(date).utcOffset(9).format("YYYY年 M월");
                  return moment(date).utcOffset(9).format("MMMM YYYY");
                }}
                formatShortWeekday={(locale, date) => {
                  const day = date.getDay();
                  const koDays = ["일", "월", "화", "수", "목", "금", "토"];
                  const enDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                  const jaDays = ["日", "月", "火", "水", "木", "金", "土"];
                  const zhDays = ["日", "一", "二", "三", "四", "五", "六"];
                  if (currentLang === "ko") return koDays[day];
                  if (currentLang === "ja") return jaDays[day];
                  if (currentLang === "zh") return zhDays[day];
                  return enDays[day];
                }}
                formatDay={(locale, date) => moment(date).utcOffset(9).format("D")}
              />
            </Box>

            {/* Selected Date Header */}
            <Box borderLeft="4px solid" borderColor="brand.main" pl={3.5} py={1} mt={2}>
              <Text fontSize="md" fontWeight="black" color="gray.800">
                {currentLang === "ko"
                  ? `${moment(selectedDate).utcOffset(9).format("YYYY년 MM월 DD일")} 공연 일정`
                  : currentLang === "ja"
                    ? `${moment(selectedDate).utcOffset(9).format("YYYY年 MM月 DD日")} 公演日程`
                    : currentLang === "zh"
                      ? `${moment(selectedDate).utcOffset(9).format("YYYY年 MM月 DD日")} 演出日程`
                      : `${moment(selectedDate).utcOffset(9).format("YYYY-MM-DD")} Concert Schedule`}
              </Text>
            </Box>

            {/* Concert Grid filtered by date */}
            {getConcertsOnSelectedDate().length === 0 ? (
              <Box
                py={12}
                textAlign="center"
                bg="rgba(139, 92, 246, 0.02)"
                borderRadius="24px"
                borderStyle="dashed"
                borderWidth="2px"
                borderColor="purple.100"
              >
                <Text fontSize="sm" color="gray.400" fontWeight="bold">
                  {currentLang === "ko"
                    ? "해당 날짜에 예정된 공연이 없습니다."
                    : currentLang === "ja"
                      ? "該当日に予定されている公演はありません。"
                      : currentLang === "zh"
                        ? "该日期没有排定的演出。"
                        : "No concerts scheduled on this date."}
                </Text>
              </Box>
            ) : (
              <SimpleGrid columns={columns} spacing={{ base: 4, md: 6 }}>
                {getConcertsOnSelectedDate().map((concert, index) => {
                  const isTodayEvent = isEventToday(concert.date);
                  const isFutureOrToday = isEventTodayOrFuture(concert.date);
                  const isPastEvent = !isFutureOrToday;

                  const isTicketOpen = concert.ticketOpen && concert.ticketOpen.date === moment().format("YYYY-MM-DD");
                  const timeRemaining = concert.ticketOpen
                    ? calculateTimeRemaining(
                      concert.ticketOpen.date,
                      concert.ticketOpen.time
                    )
                    : null;

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
            )}
          </VStack>
        ) : (
          /* List Mode rendering */
          <SimpleGrid columns={columns} spacing={{ base: 4, md: 6 }}>
            {sortedConcerts.map((concert, index) => {
              const isTodayEvent = isEventToday(concert.date);
              const isFutureOrToday = isEventTodayOrFuture(concert.date);
              const isPastEvent = !isFutureOrToday;

              const isTicketOpen = concert.ticketOpen && concert.ticketOpen.date === moment().format("YYYY-MM-DD");
              const timeRemaining = concert.ticketOpen
                ? calculateTimeRemaining(
                  concert.ticketOpen.date,
                  concert.ticketOpen.time
                )
                : null;

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
        )}
      </Box>
    </Box>
  );
};

export default Home;