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
  concertDate: { date: string; start_time: string; duration_minutes: number }[];
  date: string[];
  durationMinutes?: number;
  address?: string;
  note?: string[];
  capacity?: string;
  seats?: { image: string }[];
  ootd?: string[];
  setlist?: {
    date: string;
    formatted_date: string;
    duration_minutes: number;
    music: {
      music: {
        name: string;
        youtube_url: string;
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
  const [lang, setLang] = useState<"ko" | "en">("ko");
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
    refetchConcertDetail();
  }, [lang, refetchConcertDetail]);

  if (isLoading) {
    return <Loading />
  }

  if (!id || !concertDetail) {
    return <NotFound content="정보가 없습니다." />;
  }

  const concertDates: string[] =
    concertDetail.setlist?.map((set: { date: string }) => set.date) ||
    concertDetail.concertDate.map((d: { date: string }) => d.date) ||
    [];
  const augmentedConcertDetail: Concert = {
    ...concertDetail,
    date: concertDates,
    concertDate:
      concertDetail.concertDate ||
      (concertDetail.setlist?.map(
        (set: { date: string; start_time: string; duration_minutes: string }) => ({
          date: set.date,
          start_time: set.start_time,
          duration_minutes: set.duration_minutes,
        })
      ) || []),
    durationMinutes:
      concertDetail.setlist?.[0]?.duration_minutes ||
      concertDetail.concertDate[0]?.duration_minutes ||
      0,
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

  console.log(augmentedConcertDetail);

  const isPastEvent: boolean = !isEventTodayOrFuture(augmentedConcertDetail.date);
  const timeRemaining: TimeRemaining | null = calculateTimeRemaining(
    augmentedConcertDetail.ticketOpen.date,
    augmentedConcertDetail.ticketOpen.time
  );

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return lang === "ko" ? `${hours}시간` : `${hours} hour${hours !== 1 ? "s" : ""}`;
  };

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
            <Box bg={cardBgColor} p={6} border="1px solid"
              borderRadius="2xl"
              boxShadow="xl"
              borderColor="purple.100">
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
                    {augmentedConcertDetail.setlist && augmentedConcertDetail.setlist.length > 0 ? (
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
                          <Text as="span" color="gray.500" fontWeight="medium" ml={2}>
                            ({formatDuration(set.duration_minutes)})
                          </Text>
                        </Text>
                      ))
                    ) : augmentedConcertDetail.concertDate && augmentedConcertDetail.concertDate.length > 0 ? (
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
                          <Text as="span" color="gray.500" fontWeight="medium" ml={2}>
                            ({formatDuration(d.duration_minutes)})
                          </Text>
                        </Text>
                      ))
                    ) : (
                      <Text
                        fontSize={{ base: "md", md: "lg" }}
                        py={0.5}
                      >
                        -
                      </Text>
                    )}
                  </VStack>
                </HStack>
              </VStack>
            </Box>

            <Box bg={cardBgColor} p={6} border="1px solid"
              borderRadius="2xl"
              boxShadow="xl"
              borderColor="purple.100">
              <Text fontSize="xl" fontWeight="semibold" mb={3}>
                {t("performers")}
              </Text>
              <Flex wrap="wrap" gap={2}>
                {augmentedConcertDetail.artists.map((artist: string, index: number) => (
                  <Badge key={index} colorScheme="purple" fontSize="md">
                    {artist}
                  </Badge>
                ))}
              </Flex>
            </Box>

            <Box bg={cardBgColor} p={6} border="1px solid"
              borderRadius="2xl"
              boxShadow="xl"
              borderColor="purple.100">
              <Text fontSize="xl" fontWeight="semibold" mb={3}>
                {augmentedConcertDetail.type === "행사" || augmentedConcertDetail.type === "Event"
                  ? t("performanceInfo")
                  : t("ticket_info")}
              </Text>
              <Flex flexDirection="column" gap={3}>
                <Flex>
                  {!(augmentedConcertDetail.type === "행사" || augmentedConcertDetail.type === "Event") && (
                    <Badge
                      colorScheme="green"
                      fontSize="md"
                      alignItems="center"
                      overflow="visible"
                      whiteSpace="normal"
                    >
                      <Text>
                        {t("ticket_open")}: {augmentedConcertDetail.ticketOpen.date}{" "}
                        {augmentedConcertDetail.ticketOpen.time} ({t("korea_time")})
                      </Text>
                    </Badge>
                  )}
                </Flex>

                {augmentedConcertDetail.ticketLink.length > 1 ? (
                  <>
                    <Button
                      onClick={onDrawerOpen} // 드로어든 모달이든 여는 트리거는 이걸로 통일
                      bg="brand.sub2"
                      color="white"
                      _hover={{ bg: "brand.main" }}
                    >
                      {t("view_ticket_sites")}
                    </Button>

                    {isMobile ? (
                      <TicketDrawer
                        links={augmentedConcertDetail.ticketLink}
                        isOpen={isDrawerOpen}
                        onClose={onDrawerClose}
                        lang={lang}
                      />
                    ) : (
                      <TicketModal
                        links={augmentedConcertDetail.ticketLink}
                        isOpen={isDrawerOpen} // 똑같이 드로어용 상태 재활용
                        onClose={onDrawerClose}
                        lang={lang}
                      />
                    )}
                  </>
                ) : (
                  <Button
                    as={Link}
                    href={augmentedConcertDetail.ticketLink[0]}
                    isExternal
                    bg='#9F7AEA'
                    color="white"
                    _hover={{ bg: "brand.main" }}
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
                  {t("info")}
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
                    borderColor: "purple.200"
                  }}
                  borderRadius="lg"
                  px={4}
                  py={2}
                  textAlign="center"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {t("setlist")}
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
                          {augmentedConcertDetail.note && augmentedConcertDetail.note.length > 0 && (
                            <>
                              <Text fontSize="lg" color="gray.800">
                                <strong>{t("notes")}</strong>
                                <br />
                              </Text>
                              {augmentedConcertDetail.note.map((note: string, index: number) =>
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
                          <SimpleGrid columns={1} spacing={4}>
                            {augmentedConcertDetail.infoImage && augmentedConcertDetail.infoImage.length > 0 && augmentedConcertDetail?.infoImage.map((info: { image: string }, index: number) =>
                              info.image ? (
                                <Image
                                  key={index}
                                  src={info.image}
                                  alt={`좌석 배치도 ${index + 1}`}
                                  borderRadius="md"
                                  boxShadow="md"
                                  objectFit="cover"
                                  w="100%"
                                />
                              ) : null
                            )}
                          </SimpleGrid>
                        </VStack>
                      </Box>
                    )}
                    {augmentedConcertDetail.seats &&
                      augmentedConcertDetail.seats.length > 0 &&
                      augmentedConcertDetail.seats.some((seat: { image: string }) => seat.image) && (
                        <Box>
                          <HStack mb={3}>
                            <Icon as={UsersIcon} color="orange.600" />
                            <Text fontSize="xl" fontWeight="bold" color="gray.700">
                              {t("seat_map")}
                            </Text>
                          </HStack>
                          <SimpleGrid columns={1} spacing={4}>
                            {augmentedConcertDetail.seats.map((seat: { image: string }, index: number) =>
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