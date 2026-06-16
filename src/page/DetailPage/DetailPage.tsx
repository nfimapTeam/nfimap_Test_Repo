import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Image,
  Button,
  Badge,
  VStack,
  HStack,
  Flex,
  Link,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  useBreakpointValue,
  chakra,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarIcon,
  TimerIcon,
  MapPinIcon,
  InfoIcon,
  MusicIcon,
  CameraIcon,
  UsersIcon,
  Ticket,
  Download,
  Sparkles,
  ClipboardList,
  Armchair,
} from "lucide-react";
import NotFound from "../../components/NotFound";
import Card from "../Home/component/Card";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Comments from "../../components/Comments";
import { useConcertDetail } from "../../api/concerts/concertsDetailApi";
import { useConcertList } from "../../api/concerts/concertsApi";
import { getTicketSiteName } from "../../util/getTicketSiteName";
import { TicketDrawer } from "./components/Drawer";
import { TicketModal } from "./components/TicketModal";
import SetlistComponent from "./components/SetlistComponent";
import Loading from "../../components/Loading";

interface Concert {
  id: number;
  name: string;
  location: string;
  type: string;
  performanceType: string;
  startTime: string;
  artists: string[];
  ticketLink: string[];
  poster: string;
  lat: number | string;
  lng: number | string;
  ticketOpen: {
    date: string;
    time: string;
  };
  concertDate: { date: string; start_time: string; duration_minutes: number | string }[];
  date: string[];
  durationMinutes?: number | string;
  address?: string;
  note?: string[];
  capacity?: string;
  seats?: { image: string }[];
  ootd?: string[];
  setlist?: {
    date: string;
    formatted_date: string;
    duration_minutes?: number | string;
    music: {
      music: {
        name: string;
        youtube_url: string;
        image: string | null;
      };
      status: string;
      play_order: number;
    }[];
    start_time: string;
  }[];
  infoImage?: {
    image: string;
  }[];
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
}

const MotionFlex = chakra(motion.div);
const MotionBox = chakra(motion.div);

const DetailPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cardBgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const textColorSec = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("purple.50", "whiteAlpha.100");
  const dividerColor = useColorModeValue("purple.50", "whiteAlpha.100");
  const appBg = useColorModeValue("brand.bg", "gray.950");
  const tabListBg = useColorModeValue("purple.50", "whiteAlpha.50");
  const tabTextColor = useColorModeValue("purple.500", "purple.200");
  const tabHoverBg = useColorModeValue("rgba(139, 92, 246, 0.04)", "rgba(255, 255, 255, 0.02)");
  const scheduleBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const seatBg = useColorModeValue("cyan.50", "rgba(6, 182, 212, 0.1)");
  const seatIconColor = useColorModeValue("cyan.500", "cyan.300");
  const currentTime = moment();
  const [allConcerts, setAllConcerts] = useState<Concert[]>([]);
  const [lang, setLang] = useState<string>(() => {
    const baseLang = i18n.language ? i18n.language.split("-")[0] : "ko";
    return baseLang === "ko" ? "ko" : "en";
  });
  const isMobileOrTablet = useBreakpointValue({ base: true, md: true, lg: false });
  const { data: concertDetail, refetch: refetchConcertDetail, isLoading } = useConcertDetail(id ?? "", lang);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSetlist, setSelectedSetlist] = useState<any>(null);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    const baseLang = i18n.language ? i18n.language.split("-")[0] : "ko";
    // 서버는 ko/en만 지원 — zh/ja는 en으로 폴백
    setLang(baseLang === "ko" ? "ko" : "en");
  }, [i18n.language]);

  useEffect(() => {
    setTimeout(() => {
      refetchConcertDetail();
    }, 50);
  }, [lang]);

  if (isLoading) {
    return <Loading />;
  }

  if (!id || !concertDetail) {
    return <NotFound content={t("no_info")} />;
  }

  // Normalize duration_minutes to number
  const normalizeConcertData = (concert: Concert): Concert => {
    return {
      ...concert,
      concertDate: concert.concertDate?.map((d) => ({
        ...d,
        duration_minutes: Number(d.duration_minutes) || 0,
      })) || [],
      setlist: concert.setlist?.map((s) => ({
        ...s,
        duration_minutes: Number(s.duration_minutes) || 0,
      })) || [],
      durationMinutes: Number(concert.durationMinutes) || 0,
    };
  };

  const normalizedConcertDetail = normalizeConcertData(concertDetail);

  const hasSetlist = Array.isArray(normalizedConcertDetail.setlist) && normalizedConcertDetail.setlist.length > 0;
  const hasConcertDate =
    Array.isArray(normalizedConcertDetail.concertDate) && normalizedConcertDetail.concertDate.length > 0;

  const concertDates: string[] = hasSetlist && normalizedConcertDetail.setlist
    ? normalizedConcertDetail.setlist.map((set) => set.date)
    : hasConcertDate
      ? normalizedConcertDetail.concertDate.map((d) => d.date)
      : [];

  const augmentedConcertDetail: Concert = {
    ...normalizedConcertDetail,
    date: concertDates,
    concertDate: hasConcertDate
      ? normalizedConcertDetail.concertDate
      : hasSetlist && normalizedConcertDetail.setlist
        ? normalizedConcertDetail.setlist.map((set) => ({
          date: set.date,
          start_time: set.start_time,
          duration_minutes: Number(set.duration_minutes) || 0,
        }))
        : [],
    durationMinutes: hasSetlist && normalizedConcertDetail.setlist?.[0]?.duration_minutes
      ? Number(normalizedConcertDetail.setlist[0].duration_minutes)
      : hasConcertDate && normalizedConcertDetail.concertDate?.[0]?.duration_minutes
        ? Number(normalizedConcertDetail.concertDate[0].duration_minutes)
        : 0,
  };

  const isEventTodayOrFuture = (dates: string[]): boolean => {
    if (!dates || dates.length === 0) return false;
    const firstDate = moment(dates[0].split("(")[0], "YYYY-MM-DD");
    return firstDate.isSameOrAfter(currentTime, "day");
  };

  const calculateTimeRemaining = (openDate: string, openTime: string): TimeRemaining | null => {
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

  const getButtonText = (
    concert: Concert,
    isPastEvent: boolean,
    timeRemaining: TimeRemaining | null
  ): string => {
    if (isPastEvent || concert.type === "행사" || concert.type === "Event") {
      return t("check_performance_info");
    } else if (concert.ticketOpen.date === "0000-00-00") {
      return t("waiting_schedule");
    } else if (concert.ticketLink.length === 0 || concert.ticketLink[0] === "") {
      return timeRemaining
        ? `${timeRemaining.days}${t("day")} ${timeRemaining.hours}${t("hour")} ${timeRemaining.minutes}${t("minute_later")}`
        : t("waiting_ticket_info");
    } else {
      return t("ticket_booking");
    }
  };

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    concert: Concert,
    isPastEvent: boolean
  ): void => {
    e.stopPropagation();
    if (isPastEvent) {
      navigate(`/${concert.id}`);
    }
  };

  const handleExtractSetlist = (setlist: any) => {
    setSelectedSetlist(setlist);
    onOpen();
  };

  const formatTime = (time: string) => {
    return moment(time, "HH:mm:ss").format("HH:mm");
  };

  const isPastEvent: boolean = !isEventTodayOrFuture(augmentedConcertDetail.date);
  const timeRemaining: TimeRemaining | null = calculateTimeRemaining(
    augmentedConcertDetail.ticketOpen.date,
    augmentedConcertDetail.ticketOpen.time
  );

  // Determine if the last setlist date is in the past
  const isLastSetlistDatePast = hasSetlist && normalizedConcertDetail.setlist
    ? moment(normalizedConcertDetail.setlist[normalizedConcertDetail.setlist.length - 1].date, "YYYY-MM-DD").isBefore(currentTime, "day")
    : false;

  // Set default tab index: 1 for "show_record" if last setlist date is past, 0 for "show_details" otherwise
  const defaultTabIndex = isLastSetlistDatePast ? 1 : 0;

  return (
    <Box h={isMobileOrTablet ? "calc(100svh - 120px)" : "calc(100svh - 70px)"} overflowY="auto" bg={appBg}>
      <Box p={{ base: "16px 16px 100px 16px", md: "24px 24px 120px 24px" }} width="100%" maxWidth="1200px" mx="auto">
        <Flex direction={{ base: "column", lg: "row" }} gap={8} align="stretch">
          
          {/* Left Column: Poster Image */}
          <MotionFlex
            display="flex"
            flex={1}
            justifyContent="center"
            alignItems="center"
            bg={cardBgColor}
            p={4}
            border="1px solid"
            borderRadius="3xl"
            boxShadow="card"
            borderColor={borderColor}
            overflow="hidden"
            position="relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" } as any}
          >
            <Box 
              position="relative" 
              w="100%" 
              h="100%" 
              overflow="hidden" 
              borderRadius="2xl" 
              display="flex" 
              justifyContent="center"
              transition="transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
              _hover={{ transform: "translateY(-4px)" }}
            >
              <Image
                src={augmentedConcertDetail.poster}
                alt={augmentedConcertDetail.name}
                w="100%"
                h="auto"
                maxH={{ base: "400px", md: "600px" }}
                objectFit="contain"
                fallbackSrc="/image/logo/logo.svg"
                position="relative"
                zIndex={2}
                borderRadius="xl"
                cursor="zoom-in"
                onClick={() => setLightboxImage(augmentedConcertDetail.poster)}
              />
            </Box>
          </MotionFlex>

          {/* Right Column: Information Panel */}
          <MotionFlex 
            display="flex"
            flexDirection="column" 
            justifyContent="flex-start" 
            flex={1} 
            gap={6}
            bg={cardBgColor}
            p={{ base: 6, md: 8 }}
            border="1px solid"
            borderRadius="3xl"
            boxShadow="card"
            borderColor={borderColor}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 } as any}
          >
            {/* Header Area */}
            <Box>
              <Badge 
                colorScheme="purple" 
                bg="brand.purpleSoft" 
                color="brand.main"
                fontSize="xs" 
                mb={3}
                px={3}
                py={1}
                borderRadius="full"
              >
                {(augmentedConcertDetail.type === "콘서트" || augmentedConcertDetail.type === "Concert") && t("concert_type_concert")}
                {(augmentedConcertDetail.type === "페스티벌" || augmentedConcertDetail.type === "Festival") && t("concert_type_festival")}
                {(augmentedConcertDetail.type === "행사" || augmentedConcertDetail.type === "Event") && t("concert_type_event")}
                {!["콘서트", "Concert", "페스티벌", "Festival", "행사", "Event"].includes(augmentedConcertDetail.type) && augmentedConcertDetail.type}
              </Badge>
              <Text 
                fontSize={{ base: "2xl", md: "3xl" }} 
                fontWeight="black" 
                color={textColor}
                mb={6}
                lineHeight="shorter"
              >
                {augmentedConcertDetail.name}
              </Text>

              {/* Minimalist Metadata Stack */}
              <VStack align="stretch" spacing={5} mb={2}>
                {/* Location Row */}
                <HStack spacing={4} align="center">
                  <Flex 
                    align="center" 
                    justify="center" 
                    w="40px" 
                    h="40px" 
                    borderRadius="full" 
                    bg="brand.purpleSoft"
                    flexShrink={0}
                  >
                    <Icon as={MapPinIcon} color="brand.main" w="18px" h="18px" />
                  </Flex>
                  <Box>
                    <Text fontSize="11px" color={textColorSec} fontWeight="bold" textTransform="uppercase" letterSpacing="0.5px">
                      {t("location") || "장소"}
                    </Text>
                    <Text fontSize="md" fontWeight="bold" color={textColor}>
                      {augmentedConcertDetail.location}
                    </Text>
                  </Box>
                </HStack>

                {/* Dates Row & Full Schedule */}
                <HStack spacing={4} align="start">
                  <Flex 
                    align="center" 
                    justify="center" 
                    w="40px" 
                    h="40px" 
                    borderRadius="full" 
                    bg="brand.purpleSoft"
                    mt={0.5}
                    flexShrink={0}
                  >
                    <Icon as={CalendarIcon} color="brand.main" w="18px" h="18px" />
                  </Flex>
                  <Box w="100%">
                    <Text fontSize="11px" color={textColorSec} fontWeight="bold" textTransform="uppercase" letterSpacing="0.5px" mb={1.5}>
                      {t("concert_date") || "공연 일정"}
                    </Text>
                    <VStack align="stretch" spacing={2}>
                      {hasSetlist && augmentedConcertDetail.setlist ? (
                        augmentedConcertDetail.setlist.map((set, index) => (
                          <Text
                            key={index}
                            fontSize="md"
                            fontWeight="semibold"
                            color={textColor}
                          >
                            <Text as="span">
                              {set.formatted_date}
                            </Text>
                            <Text as="span" color="brand.main" fontWeight="bold" ml={3}>
                              {formatTime(set.start_time)}
                            </Text>
                            {set.duration_minutes !== "0" && set.duration_minutes !== "00" && set.duration_minutes !== "00:00" && Number(set.duration_minutes) > 0 && (
                              <Text as="span" color={textColorSec} ml={3} fontWeight="medium">
                                {set.duration_minutes}{t("minutes")}
                              </Text>
                            )}
                          </Text>
                        ))
                      ) : hasConcertDate ? (
                        augmentedConcertDetail.concertDate.map((d, index) => (
                          <Text
                            key={index}
                            fontSize="md"
                            fontWeight="semibold"
                            color={textColor}
                          >
                            <Text as="span">
                              {moment(d.date).format("YYYY-MM-DD(ddd)")}
                            </Text>
                            <Text as="span" color="brand.main" fontWeight="bold" ml={3}>
                              {formatTime(d.start_time)}
                            </Text>
                            {d.duration_minutes && d.duration_minutes !== "0" && d.duration_minutes !== "00" && Number(d.duration_minutes) > 0 && (
                              <Text as="span" color={textColorSec} ml={3} fontWeight="medium">
                                {d.duration_minutes}{t("minutes")}
                              </Text>
                            )}
                          </Text>
                        ))
                      ) : (
                        <Text fontSize="md" fontWeight="medium" color={textColorSec}>
                          {t("no_date_available")}
                        </Text>
                      )}
                    </VStack>
                  </Box>
                </HStack>
              </VStack>
            </Box>

            <Divider borderColor={dividerColor} my={1} />

            {/* Performers Area */}
            <Box>
              <Text fontSize="xs" fontWeight="bold" color={textColorSec} mb={3} textTransform="uppercase" letterSpacing="0.5px">
                {t("performers")}
              </Text>
              <Flex wrap="wrap" gap={2}>
                {augmentedConcertDetail.artists?.length ? (
                  augmentedConcertDetail.artists.map((artist, index) => {
                    const isPrimary = artist === "N.Flying";
                    return (
                      <Badge
                        key={index}
                        px={3.5}
                        py={1.5}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="bold"
                        variant={isPrimary ? "solid" : "outline"}
                        bg={isPrimary ? "brand.main" : "transparent"}
                        borderColor={isPrimary ? "brand.main" : borderColor}
                        color={isPrimary ? "white" : textColorSec}
                        textTransform="none"
                        transition="all 0.2s"
                      >
                        {artist}
                      </Badge>
                    );
                  })
                ) : (
                  <Text fontSize="sm" color={textColorSec}>
                    {t("no_artists_available")}
                  </Text>
                )}
              </Flex>
            </Box>

            <Divider borderColor={dividerColor} my={1} />

            {/* Ticket Open and CTA Area */}
            <Box mt={{ base: 0, lg: "auto" }}>
              <Text fontSize="xs" fontWeight="bold" color={textColorSec} mb={3} textTransform="uppercase" letterSpacing="0.5px">
                {augmentedConcertDetail.type === "행사" || augmentedConcertDetail.type === "Event"
                  ? t("performanceInfo")
                  : t("ticket_info")}
              </Text>
              <Flex flexDirection="column" gap={4}>
                {!(augmentedConcertDetail.type === "행사" || augmentedConcertDetail.type === "Event") && (
                  <HStack spacing={2} align="center">
                    <Icon as={InfoIcon} color="brand.main" w="15px" h="15px" />
                    <Text fontSize="sm" color={textColorSec}>
                      {t("ticket_open")}:{" "}
                      <Text as="span" fontWeight="bold" color={textColor}>
                        {augmentedConcertDetail.ticketOpen.date}{" "}
                        {augmentedConcertDetail.ticketOpen.time}
                      </Text>{" "}
                      ({t("korea_time")})
                    </Text>
                  </HStack>
                )}

                {augmentedConcertDetail.ticketLink?.length > 1 ? (
                  <>
                    <Button
                      onClick={onDrawerOpen}
                      bg="brand.main"
                      color="white"
                      size="lg"
                      h="48px"
                      fontSize="sm"
                      fontWeight="bold"
                      borderRadius="full"
                      _hover={{
                        bg: "purple.600",
                        transform: "translateY(-1.5px)",
                        boxShadow: "0 4px 12px rgba(139, 92, 246, 0.2)",
                      }}
                      _active={{
                        transform: "translateY(0)",
                      }}
                      transition="all 0.2s ease"
                    >
                      {t("view_ticket_sites")}
                    </Button>

                    {isMobile ? (
                      <TicketDrawer
                        links={augmentedConcertDetail.ticketLink}
                        isOpen={isDrawerOpen}
                        onClose={onDrawerClose}
                        lang={lang}
                        t={t}
                      />
                    ) : (
                      <TicketModal
                        links={augmentedConcertDetail.ticketLink}
                        isOpen={isDrawerOpen}
                        onClose={onDrawerClose}
                        lang={lang}
                        t={t}
                      />
                    )}
                  </>
                ) : (
                  <Button
                    as={Link}
                    href={augmentedConcertDetail.ticketLink?.[0] || "#"}
                    isExternal
                    bg="brand.main"
                    color="white"
                    size="lg"
                    h="48px"
                    fontSize="sm"
                    fontWeight="bold"
                    borderRadius="full"
                    _hover={{
                      bg: "purple.600",
                      transform: "translateY(-1.5px)",
                      boxShadow: "0 4px 12px rgba(139, 92, 246, 0.2)",
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                    isDisabled={!augmentedConcertDetail.ticketLink?.[0]}
                    transition="all 0.2s ease"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    textDecoration="none"
                  >
                    {getButtonText(augmentedConcertDetail, isPastEvent, timeRemaining)}
                  </Button>
                )}
              </Flex>
            </Box>
          </MotionFlex>
        </Flex>

        {/* Bottom Details Section (Tabs) */}
        {augmentedConcertDetail && (
          <Box mt={8}>
            <Tabs
              variant="soft-rounded"
              colorScheme="purple"
              bg={cardBgColor}
              borderRadius="3xl"
              boxShadow="card"
              border="1px solid"
              borderColor={borderColor}
              p={{ base: 6, md: 8 }}
              defaultIndex={defaultTabIndex}
            >
              <TabList 
                mb={6} 
                bg={tabListBg} 
                p="4px" 
                borderRadius="full"
                display="flex"
              >
                <Tab
                  w="50%"
                  flex={1}
                  onClick={(e) => e.currentTarget.focus()}
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight="bold"
                  color={tabTextColor}
                  bg="transparent"
                  _selected={{
                    color: "white",
                    bg: "brand.main",
                    boxShadow: "soft",
                    _hover: {
                      bg: "brand.main",
                      color: "white",
                    },
                    _active: {
                      bg: "brand.main",
                    }
                  }}
                  _hover={{
                    bg: tabHoverBg,
                    color: tabTextColor,
                  }}
                  _active={{
                    bg: "transparent",
                  }}
                  _focus={{
                    boxShadow: "none",
                  }}
                  borderRadius="full"
                  py={2.5}
                  textAlign="center"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {t("show_details")}
                </Tab>
                <Tab
                  w="50%"
                  flex={1}
                  onClick={(e) => e.currentTarget.focus()}
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight="bold"
                  color={tabTextColor}
                  bg="transparent"
                  _selected={{
                    color: "white",
                    bg: "brand.main",
                    boxShadow: "soft",
                    _hover: {
                      bg: "brand.main",
                      color: "white",
                    },
                    _active: {
                      bg: "brand.main",
                    }
                  }}
                  _hover={{
                    bg: tabHoverBg,
                    color: tabTextColor,
                  }}
                  _active={{
                    bg: "transparent",
                  }}
                  _focus={{
                    boxShadow: "none",
                  }}
                  borderRadius="full"
                  py={2.5}
                  textAlign="center"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {t("show_record")}
                </Tab>
              </TabList>

              <TabPanels pt={2}>
                {/* Details Tab */}
                <TabPanel p={0}>
                  <VStack spacing={8} align="stretch">
                    {augmentedConcertDetail.address && (
                      <Box>
                        <HStack mb={5} spacing={3}>
                          <Flex 
                            align="center" 
                            justify="center" 
                            w="36px" 
                            h="36px" 
                            borderRadius="full" 
                            bg="brand.purpleSoft"
                          >
                            <Icon as={ClipboardList} color="brand.main" w="18px" h="18px" />
                          </Flex>
                          <Text fontSize="xl" fontWeight="black" color={textColor}>
                            {t("basic_info")}
                          </Text>
                        </HStack>
                        
                        <VStack align="stretch" spacing={5} pl={{ base: 0, md: 4 }}>
                          {/* Address Details */}
                          <Box>
                            <Text fontSize="xs" color="gray.400" fontWeight="bold" textTransform="uppercase" letterSpacing="1px" mb={1}>
                              {t("address")}
                            </Text>
                            <Text fontSize="md" color={textColor} fontWeight="bold">
                              {augmentedConcertDetail.address}
                            </Text>
                          </Box>
                          
                          {augmentedConcertDetail.capacity && (
                            <Box>
                              <Text fontSize="xs" color="gray.400" fontWeight="bold" textTransform="uppercase" letterSpacing="1px" mb={1}>
                                {t("capacity")}
                              </Text>
                              <Text fontSize="md" color={textColor} fontWeight="bold">
                                {augmentedConcertDetail.capacity}
                              </Text>
                            </Box>
                          )}

                          {augmentedConcertDetail.note?.length && augmentedConcertDetail.note?.length >= 0 && (
                            <Box>
                              <Text fontSize="xs" color="gray.400" fontWeight="bold" textTransform="uppercase" letterSpacing="1px" mb={3}>
                                {t("notes")}
                              </Text>
                              <VStack align="stretch" spacing={3}>
                                {augmentedConcertDetail.note.map((note, index) =>
                                  note.endsWith(".png") ||
                                    note.endsWith(".jpg") ||
                                    note.endsWith(".jpeg") ||
                                    note.endsWith(".gif") ? (
                                    <Box 
                                      key={index} 
                                      borderRadius="2xl" 
                                      overflow="hidden" 
                                      boxShadow="soft"
                                      cursor="zoom-in"
                                      onClick={() => setLightboxImage(note)}
                                      transition="all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                                      _hover={{ opacity: 0.95, transform: "scale(1.01)", boxShadow: "card" }}
                                    >
                                      <Image
                                        src={note}
                                        alt={`${t("note_image")} ${index + 1}`}
                                        objectFit="cover"
                                        w="100%"
                                      />
                                    </Box>
                                  ) : (
                                    <HStack key={index} align="start" spacing={2.5}>
                                      <Icon as={Sparkles} color="brand.main" w="14px" h="14px" mt="3px" flexShrink={0} />
                                      <Text fontSize="md" color={textColorSec} fontWeight="semibold">
                                        {note}
                                      </Text>
                                    </HStack>
                                  )
                                )}
                              </VStack>
                            </Box>
                          )}
                          
                          {augmentedConcertDetail?.infoImage &&
                            augmentedConcertDetail.infoImage.length > 0 && (
                              <Box mt={2}>
                                <Text fontSize="xs" color="gray.400" fontWeight="bold" textTransform="uppercase" letterSpacing="1px" mb={3}>
                                  {t("performanceInfo")}
                                </Text>
                                <VStack align="stretch" spacing={3}>
                                  {augmentedConcertDetail.infoImage.map((info, index) =>
                                    info.image ? (
                                      <Box
                                        key={index}
                                        borderRadius="2xl"
                                        overflow="hidden"
                                        boxShadow="soft"
                                        cursor="zoom-in"
                                        onClick={() => setLightboxImage(info.image)}
                                        transition="all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                                        _hover={{ opacity: 0.95, transform: "scale(1.01)", boxShadow: "card" }}
                                      >
                                        <Image
                                          src={info.image}
                                          alt={`${t("performanceInfo")} ${index + 1}`}
                                          objectFit="cover"
                                          w="100%"
                                        />
                                      </Box>
                                    ) : null
                                  )}
                                </VStack>
                              </Box>
                            )}
                        </VStack>
                      </Box>
                    )}
                    
                    {/* Seating Map */}
                    {augmentedConcertDetail.seats?.length && augmentedConcertDetail.seats?.length >= 0 &&
                      augmentedConcertDetail.seats.some((seat) => seat.image) && (
                        <Box mt={2}>
                          <HStack mb={4} spacing={3}>
                            <Flex 
                              align="center" 
                              justify="center" 
                              w="36px" 
                              h="36px" 
                              borderRadius="full" 
                              bg={seatBg}
                            >
                              <Icon as={Armchair} color={seatIconColor} w="18px" h="18px" />
                            </Flex>
                            <Text fontSize="xl" fontWeight="black" color={textColor}>
                              {t("seat_map")}
                            </Text>
                          </HStack>
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} pl={{ base: 0, md: 4 }}>
                            {augmentedConcertDetail.seats.map((seat, index) =>
                              seat.image ? (
                                <Box 
                                  key={index} 
                                  borderRadius="2xl" 
                                  overflow="hidden" 
                                  boxShadow="soft"
                                  cursor="zoom-in"
                                  onClick={() => setLightboxImage(seat.image)}
                                  transition="all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                                  _hover={{ opacity: 0.95, transform: "scale(1.01)", boxShadow: "card" }}
                                >
                                  <Image
                                    key={index}
                                    src={seat.image}
                                    alt={`${t("seat_map")} ${index + 1}`}
                                    objectFit="cover"
                                    w="100%"
                                  />
                                </Box>
                              ) : null
                            )}
                          </SimpleGrid>
                        </Box>
                      )}
                  </VStack>
                </TabPanel>

                {/* Show Record Tab */}
                <TabPanel p={0}>
                  <SetlistComponent
                    lang={lang}
                    cardBgColor={cardBgColor}
                    augmentedConcertDetail={augmentedConcertDetail}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        )}
      </Box>

      {/* Fullscreen click-to-zoom Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <Box
            position="fixed"
            top={0}
            left={0}
            w="100vw"
            h="100vh"
            bg="rgba(0, 0, 0, 0.85)"
            backdropFilter="blur(16px)"
            zIndex={99999}
            onClick={() => setLightboxImage(null)}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Box
              maxW="90%"
              maxH="90%"
              as={motion.div}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 } as any}
              position="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxImage}
                alt="Enlarged poster/map"
                borderRadius="xl"
                boxShadow="2xl"
                maxH="85vh"
                objectFit="contain"
              />
              <Button
                position="absolute"
                top="-50px"
                right="0"
                color="white"
                variant="ghost"
                onClick={() => setLightboxImage(null)}
                fontSize="sm"
                fontWeight="black"
                borderRadius="full"
                bg="whiteAlpha.100"
                px={5}
                _hover={{ bg: "whiteAlpha.350" }}
                transition="all 0.2s"
              >
                {t("close")}
              </Button>
            </Box>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default DetailPage;