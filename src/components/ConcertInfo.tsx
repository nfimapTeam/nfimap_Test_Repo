import React, { useEffect, useRef } from "react";
import {
  Box,
  Input,
  Flex,
  Switch,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Select } from "antd";
import NoData from "./NoData";
import { useTranslation } from "react-i18next"; // useTranslation 훅 임포트

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

type ConcertInfoProps = {
  concerts: Concert[];
  query: string;
  setQuery: (query: string) => void;
  showPastConcerts: boolean;
  setShowPastConcerts: (show: boolean) => void;
  setSelectedConcert: (concert: Concert) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
};

const ConcertInfo = ({
  concerts,
  query,
  setQuery,
  showPastConcerts,
  setShowPastConcerts,
  setSelectedConcert,
  selectedType,
  setSelectedType,
}: ConcertInfoProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation(); // 번역 함수 초기화

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleOpenModal = (concert: Concert) => {
    setSelectedConcert(concert);
  };

  const isConcertPast = (concert: Concert) => {
    const currentDate = new Date();
    return concert.date.every((dateString) => {
      const datePart = dateString.split("(")[0]; // 날짜 문자열에서 "(요일)" 부분 제거
      const concertDate = new Date(datePart);
      concertDate.setHours(0, 0, 0, 0); // 날짜만 비교
      currentDate.setHours(0, 0, 0, 0);
      return concertDate < currentDate;
    });
  };

  return (
    <VStack spacing={4} align="start" height="100%">
      <Input
        ref={searchInputRef}
        placeholder={t("mapSearchPlaceholder")} // JSON 파일에서 번역된 문자열
        value={query}
        onChange={handleInputChange}
        size="md"
      />
      <Flex width="100%" align="center" justifyContent="space-between">
        <Select
          placeholder={t("mapSelectPlaceholder")}
          value={selectedType}
          onChange={(value) => setSelectedType(value)}
          style={{ width: 120, height: 30 }}
          dropdownStyle={{
            backgroundColor: "#ffffff",
            borderColor: "#4BA4F2",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <option value="">{t("mapTypeOptions.mapAll")}</option>
          <option value="콘서트">{t("mapTypeOptions.mapConcert")}</option>
          <option value="페스티벌">{t("mapTypeOptions.mapFestival")}</option>
          <option value="행사">{t("mapTypeOptions.mapEvent")}</option>
        </Select>
        <Flex align="center">
          <Text fontSize="10px">{t("mapShowPastConcerts")}</Text>
          <Switch
            id="toggle"
            isChecked={showPastConcerts}
            onChange={() => setShowPastConcerts(!showPastConcerts)}
            ml="10px"
          />
        </Flex>
      </Flex>
      <Box
        flex="1"
        w="100%"
        overflow="auto"
        css={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        {concerts.length === 0 && <NoData />}
        {concerts.map((concert, index) => {
          const past = isConcertPast(concert);

          return (
            <Flex
              key={index}
              onClick={() => handleOpenModal(concert)}
              cursor="pointer"
              p="10px"
              margin="10px 0"
              border="1px solid #eee"
              borderRadius="4px"
              w="100%"
              _hover={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
              position="relative"
              bg={past ? "rgba(0, 0, 0, 0.35)" : "#fff"}
            >
              <Box
                width="70px"
                height="70px"
                minWidth="70px"
                minHeight="70px"
                mr="15px"
                position="relative"
                overflow="hidden"
                borderRadius="4px"
              >
                <Image
                  src={concert.poster && concert.poster.trim() !== '' ? concert.poster : '/image/logo/logo.svg'}
                  alt={concert.name}
                  position="absolute"
                  top="0"
                  left="0"
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
                {past && (
                  <Text
                    position="absolute"
                    fontSize="12px"
                    fontWeight="bold"
                    color="#fff"
                    bg="rgba(0, 0, 0, 0.7)"
                    borderRadius="4px"
                    p="4px 12px"
                    textAlign="center"
                    left="50%"
                    top="50%"
                    transform="translate(-50%, -50%)"
                    w="100%"
                  >
                    {t("mapPastConcert")}
                  </Text>
                )}
              </Box>
              <Box flexGrow={1}>
                <Text fontSize="16px" fontWeight="bold" mb="5px" noOfLines={1}>
                  {concert.name}
                </Text>
                <Text fontSize="14px" color="#666" noOfLines={1}>
                  {concert.location}
                </Text>
              </Box>
            </Flex>
          );
        })}
      </Box>
    </VStack>
  );
};

export default ConcertInfo;
