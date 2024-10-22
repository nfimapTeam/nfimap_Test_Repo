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
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  ExternalLinkIcon,
  CalendarIcon,
  TimerIcon,
  MapPinIcon,
  InfoIcon,
  MusicIcon,
  CameraIcon,
  UsersIcon,
  ClipboardListIcon,
} from "lucide-react";
import { concertsData } from "../datas/concerts";
import NotFound from "../components/NotFound";
import Card from "../components/Card";
import moment from "moment";
import { globalConcerts } from "../datas/globalConcerts";
import { showInfos } from "../datas/showInfos";
import { globalShowInfos } from "../datas/globalShowInfos";
import theme from "../util/theme";
import { useTranslation } from "react-i18next";
import { concertsDataEng } from "../datas/concertsEng";
import { globalConcertsEng } from "../datas/globalConcertsEng";
import { showInfosEng } from "../datas/showInfosEng";
import { globalShowInfosEng } from "../datas/globalShowInfosEng";

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
  const [allInfos, setAllInfos] = useState<ShowInfo[]>([]);

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
    if (i18n.language === "ko") {
      const combinedInfos = [...showInfos, ...globalShowInfos];
      setAllInfos(combinedInfos);
    } else {
      const combinedInfos = [...showInfosEng, ...globalShowInfosEng];
      setAllInfos(combinedInfos);
    }
   }, [i18n.language, showInfos, globalShowInfos, showInfosEng, globalShowInfosEng]);
  

  if (!id) {
    return <NotFound content="정보가 없습니다." />;
  }
  const showInfo = allInfos.find((info) => info.id === parseInt(id));
  const concert = allConcerts.find((concert) => concert.id === parseInt(id));
  console.log(showInfo);
  if (!concert) {
    return <NotFound content="정보가 없습니다." />;
  }

  const isEventTodayOrFuture = (dates: string[]): boolean => {
    return dates.some((date) => {
      const concertDate = moment(date.split("(")[0], "YYYY-MM-DD");
      return concertDate.isSameOrAfter(currentTime, "day");
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

  const isPastEvent = !isEventTodayOrFuture(concert.date);
  const timeRemaining = calculateTimeRemaining(
    concert.ticketOpen.date,
    concert.ticketOpen.time
  );

  const randomUpcomingConcerts = shuffleArray(upcomingConcerts).slice(0, 3);

  return (
    <Box height="calc(100vh - 120px)">
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
                src={concert.poster}
                alt={concert.name}
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
                {concert.type}
              </Badge>
              <Text fontSize="3xl" fontWeight="bold" mb={4}>
                {concert.name}
              </Text>

              <VStack align="start" spacing={3}>
                <HStack>
                  <Icon as={MapPinIcon} color="gray.500" />
                  <Text fontSize="lg">{concert.location}</Text>
                </HStack>
                <HStack>
                  <Icon as={CalendarIcon} color="gray.500" />
                  <Text fontSize="lg">{concert.date.join(" - ")}</Text>
                </HStack>
                <HStack>
                  <Icon as={TimerIcon} color="gray.500" />
                  <Text fontSize="lg">
                    {concert.startTime} ({t("about")} {concert.durationMinutes}{t("minutes")})
                  </Text>
                </HStack>
              </VStack>
            </Box>

            <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="md">
              <Text fontSize="xl" fontWeight="semibold" mb={3}>
              {t("performers")}
              </Text>
              <Flex wrap="wrap" gap={2}>
                {concert.artists.map((artist, index) => (
                  <Badge key={index} colorScheme="purple" fontSize="md">
                    {artist}
                  </Badge>
                ))}
              </Flex>
            </Box>

            <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="md">
              <Text fontSize="xl" fontWeight="semibold" mb={3}>
                {(concert.type === "행사" || concert.type === "Event") ? t("performanceInfo") : t("ticket_info")}
              </Text>
              <Flex flexDirection="column" gap={3}>
                <Flex>
                  {!(concert.type === "행사" || concert.type === "Event") && (
                    <Badge
                      colorScheme="green"
                      fontSize="md"
                      alignItems="center"
                    >
                      {t("ticket_open")}: {concert.ticketOpen.date}{" "}
                      {concert.ticketOpen.time} ({t("korea_time")})
                    </Badge>
                  )}
                </Flex>
                <Button
                  onClick={(e) => handleButtonClick(e, concert, isPastEvent)}
                  as={Link}
                  href={concert.ticketLink}
                  isExternal
                  colorScheme="blue"
                  _hover={{ bg: "black", color: "white" }}
                >
                  {getButtonText(concert, isPastEvent, timeRemaining)}
                </Button>
              </Flex>
            </Box>
          </Flex>
        </Flex>

        {showInfo && (
          <Box mt={8}>
            <Divider mb={4} />
            <Text fontSize="3xl" fontWeight="bold" mb={4} color="teal.600">
            {t("performance_details")}
            </Text>

            <VStack spacing={6} align="stretch">
              {showInfo.address && (
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
                      &nbsp;{"\u2022"} {showInfo.address}
                    </Text>
                    {showInfo.capacity && (
                      <>
                        <Text fontSize="lg" color="gray.800">
                          <strong>{t("capacity")}</strong>
                        </Text>
                        <Text fontSize="lg" color="gray.800">
                          &nbsp;{"\u2022"} {showInfo.capacity}
                        </Text>
                      </>
                    )}
                    {showInfo.note &&
                      showInfo.note.length > 0 &&
                      showInfo.note[0] !== "" && (
                        <>
                          <Text fontSize="lg" color="gray.800">
                            <strong>{t("notes")}</strong>
                            <br />
                          </Text>
                          {showInfo.note.map((note, index) =>
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

              {showInfo.setlist &&
                showInfo.setlist.length > 0 &&
                showInfo.setlist[0] !== "" && (
                  <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="lg">
                    <HStack mb={3}>
                      <Icon as={MusicIcon} color="green.600" />
                      <Text fontSize="xl" fontWeight="bold" color="gray.700">
                      {t("setlist")}
                      </Text>
                    </HStack>
                    <SimpleGrid columns={1} spacing={2}>
                      {showInfo.setlist.map((song, index) => (
                        <Box
                          key={index}
                          p={3}
                          bg="gray.100"
                          borderRadius="md"
                          boxShadow="md"
                          border="1px solid"
                          borderColor="gray.300"
                          textAlign="center"
                        >
                          <Text
                            fontSize="lg"
                            fontWeight="medium"
                            color="gray.800"
                          >
                            {index + 1}. {song}
                          </Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}

              {showInfo.ootd &&
                showInfo.ootd.length > 0 &&
                showInfo.ootd[0] !== "" && (
                  <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="lg">
                    <HStack mb={3}>
                      <Icon as={CameraIcon} color="purple.600" />
                      <Text fontSize="xl" fontWeight="bold" color="gray.700">
                      {t("costume")}
                      </Text>
                    </HStack>
                    <SimpleGrid columns={1} spacing={4}>
                      {showInfo.ootd.map((image, index) => (
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

              {showInfo.seats &&
                showInfo.seats.length > 0 &&
                showInfo.seats[0] !== "" && (
                  <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="lg">
                    <HStack mb={3}>
                      <Icon as={UsersIcon} color="orange.600" />
                      <Text fontSize="xl" fontWeight="bold" color="gray.700">
                        {t("seat_map")}
                      </Text>
                    </HStack>
                    <SimpleGrid columns={1} spacing={4}>
                      {showInfo.seats.map((seat, index) => (
                        <Image
                          key={index}
                          src={seat}
                          alt={`좌석 배치도 ${index + 1}`}
                          borderRadius="md"
                          boxShadow="md"
                          objectFit="cover"
                          w="100%"
                        />
                      ))}
                    </SimpleGrid>
                  </Box>
                )}
            </VStack>
          </Box>
        )}

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
      </Box>
    </Box>
  );
};

export default DetailPage;
