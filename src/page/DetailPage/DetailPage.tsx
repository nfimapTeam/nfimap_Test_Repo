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
} from "@chakra-ui/react";
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

const DetailPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cardBgColor = useColorModeValue("white", "gray.800");
  const currentTime = moment();
  const [allConcerts, setAllConcerts] = useState<Concert[]>([]);
  const [lang, setLang] = useState(i18n.language);
  const isMobileOrTablet = useBreakpointValue({ base: true, md: true, lg: false });
  const { data: concertDetail, refetch: refetchConcertDetail, isLoading } = useConcertDetail(id ?? "", lang);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSetlist, setSelectedSetlist] = useState<any>(null);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();

  useEffect(() => {
    if (i18n.language === "ko") {
      setLang("ko");
    } else {
      setLang("en");
    }
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
    return <NotFound content="정보가 없습니다." />;
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
    <Box h={isMobileOrTablet ? "calc(100svh - 120px)" : "calc(100svh - 70px)"}>
      <Box p="16px 16px 100px 16px" width="100%" maxWidth="1200px" mx="auto">
        <Flex direction={{ base: "column", md: "row" }} gap={8} align="stretch">
          <Flex
            flex={1}
            justifyContent="center"
            alignItems="center"
            bg={cardBgColor}
            p={6}
            border="1px solid"
            borderRadius="2xl"
            boxShadow="xl"
            borderColor="purple.100"
          >
            <Box maxW={{ base: "100%", md: "400px" }} w="100%">
              <Image
                src={augmentedConcertDetail.poster}
                alt={augmentedConcertDetail.name}
                w="100%"
                h="auto"
                p={4}
                maxH={{ base: "400px", md: "600px" }}
                objectFit="contain"
                borderRadius="lg"
                fallbackSrc="/image/logo/logo.svg"
              />
            </Box>
          </Flex>

          <Flex flexDirection="column" justifyContent="space-between" flex={1} gap={4}>
            <Box bg={cardBgColor} p={6} border="1px solid" borderRadius="2xl" boxShadow="xl" borderColor="purple.100">
              <Badge colorScheme="red" fontSize="md" mb={2}>
                {augmentedConcertDetail.type}
              </Badge>
              <Text fontSize="3xl" fontWeight="bold" mb={4}>
                {augmentedConcertDetail.name}
              </Text>

              <VStack align="start" spacing={3}>
                <HStack>
                  <Icon as={MapPinIcon} color="gray.500" />
                  <Text fontSize="lg">{augmentedConcertDetail.location}</Text>
                </HStack>
                <HStack align="start">
                  <Icon as={CalendarIcon} color="gray.500" mt={2} />
                  <VStack align="start" spacing={2}>
                    {hasSetlist && augmentedConcertDetail.setlist ? (
                      augmentedConcertDetail.setlist.map((set, index) => (
                        <Text
                          key={index}
                          fontSize={{ base: "md", md: "lg" }}
                          py={0.5}
                        >
                          <Text as="span" fontWeight="medium">
                            {set.formatted_date}
                          </Text>
                          <Text as="span" color="purple.600" fontWeight="semibold" ml={2}>
                            {formatTime(set.start_time)}
                          </Text>
                          {set.duration_minutes !== "0" && set.duration_minutes !== "00" && set.duration_minutes !== "00:00" && Number(set.duration_minutes) > 0 && (
                            <Text as="span" color="gray.500" fontWeight="medium" ml={2}>
                              {set.duration_minutes}{t("minutes")}
                            </Text>
                          )}
                        </Text>
                      ))
                    ) : hasConcertDate ? (
                      augmentedConcertDetail.concertDate.map((d, index) => (
                        <Text
                          key={index}
                          fontSize={{ base: "md", md: "lg" }}
                          py={0.5}
                        >
                          <Text as="span" fontWeight="medium">
                            {moment(d.date).format("YYYY-MM-DD(ddd)")}
                          </Text>
                          <Text as="span" color="purple.600" fontWeight="semibold" ml={2}>
                            {formatTime(d.start_time)}
                          </Text>
                          {d.duration_minutes && d.duration_minutes !== "0" && d.duration_minutes !== "00" && Number(d.duration_minutes) > 0 && (
                            <Text as="span" color="gray.500" fontWeight="medium" ml={2}>
                              {d.duration_minutes}{t("minutes")}
                            </Text>
                          )}
                        </Text>
                      ))
                    ) : (
                      <Text fontSize={{ base: "md", md: "lg" }} py={0.5}>
                        {t("no_date_available")}
                      </Text>
                    )}
                  </VStack>
                </HStack>
              </VStack>
            </Box>

            <Box bg={cardBgColor} p={6} border="1px solid" borderRadius="2xl" boxShadow="xl" borderColor="purple.100">
              <Text fontSize="xl" fontWeight="semibold" mb={3}>
                {t("performers")}
              </Text>
              <Flex wrap="wrap" gap={2}>
                {augmentedConcertDetail.artists?.length ? (
                  augmentedConcertDetail.artists.map((artist, index) => (
                    <Box key={index} fontSize="md">
                      <Text
                        as="span"
                        fontWeight={artist === "N.Flying" ? "bold" : "md"}
                        color={artist === "N.Flying" ? "purple.500" : "black"}
                      >
                        {artist}
                      </Text>
                    </Box>
                  ))
                ) : (
                  <Text fontSize="md" color="gray.500">
                    {t("no_artists_available")}
                  </Text>
                )}
              </Flex>
            </Box>

            <Box bg={cardBgColor} p={6} border="1px solid" borderRadius="2xl" boxShadow="xl" borderColor="purple.100">
              <Text fontSize="xl" fontWeight="semibold" mb={3}>
                {augmentedConcertDetail.type === "행사" || augmentedConcertDetail.type === "Event"
                  ? t("performanceInfo")
                  : t("ticket_info")}
              </Text>
              <Flex flexDirection="column" gap={3}>
                <Flex>
                  {!(augmentedConcertDetail.type === "행사" || augmentedConcertDetail.type === "Event") && (
                    <Text>
                      {t("ticket_open")}: {augmentedConcertDetail.ticketOpen.date}{" "}
                      {augmentedConcertDetail.ticketOpen.time} ({t("korea_time")})
                    </Text>
                  )}
                </Flex>

                {augmentedConcertDetail.ticketLink?.length > 1 ? (
                  <>
                    <Button
                      onClick={onDrawerOpen}
                      bg="#9F7AEA"
                      color="white"
                      _hover={{ bg: "#9F7AEA" }}
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
                    bg="#9F7AEA"
                    color="white"
                    _hover={{ bg: "brand.main" }}
                    isDisabled={!augmentedConcertDetail.ticketLink?.[0]}
                  >
                    {getButtonText(augmentedConcertDetail, isPastEvent, timeRemaining)}
                  </Button>
                )}
              </Flex>
            </Box>
          </Flex>
        </Flex>

        {augmentedConcertDetail && (
          <Box mt={8}>
            <Tabs
              variant="soft-rounded"
              colorScheme="purple"
              bg={cardBgColor}
              borderRadius="2xl"
              boxShadow="xl"
              border="1px solid"
              borderColor="purple.100"
              p={6}
              defaultIndex={defaultTabIndex} // Set default tab dynamically
            >
              <TabList mb={6}>
                <Tab
                  w="50%"
                  maxW="50%"
                  onClick={(e) => e.currentTarget.focus()}
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="semibold"
                  color="gray.500"
                  _selected={{
                    color: "white",
                    bg: "purple.400",
                    borderColor: "purple.200",
                  }}
                  borderRadius="lg"
                  px={4}
                  py={2}
                  textAlign="center"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {t("show_details")}
                </Tab>
                <Tab
                  w="50%"
                  maxW="50%"
                  onClick={(e) => e.currentTarget.focus()}
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="semibold"
                  color="gray.500"
                  _selected={{
                    color: "white",
                    bg: "purple.400",
                    borderColor: "purple.200",
                  }}
                  borderRadius="lg"
                  px={4}
                  py={2}
                  textAlign="center"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {t("show_record")}
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    {augmentedConcertDetail.address && (
                      <Box>
                        <HStack mb={3}>
                          <Icon as={InfoIcon} color="blue.600" />
                          <Text fontSize="xl" fontWeight="bold" color="gray.700">
                            {t("basic_info")}
                          </Text>
                        </HStack>
                        <VStack align="start" spacing={3}>
                          <Text fontSize="lg" color="gray.800">
                            <strong>{t("address")}</strong>
                          </Text>
                          <Text fontSize="lg" color="gray.800">
                            {"\u2022"} {augmentedConcertDetail.address}
                          </Text>
                          {augmentedConcertDetail.capacity && (
                            <>
                              <Text fontSize="lg" color="gray.800">
                                <strong>{t("capacity")}</strong>
                              </Text>
                              <Text fontSize="lg" color="gray.800">
                                {"\u2022"} {augmentedConcertDetail.capacity}
                              </Text>
                            </>
                          )}
                          {augmentedConcertDetail.note?.length && augmentedConcertDetail.note?.length >= 0 && (
                            <>
                              <Text fontSize="lg" color="gray.800">
                                <strong>{t("notes")}</strong>
                              </Text>
                              {augmentedConcertDetail.note.map((note, index) =>
                                note.endsWith(".png") ||
                                  note.endsWith(".jpg") ||
                                  note.endsWith(".jpeg") ||
                                  note.endsWith(".gif") ? (
                                  <Image
                                    key={index}
                                    src={note}
                                    alt={`노트 이미지 ${index + 1}`}
                                    borderRadius="md"
                                    boxShadow="md"
                                    objectFit="cover"
                                    w="100%"
                                  />
                                ) : (
                                  <Text key={index} fontSize="lg" color="gray.600">
                                    {"\u2022"} {note}
                                  </Text>
                                )
                              )}
                            </>
                          )}
                          {augmentedConcertDetail?.infoImage &&
                            augmentedConcertDetail.infoImage.length > 0 && (
                              <SimpleGrid columns={1} spacing={4}>
                                {augmentedConcertDetail.infoImage.map((info, index) =>
                                  info.image && (
                                    <Image
                                      key={index}
                                      src={info.image}
                                      alt={`좌석 배치도 ${index + 1}`}
                                      borderRadius="md"
                                      boxShadow="md"
                                      objectFit="cover"
                                      w="100%"
                                    />
                                  )
                                )}
                              </SimpleGrid>
                            )
                          }
                        </VStack>
                      </Box>
                    )}
                    {augmentedConcertDetail.seats?.length && augmentedConcertDetail.seats?.length >= 0 &&
                      augmentedConcertDetail.seats.some((seat) => seat.image) && (
                        <Box>
                          <HStack mb={3}>
                            <Icon as={UsersIcon} color="orange.600" />
                            <Text fontSize="xl" fontWeight="bold" color="gray.700">
                              {t("seat_map")}
                            </Text>
                          </HStack>
                          <SimpleGrid columns={1} spacing={4}>
                            {augmentedConcertDetail.seats.map((seat, index) =>
                              seat.image ? (
                                <Image
                                  key={index}
                                  src={seat.image}
                                  alt={`좌석 배치도 ${index + 1}`}
                                  borderRadius="md"
                                  boxShadow="md"
                                  objectFit="cover"
                                  w="100%"
                                />
                              ) : null
                            )}
                          </SimpleGrid>
                        </Box>
                      )}
                  </VStack>
                </TabPanel>
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
    </Box>
  );
};

export default DetailPage;