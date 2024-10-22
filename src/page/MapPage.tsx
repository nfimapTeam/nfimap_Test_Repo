import React, { useState, useEffect } from "react";
import { Box, Button, HStack } from "@chakra-ui/react";
import Sidebar from "../components/SideBar";
import { concertsData } from "../datas/concerts";
import NaverMap from "../components/NaverMap";
import { nfiRoadData } from "../datas/nfiRoad";
import GoogleMap from "../components/GoogleMap";
import { globalConcerts } from "../datas/globalConcerts";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { concertsDataEng } from "../datas/concertsEng";
import { nfiRoadDataEng } from "../datas/nfilRoadEng";
import { globalConcertsEng } from "../datas/globalConcertsEng";

type Concert = {
  name: string;
  location: string;
  type: string;
  durationMinutes: number;
  date: string[];
  startTime: string;
  artists: string[];
  ticketLink: string;
  poster: string;
  lat: string;
  lng: string;
  ticketOpen?: any;
};

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

  useEffect(() => {
    if (i18n.language === "ko") {
      setConcertState(concertsData);
      setNfiRoadState(nfiRoadData);
      setGlobalConcertState(globalConcerts);
    } else {
      setConcertState(concertsDataEng);
      setNfiRoadState(nfiRoadDataEng);
      setGlobalConcertState(globalConcertsEng);
    }
  }, [i18n.language]);

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    let concerts;
    if (i18n.language === "ko") {
      concerts = concertsData;
    } else {
      concerts = concertsDataEng;
    }

    const filteredConcerts = concerts.filter((concert) => {
      const matchesQuery =
        concert.name.toLowerCase().includes(query.toLowerCase()) ||
        concert.location.toLowerCase().includes(query.toLowerCase());

      const concertDates = concert.date.map((date) => {
        const parsedDate = new Date(date.split("(")[0]);
        parsedDate.setHours(0, 0, 0, 0); // 시간을 0으로 설정
        return parsedDate;
      });
      const latestDate = new Date(
        Math.max(...concertDates.map((date) => date.getTime()))
      );

      const isPast = latestDate < currentDate; // 과거인지 확인
      const isUpcomingOrToday = latestDate >= currentDate;

      const matchesType = selectedType ? concert.type === selectedType : true;

      return (
        matchesQuery &&
        (showPastConcerts ? true : isUpcomingOrToday) &&
        matchesType
      );
    });

    // 날짜 기준으로 정렬
    filteredConcerts.sort((a, b) => {
      const dateA = Math.max(
        ...a.date.map((date) => new Date(date.split("(")[0]).getTime())
      );
      const dateB = Math.max(
        ...b.date.map((date) => new Date(date.split("(")[0]).getTime())
      );
      return dateA - dateB;
    });

    setConcertState(filteredConcerts);
  }, [query, showPastConcerts, selectedType, i18n.language]);

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    let concerts;
    if (i18n.language === "ko") {
      concerts = globalConcerts;
    } else {
      concerts = globalConcertsEng;
    }

    const filteredGlobalConcerts = concerts.filter((concert) => {
      const matchesQuery =
        concert.name.toLowerCase().includes(globalQuery.toLowerCase()) ||
        concert.location.toLowerCase().includes(globalQuery.toLowerCase());

      const concertDates = concert.date.map((date) => {
        const parsedDate = new Date(date.split("(")[0]);
        parsedDate.setHours(0, 0, 0, 0);
        return parsedDate;
      });

      const latestDate = new Date(
        Math.max(...concertDates.map((date) => date.getTime()))
      );

      const isUpcomingOrToday = latestDate >= currentDate;

      const matchesType = selectedGlobalType
        ? concert.type === selectedGlobalType
        : true;

      return (
        matchesQuery &&
        (showPastConcertsGlobal ? true : isUpcomingOrToday) &&
        matchesType
      );
    });

    // Sort by date
    filteredGlobalConcerts.sort((a, b) => {
      const dateA = Math.max(
        ...a.date.map((date) => new Date(date.split("(")[0]).getTime())
      );
      const dateB = Math.max(
        ...b.date.map((date) => new Date(date.split("(")[0]).getTime())
      );
      return dateA - dateB;
    });

    setGlobalConcertState(filteredGlobalConcerts);
  }, [globalQuery, showPastConcertsGlobal, selectedGlobalType, i18n.language]);

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
