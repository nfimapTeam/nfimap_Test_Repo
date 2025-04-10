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
import Card from "../../components/Card";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Comments from "../../components/Comments";
import { useConcertDetail } from "../../api/concerts/concertsDetailApi";
import { useConcertList } from "../../api/concerts/concertsApi";
import { getTicketSiteName } from "../../util/getTicketSiteName";

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
  const { data: concertDetail, refetch: refetchConcertDetail } = useConcertDetail(id ?? "", lang);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSetlist, setSelectedSetlist] = useState<any>(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

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

                {augmentedConcertDetail.ticketLink.length === 1 ? (
                  <Button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      handleButtonClick(e, augmentedConcertDetail, isPastEvent)
                    }
                    as={Link}
                    href={augmentedConcertDetail.ticketLink[0]}
                    isExternal
                    border="2px solid #eee"
                    bg="brand.sub2"
                    _hover={{ bg: "brand.main", textDecoration: "none" }}
                    _focus={{ textDecoration: "none" }}
                    color="white"
                    textDecoration="none"
                  >
                    {getButtonText(augmentedConcertDetail, isPastEvent, timeRemaining)}
                  </Button>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                    {augmentedConcertDetail.ticketLink.map((link, index) => (
                      <Button
                        key={index}
                        as={Link}
                        href={link}
                        isExternal
                        border="2px solid #eee"
                        bg="brand.sub2"
                        _hover={{ bg: "brand.main", textDecoration: "none" }}
                        _focus={{ textDecoration: "none" }}
                        color="white"
                        size="md"
                        leftIcon={<Icon as={Ticket} />}
                        justifyContent="flex-start"
                        textAlign="left"
                        textDecoration="none"
                      >
                        {getTicketSiteName(link)}
                      </Button>
                    ))}
                  </SimpleGrid>
                )}
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
                  <HStack mb={2} align="center">
                    <Icon as={MusicIcon} color="purple.500" boxSize={5} />
                    <Text fontSize="xl" fontWeight="bold" color="gray.800">
                      {t("setlist")}
                    </Text>
                  </HStack>

                  <Tabs variant="soft-rounded" colorScheme="purple" size="sm">
                    <TabList
                      overflowX="auto"
                      whiteSpace="nowrap"
                      mb={2}
                      css={{
                        '&::-webkit-scrollbar': { height: '4px' },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: 'rgba(160, 174, 192, 0.4)',
                          borderRadius: '4px',
                        }
                      }}
                    >
                      {augmentedConcertDetail.setlist.map((set, index) => (
                        <Tab key={index} fontSize={{ base: "sm", md: "md" }} px={3} py={1} minW="auto">
                          {moment(set.date, "YYYY-MM-DD").format("MM/DD")}
                        </Tab>
                      ))}
                    </TabList>

                    <TabPanels pt={1}>
                      {augmentedConcertDetail.setlist.map((set, index) => (
                        <TabPanel key={index} p={0}>
                          {set.music.length > 0 ? (
                            isMobile ? (
                              // 모바일 뷰: 노래 목록을 절반으로 나눠 2개의 컬럼으로 표시
                              <SimpleGrid columns={2} spacing={3}>
                                <Flex direction="column" w="100%">
                                  {set.music.slice(0, Math.ceil(set.music.length / 2)).map((song, songIndex) => (
                                    <Box
                                      key={songIndex}
                                      py={2} px={3} bg="white" borderRadius="full" boxShadow="0 1px 3px rgba(0,0,0,0.05)"
                                      border="1px solid" borderColor="purple.100" _hover={{ bg: "purple.50", borderColor: "purple.300", transform: "translateY(-1px)" }}
                                      transition="all 0.2s" onClick={() => window.open(song.music.youtube_url, "_blank")} cursor="pointer"
                                      display="flex" alignItems="center" width="100%" mb={2}
                                    >
                                      <Text fontSize="sm" fontWeight="bold" color="purple.500" mr={1.5} flexShrink={0}>
                                        {songIndex + 1}.
                                      </Text>
                                      <Text fontSize="sm" fontWeight="medium" color="gray.700" noOfLines={1} flexGrow={1}>
                                        {song.music.name}
                                      </Text>
                                    </Box>
                                  ))}
                                </Flex>
                                <Flex direction="column" w="100%">
                                  {set.music.slice(Math.ceil(set.music.length / 2)).map((song, songIndex) => (
                                    <Box
                                      key={songIndex}
                                      py={2} px={3} bg="white" borderRadius="full" boxShadow="0 1px 3px rgba(0,0,0,0.05)"
                                      border="1px solid" borderColor="purple.100" _hover={{ bg: "purple.50", borderColor: "purple.300", transform: "translateY(-1px)" }}
                                      transition="all 0.2s" onClick={() => window.open(song.music.youtube_url, "_blank")} cursor="pointer"
                                      display="flex" alignItems="center" width="100%" mb={2}
                                    >
                                      <Text fontSize="sm" fontWeight="bold" color="purple.500" mr={1.5} flexShrink={0}>
                                        {Math.ceil(set.music.length / 2) + songIndex + 1}.
                                      </Text>
                                      <Text fontSize="sm" fontWeight="medium" color="gray.700" noOfLines={1} flexGrow={1}>
                                        {song.music.name}
                                      </Text>
                                    </Box>
                                  ))}
                                </Flex>
                              </SimpleGrid>
                            ) : (
                              // 데스크톱 뷰: 기존 방식대로 멀티 컬럼 레이아웃 유지
                              <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={3}>
                                {set.music.map((song, songIndex) => (
                                  <Box
                                    key={songIndex}
                                    py={2} px={3} bg="white" borderRadius="full" boxShadow="0 1px 3px rgba(0,0,0,0.05)"
                                    border="1px solid" borderColor="purple.100" _hover={{ bg: "purple.50", borderColor: "purple.300", transform: "translateY(-1px)" }}
                                    transition="all 0.2s" onClick={() => window.open(song.music.youtube_url, "_blank")} cursor="pointer"
                                    display="flex" alignItems="center" width="100%" mb={2}
                                  >
                                    <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" color="purple.500" mr={1.5} flexShrink={0}>
                                      {songIndex + 1}.
                                    </Text>
                                    <Text fontSize={{ base: "sm", md: "md" }} fontWeight="medium" color="gray.700" noOfLines={1} flexGrow={1}>
                                      {song.music.name}
                                    </Text>
                                  </Box>
                                ))}
                              </SimpleGrid>
                            )
                          ) : (
                            <Flex w="100%" justifyContent="center" alignItems="center" p={4} gridColumn="1 / -1">
                              <Text fontSize="sm" color="gray.500">{t("no_setlist_available")}</Text>
                            </Flex>
                          )}
                        </TabPanel>
                      ))}
                    </TabPanels>
                  </Tabs>
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
      </Box>
    </Box>
  );
};

export default DetailPage;