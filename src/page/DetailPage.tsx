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

type ShowInfo = {
  id: number;
  name: string;
  address: string;
  note: string[];
  capacity: string;
  seats: string[];
  setlist: string[];
  ootd: string[];
};

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
  const [lang, setLang] = useState("ko");

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
  }, [lang]);

  if (!id) {
    return <NotFound content="정보가 없습니다." />;
  }

  const isEventTodayOrFuture = (dates: string[]): boolean => {
    return dates?.some((date) => {
      const concertDate = moment(date.split("(")[0], "YYYY-MM-DD");
      return concertDate?.isSameOrAfter(currentTime, "day");
    });
  };

  const calculateTimeRemaining = (
    openDate: string,
    openTime: string
  ): TimeRemaining | null => {
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

  const shuffleArray = (array: Concert[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const upcomingConcerts = allConcerts.filter(
    (c) => isEventTodayOrFuture(c.date) && c.id !== parseInt(id)
  );

  const isPastEvent = !isEventTodayOrFuture(concertDetail?.date);
  const timeRemaining = calculateTimeRemaining(
    concertDetail?.ticketOpen.date,
    concertDetail?.ticketOpen.time
  );

  const randomUpcomingConcerts = shuffleArray(upcomingConcerts).slice(0, 3);

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
                src={concertDetail?.poster}
                alt={concertDetail?.name}
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

          <Flex
            flexDirection="column"
            justifyContent="space-between"
            flex={1}
            gap={4}
          >
            <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="md">
              <Badge colorScheme="red" fontSize="md" mb={2}>
                {concertDetail?.type}
              </Badge>
              <Text fontSize="3xl" fontWeight="bold" mb={4}>
                {concertDetail?.name}
              </Text>

              <VStack align="start" spacing={3}>
                <HStack>
                  <Icon as={MapPinIcon} color="gray.500" />
                  <Text fontSize="lg">{concertDetail?.location}</Text>
                </HStack>
                <HStack>
                  <Icon as={CalendarIcon} color="gray.500" />
                  <Text fontSize="lg">{concertDetail?.date.join(" - ")}</Text>
                </HStack>
                <HStack>
                  <Icon as={TimerIcon} color="gray.500" />
                  <Text fontSize="lg">
                    {concertDetail?.startTime} ({t("about")} {concertDetail?.durationMinutes}
                    {t("minutes")})
                  </Text>
                </HStack>
              </VStack>
            </Box>

            <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="md">
              <Text fontSize="xl" fontWeight="semibold" mb={3}>
                {t("performers")}
              </Text>
              <Flex wrap="wrap" gap={2}>
                {concertDetail?.artists.map((artist: string, index: number) => (
                  <Badge key={index} colorScheme="purple" fontSize="md">
                    {artist}
                  </Badge>
                ))}
              </Flex>
            </Box>

            <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="md">
              <Text fontSize="xl" fontWeight="semibold" mb={3}>
                {concertDetail?.type === "행사" || concertDetail?.type === "Event"
                  ? t("performanceInfo")
                  : t("ticket_info")}
              </Text>
              <Flex flexDirection="column" gap={3}>
                <Flex>
                  {!(concertDetail?.type === "행사" || concertDetail?.type === "Event") && (
                    <Badge
                      colorScheme="green"
                      fontSize="md"
                      alignItems="center"
                      overflow="visible"
                      whiteSpace="normal"
                    >
                      <Text>
                        {t("ticket_open")}: {concertDetail?.ticketOpen.date}{" "}
                        {concertDetail?.ticketOpen.time} ({t("korea_time")})
                      </Text>
                    </Badge>
                  )}
                </Flex>

                <Button
                  onClick={(e) => handleButtonClick(e, concertDetail, isPastEvent)}
                  as={Link}
                  href={concertDetail?.ticketLink}
                  isExternal
                  border="2px solid #eee"
                  bg="brand.sub2"
                  _hover={{ bg: "brand.main" }}
                  color="white"
                >
                  {getButtonText(concertDetail, isPastEvent, timeRemaining)}
                </Button>
              </Flex>
            </Box>
          </Flex>
        </Flex>

        {concertDetail && (
          <Box mt={8}>
            <Divider mb={4} />
            <Text fontSize="3xl" fontWeight="bold" mb={4} color="teal.600">
              {t("performance_details")}
            </Text>

            <VStack spacing={6} align="stretch">
              {concertDetail?.address && (
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
                      &nbsp;{"\u2022"} {concertDetail?.address}
                    </Text>
                    {concertDetail?.capacity && (
                      <>
                        <Text fontSize="lg" color="gray.800">
                          <strong>{t("capacity")}</strong>
                        </Text>
                        <Text fontSize="lg" color="gray.800">
                          &nbsp;{"\u2022"} {concertDetail?.capacity}
                        </Text>
                      </>
                    )}
                    {concertDetail?.note &&
                      concertDetail?.note.length > 0 &&
                      concertDetail?.note[0] !== "" && (
                        <>
                          <Text fontSize="lg" color="gray.800">
                            <strong>{t("notes")}</strong>
                            <br />
                          </Text>
                          {concertDetail.note.map((note: string, index: number) =>
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
                                &nbsp;{"\u2022"} {note}
                              </Text>
                            )
                          )}
                        </>
                      )}
                  </VStack>
                </Box>
              )}

              {concertDetail.setlist &&
                concertDetail.setlist.length > 0 &&
                concertDetail.setlist[0] !== "" && (
                  <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="lg">
                    <HStack mb={4} justify="center">
                      <Icon as={MusicIcon} color="purple.500" boxSize={6} />
                      <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                        {t("setlist")}
                      </Text>
                    </HStack>
                    <SimpleGrid columns={1} spacing={4}>
                      {concertDetail.setlist.map((song: string, index: number) => (
                        <Box
                          key={index}
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
                        >
                          <Flex align="center" justify="center" gap={3}>
                            <Text
                              fontSize="xl"
                              fontWeight="bold"
                              color="purple.500"
                              w="36px"
                              textAlign="right"
                            >
                              {(index + 1).toString().padStart(2, '0')}
                            </Text>
                            <Text
                              fontSize="lg"
                              fontWeight="medium"
                              color="gray.700"
                              letterSpacing="wide"
                            >
                              {song}
                            </Text>
                          </Flex>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}

              {concertDetail.ootd &&
                concertDetail.ootd.length > 0 &&
                concertDetail.ootd[0] !== "" && (
                  <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="lg">
                    <HStack mb={3}>
                      <Icon as={CameraIcon} color="purple.600" />
                      <Text fontSize="xl" fontWeight="bold" color="gray.700">
                        {t("costume")}
                      </Text>
                    </HStack>
                    <SimpleGrid columns={1} spacing={4}>
                      {concertDetail.ootd.map((image: string, index: number) => (
                        <Image
                          key={index}
                          src={image}
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

              {concertDetail?.seats &&
                concertDetail?.seats.length > 0 &&
                concertDetail?.seats.some((seat: { image: string }) => seat.image) && ( // ✅ 하나라도 image가 있는지 체크
                  <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="lg">
                    <HStack mb={3}>
                      <Icon as={UsersIcon} color="orange.600" />
                      <Text fontSize="xl" fontWeight="bold" color="gray.700">
                        {t("seat_map")}
                      </Text>
                    </HStack>
                    <SimpleGrid columns={1} spacing={4}>
                      {concertDetail?.seats.map((seat: { image: string }, index: number) =>
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
        {randomUpcomingConcerts.length > 0 && (
          <>
            <Text fontSize="2xl" fontWeight="bold" mt={8} mb={4}>
              {t("recommended_concert")}
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={8}>
              {randomUpcomingConcerts.map((concert, index) => {
                const isFutureOrToday = isEventTodayOrFuture(concert.date);
                const isPastEvent = !isFutureOrToday;
                const isTodayEvent = concert.date.some((date) => {
                  const concertDate = moment(date.split("(")[0], "YYYY-MM-DD");
                  return concertDate.isSame(currentTime, "day");
                });

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
          </>
        )}
        {/* <Comments /> */}
      </Box>
    </Box>
  );
};

export default DetailPage;
