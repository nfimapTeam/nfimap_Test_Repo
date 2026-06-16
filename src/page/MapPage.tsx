import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, HStack, VStack } from "@chakra-ui/react";
import Sidebar from "../components/SideBar";
import NaverMap from "../components/NaverMap";
import { nfiRoadData } from "../datas/nfiRoad";
import GoogleMap from "../components/GoogleMap";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { nfiRoadDataEng } from "../datas/nfilRoadEng";
import { useConcertList } from "../api/concerts/concertsApi";

interface ConcertDate {
  date: string;
  start_time: string;
  duration_minutes: number;
}

interface TicketOpen {
  date: string;
  time: string;
}

interface Concert {
  id: number;
  name: string;
  location: string;
  startTime: string;
  concertDate: ConcertDate[];
  type: string;
  performanceType: string;
  artists: string[];
  poster: string;
  EventState: number;
  ticketOpen: TicketOpen;
  ticketLink: string;
  lat: number;
  lng: number;
  globals: boolean;
  isTicketOpenDate: boolean;
}

type NfiRoad = {
  id: number;
  name: string;
  location: string;
  category: string;
  lat: string;
  lng: string;
  naverLink: string;
  note: string;
};

const MapPage = () => {
  const { t, i18n } = useTranslation();
  const [concertState, setConcertState] = useState<Concert[]>([]);
  const [globalConcertState, setGlobalConcertState] = useState<Concert[]>([]);
  const [nfiRoadState, setNfiRoadState] = useState<NfiRoad[]>([]);
  const [query, setQuery] = useState<string>("");
  const [globalQuery, setGlobalQuery] = useState<string>("");
  const [showPastConcerts, setShowPastConcerts] = useState<boolean>(false);
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);
  const [selectedNfiRoad, setSelectedNfiRoad] = useState<NfiRoad | null>(null);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [showPastConcertsGlobal, setShowPastConcertsGlobal] =
    useState<boolean>(false);
  const [selectedGlobalConcert, setSelectedGlobalConcert] =
    useState<Concert | null>(null);
  const [lang, setLang] = useState("ko");

  // 연도별 필터링을 위한 추가 상태
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedGlobalYear, setSelectedGlobalYear] = useState<string>("");

  const { data: concertsData, refetch: refetchConcertsData } = useConcertList(lang);

  useEffect(() => {
    const baseLang = i18n.language ? i18n.language.split("-")[0] : "ko";
    // 서버는 ko/en만 지원 — zh/ja는 en으로 폴백
    setLang(baseLang === "ko" ? "ko" : "en");
  }, [i18n.language]);

  useEffect(() => {
    setTimeout(() => {
      refetchConcertsData();
    }, 50);
  }, [lang]);

  useEffect(() => {
    if (i18n.language === "ko") {
      setNfiRoadState(nfiRoadData);
    } else {
      setNfiRoadState(nfiRoadDataEng);
    }
  }, [i18n.language]);

  // concertsData에서 동적으로 연도 목록 추출
  useEffect(() => {
    if (!concertsData) return;
    const extractedYears: string[] = Array.from(
      new Set<string>(
        concertsData.flatMap((concert: Concert) =>
          concert.concertDate.map((d) => d.date.substring(0, 4))
        )
      )
    ).sort((a: string, b: string) => b.localeCompare(a));
    setYears(extractedYears);
  }, [concertsData]);

  useEffect(() => {
    // concertsData가 없으면 종료
    if (!concertsData) return;

    const currentDate: Date = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // 국내 콘서트 (globals: false)
    const domesticConcerts: Concert[] = concertsData.filter(
      (concert: Concert): boolean => !concert.globals
    );

    const filteredConcerts: Concert[] = domesticConcerts.filter(
      (concert: Concert): boolean => {
        const matchesQuery: boolean =
          concert.name.toLowerCase().includes(query.toLowerCase()) ||
          concert.location.toLowerCase().includes(query.toLowerCase());

        const concertDates: Date[] = concert.concertDate.map(
          (d: { date: string; start_time: string; duration_minutes: number }): Date =>
            new Date(d.date)
        );
        // 수정: 마지막 날짜를 기준으로 계산
        const latestDate: Date = concertDates.length
          ? new Date(concert.concertDate[concert.concertDate.length - 1].date)
          : new Date(0); // 빈 배열 처리
        latestDate.setHours(0, 0, 0, 0);
        const isUpcomingOrToday: boolean = latestDate >= currentDate;

        const matchesYear: boolean = selectedYear
          ? concert.concertDate.some((d) => d.date.startsWith(selectedYear))
          : true;

        return matchesQuery && (showPastConcerts ? true : isUpcomingOrToday) && matchesYear;
      }
    );

    filteredConcerts.sort(
      (a: Concert, b: Concert): number => {
        const dateA: number = Math.max(
          ...a.concertDate.map(
            (d: { date: string; start_time: string; duration_minutes: number }): number =>
              new Date(d.date).getTime()
          )
        );
        const dateB: number = Math.max(
          ...b.concertDate.map(
            (d: { date: string; start_time: string; duration_minutes: number }): number =>
              new Date(d.date).getTime()
          )
        );
        return dateA - dateB;
      }
    );

    setConcertState(filteredConcerts);
  }, [concertsData, query, showPastConcerts, selectedYear]);

  // 두 번째 useEffect: 해외 콘서트 필터링 및 정렬
  useEffect(() => {
    // concertsData가 없으면 종료
    if (!concertsData) return;

    const currentDate: Date = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // 해외 콘서트 (globals: true)
    const globalConcerts: Concert[] = concertsData.filter(
      (concert: Concert): boolean => concert.globals
    );

    const filteredGlobalConcerts: Concert[] = globalConcerts.filter(
      (concert: Concert): boolean => {
        const matchesQuery: boolean =
          concert.name.toLowerCase().includes(globalQuery.toLowerCase()) ||
          concert.location.toLowerCase().includes(globalQuery.toLowerCase());

        const concertDates: Date[] = concert.concertDate.map(
          (d: { date: string; start_time: string; duration_minutes: number }): Date =>
            new Date(d.date)
        );
        // 수정: 마지막 날짜를 기준으로 계산
        const latestDate: Date = concertDates.length
          ? new Date(concert.concertDate[concert.concertDate.length - 1].date)
          : new Date(0); // 빈 배열 처리
        latestDate.setHours(0, 0, 0, 0);
        const isUpcomingOrToday: boolean = latestDate >= currentDate;

        const matchesGlobalYear: boolean = selectedGlobalYear
          ? concert.concertDate.some((d) => d.date.startsWith(selectedGlobalYear))
          : true;

        return matchesQuery && (showPastConcertsGlobal ? true : isUpcomingOrToday) && matchesGlobalYear;
      }
    );

    filteredGlobalConcerts.sort(
      (a: Concert, b: Concert): number => {
        const dateA: number = Math.max(
          ...a.concertDate.map(
            (d: { date: string; start_time: string; duration_minutes: number }): number =>
              new Date(d.date).getTime()
          )
        );
        const dateB: number = Math.max(
          ...b.concertDate.map(
            (d: { date: string; start_time: string; duration_minutes: number }): number =>
              new Date(d.date).getTime()
          )
        );
        return dateA - dateB;
      }
    );

    setGlobalConcertState(filteredGlobalConcerts);
  }, [concertsData, globalQuery, showPastConcertsGlobal, selectedGlobalYear]);

  useEffect(() => {
    let concerts;
    if (i18n.language === "ko") {
      concerts = nfiRoadData;
    } else {
      concerts = nfiRoadDataEng;
    }
    const filteredNfiLoad = concerts.filter(
      (load) =>
        load.name.toLowerCase().includes(query.toLowerCase()) ||
        load.location.toLowerCase().includes(query.toLowerCase())
    );
    setNfiRoadState(filteredNfiLoad);
  }, [query, i18n.language]);

  return (
    <Box display={{ base: "block", md: "flex" }} position="relative" w="100%" h="100%">
      <Helmet>
        <title>{t("map_title")}</title>
        <meta name="description" content={t("map_description")} />
        <meta property="og:image" content="%PUBLIC_URL%/image/logo/logo.svg" />
        <meta property="og:url" content="https://nfimap.co.kr" />
      </Helmet>
      <Box display={{ base: "none", md: "block" }} width="340px">
        <Sidebar
          concerts={concertState}
          globalConcerts={globalConcertState}
          nfiRoad={nfiRoadState}
          query={query}
          setQuery={setQuery}
          globalQuery={globalQuery}
          setGlobalQuery={setGlobalQuery}
          showPastConcerts={showPastConcerts}
          setShowPastConcerts={setShowPastConcerts}
          selectedConcert={selectedConcert}
          setSelectedConcert={setSelectedConcert}
          selectedNfiRoad={selectedNfiRoad}
          setSelectedNfiRoad={setSelectedNfiRoad}
          activeTabIndex={activeTabIndex}
          setActiveTabIndex={setActiveTabIndex}
          showPastConcertsGlobal={showPastConcertsGlobal}
          setShowPastConcertsGlobal={setShowPastConcertsGlobal}
          selectedGlobalConcert={selectedGlobalConcert}
          setSelectedGlobalConcert={setSelectedGlobalConcert}
          years={years}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedGlobalYear={selectedGlobalYear}
          setSelectedGlobalYear={setSelectedGlobalYear}
        />
      </Box>

      <VStack
        display={{ base: "flex", md: "none" }}
        position="absolute"
        top="12px"
        left="12px"
        align="start"
        spacing={2}
        zIndex="1000"
      >
        <HStack spacing={2} w="calc(100vw - 24px)">
          <Button
            size="xs"
            height="30px"
            fontSize="11px"
            fontWeight="black"
            flex={1}
            borderRadius="full"
            borderWidth="1px"
            borderColor={activeTabIndex === 0 ? "brand.main" : "rgba(0, 0, 0, 0.05)"}
            bg={activeTabIndex === 0 ? "brand.main" : "rgba(255, 255, 255, 0.85)"}
            color={activeTabIndex === 0 ? "white" : "gray.600"}
            _hover={{
              bg: activeTabIndex === 0 ? "brand.main" : "brand.purpleSoft",
              borderColor: activeTabIndex === 0 ? "brand.main" : "brand.main",
            }}
            _active={{ bg: "brand.main", color: "white" }}
            onClick={() => setActiveTabIndex(0)}
            boxShadow="soft"
            backdropFilter="blur(10px)"
            transition="all 0.2s"
          >
            {t("map_domestic")}
          </Button>

          <Button
            size="xs"
            height="30px"
            fontSize="11px"
            fontWeight="black"
            flex={1}
            borderRadius="full"
            borderWidth="1px"
            borderColor={activeTabIndex === 1 ? "brand.main" : "rgba(0, 0, 0, 0.05)"}
            bg={activeTabIndex === 1 ? "brand.main" : "rgba(255, 255, 255, 0.85)"}
            color={activeTabIndex === 1 ? "white" : "gray.600"}
            _hover={{
              bg: activeTabIndex === 1 ? "brand.main" : "brand.purpleSoft",
              borderColor: activeTabIndex === 1 ? "brand.main" : "brand.main",
            }}
            _active={{ bg: "brand.main", color: "white" }}
            onClick={() => setActiveTabIndex(1)}
            boxShadow="soft"
            backdropFilter="blur(10px)"
            transition="all 0.2s"
          >
            {t("map_global")}
          </Button>

          <Button
            size="xs"
            height="30px"
            fontSize="11px"
            fontWeight="black"
            flex={1}
            borderRadius="full"
            borderWidth="1px"
            borderColor={activeTabIndex === 2 ? "brand.main" : "rgba(0, 0, 0, 0.05)"}
            bg={activeTabIndex === 2 ? "brand.main" : "rgba(255, 255, 255, 0.85)"}
            color={activeTabIndex === 2 ? "white" : "gray.600"}
            _hover={{
              bg: activeTabIndex === 2 ? "brand.main" : "brand.purpleSoft",
              borderColor: activeTabIndex === 2 ? "brand.main" : "brand.main",
            }}
            _active={{ bg: "brand.main", color: "white" }}
            onClick={() => setActiveTabIndex(2)}
            boxShadow="soft"
            backdropFilter="blur(10px)"
            transition="all 0.2s"
          >
            {t("map_nfiRoad")}
          </Button>
        </HStack>
      </VStack>

      <Box flex="1">
        {activeTabIndex === 1 ? (
          <GoogleMap
            globalConcerts={globalConcertState}
            setShowPastConcertsGlobal={setShowPastConcertsGlobal}
            selectedGlobalConcert={selectedGlobalConcert}
            setSelectedGlobalConcert={setSelectedGlobalConcert}
          />
        ) : (
          <NaverMap
            concerts={concertState}
            nfiRoad={nfiRoadState}
            setShowPastConcerts={setShowPastConcerts}
            selectedConcert={selectedConcert}
            setSelectedConcert={setSelectedConcert}
            selectedNfiRoad={selectedNfiRoad}
            setSelectedNfiRoad={setSelectedNfiRoad}
            activeTabIndex={activeTabIndex}
          />
        )}
      </Box>
    </Box>
  );
};

export default MapPage;
