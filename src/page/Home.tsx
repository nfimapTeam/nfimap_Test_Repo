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
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { Select } from "antd";
import { Option } from "antd/es/mentions";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { toggleState } from "../atom/toggleState";
import Card from "../components/Card";
import "react-calendar/dist/Calendar.css";
import "../style/custom.css";
import { Helmet } from "react-helmet-async";
import NoData from "../components/NoData";
import { useTranslation } from "react-i18next";
import BirrthDay from "../components/BirthDay";
import { useConcertList } from "../api/concerts/concertsApi";

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
  ticketLink: string;
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
  const [lang, setLang] = useState("ko");

  const { data: concertsData, refetch: refetchConcertsData } = useConcertList(lang);

  useEffect(() => {
    if (i18n.language === "ko") {
      setLang("ko");
    } else {
      setLang("en");
    }
  }, [i18n.language]);

  useEffect(() => {
    refetchConcertsData();
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
    } else if (concert.ticketLink === "") {
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
    const ticketOpenMoment = moment(
      `${openDate} ${openTime}`,
      "YYYY-MM-DD HH:mm"
    );
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
    const lastDate = dates[dates.length - 1];
    const concertDate = moment(lastDate, "YYYY-MM-DD");
    return concertDate.isSameOrAfter(currentTime, "day");
  };

  const sortConcerts = (concerts: Concert[]) => {
    const now = moment();

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
        const dateA = moment(a.date[a.date.length - 1], "YYYY-MM-DD");
        const dateB = moment(b.date[b.date.length - 1], "YYYY-MM-DD");
        return dateA.diff(dateB);
      } else if (sortOrder === t("byName")) {
        return a.name.localeCompare(b.name);
      }
      return 0;
    };

    upcomingConcerts.sort(sortFunction);
    pastConcerts.sort((a, b) => {
      if (sortOrder === t("latest")) {
        const dateA = moment(a.date[a.date.length - 1], "YYYY-MM-DD");
        const dateB = moment(b.date[b.date.length - 1], "YYYY-MM-DD");
        return dateB.diff(dateA);
      }
      return sortFunction(a, b);
    });

    return [...upcomingConcerts, ...pastConcerts];
  };

  const translateType = (type: string) => {
    switch (type) {
      case "콘서트":
        return t("concert");
      case "페스티벌":
        return t("festival");
      case "행사":
        return t("event");
      case "concert":
        return t("concert");
      case "festival":
        return t("festival");
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

    const translatedConcertType = translateType(concert.type);
    const matchesType = selectedType === "" || translatedConcertType === selectedType;

    const lastConcertDate = concert.concertDate[concert.concertDate.length - 1].date;
    const concertDateMoment = moment(lastConcertDate, "YYYY-MM-DD");
    const isPastEvent = concertDateMoment.isBefore(currentTime, "day");

    if (toggle) {
      return matchesSearch && isPastEvent && matchesType;
    } else {
      const isFutureOrToday = concertDateMoment.isSameOrAfter(currentTime, "day");
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
          <meta
            property="og:image"
            content="https://nfimap.co.kr/image/nfimap.png"
          />
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
              focusBorderColor="#4BA4F2"
              bg="whiteAlpha.900"
              _hover={{ borderColor: "#79AEF2" }}
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

          <Flex width="100%" justifyContent="space-between" gap={4}>
            <Select
              value={selectedType}
              onChange={(value) => setSelectedType(value)}
              style={{ width: 200, height: 40 }}
              dropdownStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#4BA4F2",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
              placeholder={t("selectConcertType")}
            >
              <Option value="">{t("all")}</Option>
              <Option value={t("concertVal")}>{t("concert")}</Option>
              <Option value={t("festivalVal")}>{t("festival")}</Option>
              <Option value={t("eventVal")}>{t("event")}</Option>
            </Select>
            <Select
              value={sortOrder}
              onChange={(value) => setSortOrder(value)}
              style={{ width: 200, height: 40 }}
              dropdownStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#4BA4F2",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Option value={t("latest")}>{t("latest")}</Option>
              <Option value={t("byName")}>{t("byName")}</Option>
            </Select>

            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="show-past-events" mb="0">
                {t("showPastEvents")}
              </FormLabel>
              <Switch
                id="show-past-events"
                isChecked={toggle}
                onChange={() => setToggle(!toggle)}
              />
            </FormControl>
          </Flex>
        </Box>

        {sortedConcerts.length === 0 && (<Box h={isMobileOrTablet ? "calc(100svh - 120px)" : "calc(100svh - 70px)"}><NoData /></Box>)}

        <SimpleGrid columns={columns} spacing={6}>
          {sortedConcerts.map((concert, index) => {
            const lastConcertDate = concert.date[concert.date.length - 1];
            const isFutureOrToday = moment(lastConcertDate, "YYYY-MM-DD").isSameOrAfter(currentTime, "day");
            const isPastEvent = !isFutureOrToday;
            const isTodayEvent = moment(lastConcertDate, "YYYY-MM-DD").isSame(currentTime, "day");

            const isTicketOpen = concert.ticketOpen?.date === moment().format("YYYY-MM-DD");
            const timeRemaining = calculateTimeRemaining(
              concert.ticketOpen.date,
              concert.ticketOpen.time
            );

            return (
              <Card
                key={index}
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