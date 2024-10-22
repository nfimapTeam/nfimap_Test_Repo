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
  Button,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { Select } from "antd";
import { Option } from "antd/es/mentions";
import { concertsData } from "../datas/concerts";
import { concertsDataEng } from "../datas/concertsEng";
import { globalConcertsEng } from "../datas/globalConcertsEng";
import { globalConcerts } from "../datas/globalConcerts";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { toggleState } from "../atom/toggleState";
import Card from "../components/Card";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../style/custom.css";
import { Helmet } from "react-helmet-async";
import NoData from "../components/NoData";
import { useTranslation } from "react-i18next";

interface Concert {
  id: number;
  name: string;
  location: string;
  type: string;
  performanceType: string;
  durationMinutes: number;
  date: string[];
  startTime: string;
  artists: string[];
  ticketLink: string;
  poster: string;
  lat: string;
  lng: string;
  ticketOpen: {
    date: string;
    time: string;
  };
}

const Home = () => {
  const { t, i18n, } = useTranslation();

  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentTime, setCurrentTime] = useState(moment());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState(t("latest"));
  const [toggle, setToggle] = useRecoilState(toggleState);
  const [selectedType, setSelectedType] = useState("");
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [allConcerts, setAllConcerts] = useState<Concert[]>([]);

  const handleDateChange = (date: any) => {
    if (Array.isArray(date)) {
      setSelectedDate(date[0] as Date);
    } else if (date instanceof Date) {
      setSelectedDate(date);
    } else {
      setSelectedDate(null);
    }
    onClose();
  };

  useEffect(() => {
    if (i18n.language === "ko") {
      const combinedConcerts = [...concertsData, ...globalConcerts];
      setAllConcerts(combinedConcerts);
    } else {
      const combinedConcerts = [...concertsDataEng, ...globalConcertsEng];
      setAllConcerts(combinedConcerts);
    }
  }, [i18n.language, concertsData, globalConcerts, concertsDataEng, globalConcertsEng]);

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
    if (isPastEvent || concert.type === "행사") {
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
    return dates.some((date) => {
      const concertDate = moment(date.split("(")[0], "YYYY-MM-DD");
      return concertDate.isSameOrAfter(currentTime, "day");
    });
  };

  const sortConcerts = (concerts: Concert[]) => {
    const now = moment();

    const upcomingConcerts = concerts.filter((concert) =>
      concert.date.some((date) =>
        moment(date.split("(")[0], "YYYY-MM-DD").isSameOrAfter(now, "day")
      )
    );

    const pastConcerts = concerts.filter((concert) =>
      concert.date.every((date) =>
        moment(date.split("(")[0], "YYYY-MM-DD").isBefore(now, "day")
      )
    );

    const sortFunction = (a: Concert, b: Concert) => {
      const today = moment().format("YYYY-MM-DD");

      const ticketOpenA = a.ticketOpen?.date === today;
      const ticketOpenB = b.ticketOpen?.date === today;

      if (ticketOpenA && !ticketOpenB) return -1;
      if (!ticketOpenA && ticketOpenB) return 1;

      if (sortOrder === t("latest")) {
        const dateA = moment(a.date[0].split("(")[0], "YYYY-MM-DD");
        const dateB = moment(b.date[0].split("(")[0], "YYYY-MM-DD");
        return dateA.diff(dateB);
      } else if (sortOrder === t("byName")) {
        return a.name.localeCompare(b.name);
      }
      return 0;
    };

    // Sort upcoming concerts first
    upcomingConcerts.sort(sortFunction);
    // Sort past concerts after that
    pastConcerts.sort((a, b) => {
      if (sortOrder === t("latest")) {
        const dateA = moment(a.date[0].split("(")[0], "YYYY-MM-DD");
        const dateB = moment(b.date[0].split("(")[0], "YYYY-MM-DD");
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
      case "이벤트":
        return t("event");
      default:
        return type;
    }
  };

  const filteredAndSortedConcerts = sortConcerts(
    allConcerts.filter((concert) => {
      const matchesSearch =
        concert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        concert.location.toLowerCase().includes(searchQuery.toLowerCase());

      const translatedConcertType = translateType(concert.type);
      const matchesType =
        selectedType === "" || translatedConcertType === selectedType;

      if (toggle) {
        const isPastEvent = concert.date.every((date) => {
          const concertDate = moment(date.split("(")[0], "YYYY-MM-DD");
          return concertDate.isBefore(currentTime, "day");
        });
        return matchesSearch && isPastEvent && matchesType;
      } else {
        const isFutureOrToday = concert.date.some((date) => {
          const concertDate = moment(date.split("(")[0], "YYYY-MM-DD");
          return concertDate.isSameOrAfter(currentTime, "day");
        });
        return matchesSearch && isFutureOrToday && matchesType;
      }
    })
  );

  return (
    <Box
      h="calc(100vh - 120px)"
      width="100%"
      maxWidth="1200px"
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
            <Option value={t("concert")}>{t("concert")}</Option>
            <Option value={t("festival")}>{t("festival")}</Option>
            <Option value={t("event")}>{t("event")}</Option>
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

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{t("selectDate")}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Calendar onChange={handleDateChange} value={selectedDate} />
              </ModalBody>
            </ModalContent>
          </Modal>
        </Flex>
      </Box>
      {filteredAndSortedConcerts.length === 0 && <NoData />}
      <SimpleGrid columns={columns} spacing={6}>
        {filteredAndSortedConcerts.map((concert, index) => {
          const isFutureOrToday = isEventTodayOrFuture(concert.date);
          const isPastEvent = !isFutureOrToday;
          const isTodayEvent = concert.date.some((date) => {
            const concertDate = moment(date.split("(")[0], "YYYY-MM-DD");
            return concertDate.isSame(currentTime, "day");
          });
          const isTicketOpen =
            concert.ticketOpen?.date === moment().format("YYYY-MM-DD");
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
  );
};

export default Home;
