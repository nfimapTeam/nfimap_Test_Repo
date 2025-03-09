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
} from "@chakra-ui/react";
import {
  CalendarIcon,
  TimerIcon,
  MapPinIcon,
  InfoIcon,
  MusicIcon,
  CameraIcon,
  UsersIcon,
} from "lucide-react";
import NotFound from "../components/NotFound";
import Card from "../components/Card";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Comments from "../components/Comments";
import { useConcertDetail } from "../api/concerts/concertsDetailApi";
import { useConcertList } from "../api/concerts/concertsApi";

interface Concert {
  id: number;
  name: string;
  location: string;
  type: string;
  performanceType: string;
  startTime: string;
  artists: string[];
  ticketLink: string;
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
    duration_minutes: number;
    music: {
      music: {
        name: string;
        youtube_url: string;
      }
      status: string;
      play_order: number;
    }[]; // 문자열 또는 객체 배열
    start_time: string;
  }[];
}

// TimeRemaining 타입 정의
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

  const { data: concertDetail, refetch: refetchConcertDetail } = useConcertDetail(id ?? "", lang);

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



  if (!id || !concertDetail) {
    return <NotFound content="정보가 없습니다." />;
  }

  const concertDates: string[] = concertDetail.setlist?.map((set: { date: string }) => set.date) || concertDetail.concertDate.map((d: { date: string }) => d.date) || [];
  const augmentedConcertDetail: Concert = {
    ...concertDetail,
    date: concertDates,
    concertDate: concertDetail.concertDate || (concertDetail.setlist?.map((set: { date: string, start_time: string, duration_minutes: string }) => ({
      date: set.date,
      start_time: set.start_time,
      duration_minutes: set.duration_minutes,
    })) || []),
    durationMinutes: concertDetail.setlist?.[0]?.duration_minutes || concertDetail.concertDate[0]?.duration_minutes || 0,
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
    const hours = diffDuration.hours()

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
    } else if (concert.ticketLink === "") {
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

  const isPastEvent: boolean = !isEventTodayOrFuture(augmentedConcertDetail.date);
  const timeRemaining: TimeRemaining | null = calculateTimeRemaining(
    augmentedConcertDetail.ticketOpen.date,
    augmentedConcertDetail.ticketOpen.time
  );


  return (
    <Box height="calc(100svh - 120px)">
      <Box p="16px 16px 100px 16px" width="100%" maxWidth="1200px" mx="auto">
        <Flex direction={{ base: "column", md: "row" }} gap={8} align="stretch">
          <Flex
            flex={1}
            justifyContent="center"
            alignItems="center"
            bg={cardBgColor}
            p={6}
            borderRadius="lg"
            boxShadow="md"
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
            <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="md">
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
                <HStack>
                  <Icon as={CalendarIcon} color="gray.500" />
                  <Text fontSize="lg">{augmentedConcertDetail.date.join(" - ")}</Text>
                </HStack>
                <HStack>
                  <Icon as={TimerIcon} color="gray.500" />
                  <Text fontSize="lg">{augmentedConcertDetail.startTime}</Text>
                </HStack>
              </VStack>
            </Box>

            <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="md">
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

            <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="md">
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

                <Button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleButtonClick(e, augmentedConcertDetail, isPastEvent)
                  }
                  as={Link}
                  href={augmentedConcertDetail.ticketLink}
                  isExternal
                  border="2px solid #eee"
                  bg="brand.sub2"
                  _hover={{ bg: "brand.main" }}
                  color="white"
                >
                  {getButtonText(augmentedConcertDetail, isPastEvent, timeRemaining)}
                </Button>
              </Flex>
            </Box>
          </Flex>
        </Flex>

        {augmentedConcertDetail && (
          <Box mt={8}>
            <Divider mb={4} />
            <Text fontSize="3xl" fontWeight="bold" mb={4} color="teal.600">
              {t("performance_details")}
            </Text>

            <VStack spacing={6} align="stretch">
              {augmentedConcertDetail.address && (
                <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="lg">
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
                          note.endsWith(".png") || note.endsWith(".jpg") || note.endsWith(".jpeg") || note.endsWith(".gif") ? (
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
                  </VStack>
                </Box>
              )}

              {augmentedConcertDetail.setlist && augmentedConcertDetail.setlist.length > 0 && (
                <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="lg">
                  <HStack mb={4} justify="center">
                    <Icon as={MusicIcon} color="purple.500" boxSize={6} />
                    <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                      {t("setlist")}
                    </Text>
                  </HStack>
                  <Tabs variant="soft-rounded" colorScheme="purple">
                    <TabList overflowX="auto" whiteSpace="nowrap" mb={4}>
                      {augmentedConcertDetail.setlist.map((set, index) => (
                        <Tab key={index}>
                          {moment(set.date, "YYYY-MM-DD").format("YYYY-MM-DD")}
                        </Tab>
                      ))}
                    </TabList>
                    <TabPanels>
                      {augmentedConcertDetail.setlist.map((set, index) => (
                        <TabPanel key={index}>
                          <SimpleGrid columns={1} spacing={4}>
                            {set.music.length > 0 ? (
                              set.music.map((song, songIndex) => (
                                <Box
                                  key={songIndex}
                                  p={4}
                                  bg="white"
                                  borderRadius="xl"
                                  boxShadow="0 4px 12px rgba(0,0,0,0.1)"
                                  border="2px solid"
                                  borderColor="purple.100"
                                  _hover={{
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                                    borderColor: "purple.300",
                                  }}
                                  transition="all 0.2s"
                                  onClick={() => {
                                    window.open(song.music.youtube_url, "_blank"); // 새로운 탭에서 유튜브 URL 열기
                                  }}
                                  cursor="pointer"
                                >
                                  <Flex align="center" justify="center" gap={3}>
                                    <Text
                                      fontSize="xl"
                                      fontWeight="bold"
                                      color="purple.500"
                                      w="36px"
                                      textAlign="right"
                                    >
                                      {(songIndex + 1).toString().padStart(2, "0")}
                                    </Text>
                                    <Text
                                      fontSize="lg"
                                      fontWeight="medium"
                                      color="gray.700"
                                      letterSpacing="wide"
                                    >
                                      {song.music.name} {/* song.music에서 name을 바로 사용 */}
                                    </Text>
                                  </Flex>
                                </Box>
                              ))
                            ) : (
                              <Flex w="100%" justifyContent="center" alignItems="center">
                                <Text color="gray.500">{t("no_setlist_available")}</Text>
                              </Flex>
                            )}
                          </SimpleGrid>
                        </TabPanel>
                      ))}
                    </TabPanels>
                  </Tabs>
                </Box>
              )}



              {augmentedConcertDetail.ootd && augmentedConcertDetail.ootd.length > 0 && augmentedConcertDetail.ootd[0] !== "" && (
                <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="lg">
                  <HStack mb={3}>
                    <Icon as={CameraIcon} color="purple.600" />
                    <Text fontSize="xl" fontWeight="bold" color="gray.700">
                      {t("costume")}
                    </Text>
                  </HStack>
                  <SimpleGrid columns={1} spacing={4}>
                    {augmentedConcertDetail.ootd.map((image: any, index: number) => (
                      <Image
                        key={index}
                        src={image.image}
                        alt={`공연 의상 ${index + 1}`}
                        borderRadius="md"
                        boxShadow="md"
                        objectFit="cover"
                        w="100%"
                      />
                    ))}
                  </SimpleGrid>
                </Box>
              )}

              {augmentedConcertDetail.seats && augmentedConcertDetail.seats.length > 0 && augmentedConcertDetail.seats.some((seat: { image: string }) => seat.image) && (
                <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="lg">
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
          </Box>
        )}
        {/* <Comments /> */}
      </Box>
    </Box>
  );
};

export default DetailPage;