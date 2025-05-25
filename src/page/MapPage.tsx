import React, { useState, useEffect } from "react";
import { Box, Button, HStack } from "@chakra-ui/react";
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
  const [selectedType, setSelectedType] = useState<string>("");
  const [globalQuery, setGlobalQuery] = useState<string>("");
  const [selectedGlobalType, setSelectedGlobalType] = useState<string>("");
  const [showPastConcerts, setShowPastConcerts] = useState<boolean>(false);
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);
  const [selectedNfiRoad, setSelectedNfiRoad] = useState<NfiRoad | null>(null);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [showPastConcertsGlobal, setShowPastConcertsGlobal] =
    useState<boolean>(false);
  const [selectedGlobalConcert, setSelectedGlobalConcert] =
    useState<Concert | null>(null);
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
  const translateType = (type: string) => {
    switch (type.toLowerCase().trim()) {
      case "콘서트":
      case "concert":
        return t("concert");
      case "페스티벌":
      case "festival":
        return t("festival");
      case "행사":
      case "event":
        return t("event");
      default:
        return type;
    }
  };

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

        const matchesType: boolean = selectedType
          ? concert.type === translateType(selectedType)
          : true;

        return matchesQuery && (showPastConcerts ? true : isUpcomingOrToday) && matchesType;
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
  }, [concertsData, query, showPastConcerts, selectedType]);

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

        const matchesType: boolean = selectedGlobalType
          ? concert.type === selectedGlobalType
          : true;

        return matchesQuery && (showPastConcertsGlobal ? true : isUpcomingOrToday) && matchesType;
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
  }, [concertsData, globalQuery, showPastConcertsGlobal, selectedGlobalType]);

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
    <Box display={{ base: "block", md: "flex" }}>
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
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          globalQuery={globalQuery}
          setGlobalQuery={setGlobalQuery}
          selectedGlobalType={selectedGlobalType}
          setSelectedGlobalType={setSelectedGlobalType}
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
        />
      </Box>
      <Box
        display={{ base: "block", md: "none" }}
        position="absolute"
        top="80px"
        left="10px"
        bg="none"
        zIndex="1000"
      >
        <HStack spacing={2}>
          <Button
            bg={activeTabIndex === 0 ? "brand.main" : "gray.200"} // 기본 버튼 색상
            color={activeTabIndex === 0 ? "white" : "black"} // 기본 글자 색상
            _hover={{ bg: "brand.main", color: "white" }} // 호버 시 색상
            _active={{ bg: "brand.main", color: "white" }} // 클릭된 상태 (active) 색상
            onClick={() => setActiveTabIndex(0)}
          >
            {t("map_domestic")}
          </Button>

          <Button
            bg={activeTabIndex === 1 ? "brand.main" : "gray.200"}
            color={activeTabIndex === 1 ? "white" : "black"}
            _hover={{ bg: "brand.main", color: "white" }}
            _active={{ bg: "brand.main", color: "white" }}
            onClick={() => setActiveTabIndex(1)}
          >
            {t("map_nfiRoad")}
          </Button>

          <Button
            bg={activeTabIndex === 2 ? "brand.main" : "gray.200"}
            color={activeTabIndex === 2 ? "white" : "black"}
            _hover={{ bg: "brand.main", color: "white" }}
            _active={{ bg: "brand.main", color: "white" }}
            onClick={() => setActiveTabIndex(2)}
          >
            {t("map_global")}
          </Button>
        </HStack>
      </Box>

      <Box flex="1">
        {activeTabIndex === 2 ? (
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
