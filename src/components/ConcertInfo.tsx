import React, { useEffect, useRef } from "react";
import {
  Box,
  Input,
  Flex,
  Switch,
  Image,
  Text,
  VStack,
  FormControl,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import NoData from "./NoData";
import { useTranslation } from "react-i18next"; // useTranslation 훅 임포트
import { ChevronDownIcon } from "@chakra-ui/icons";

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

  const isConcertPast = (concert: Concert): boolean => {
    const currentDate: Date = new Date();
    currentDate.setHours(0, 0, 0, 0); // 현재 날짜의 시간 초기화

    return concert.concertDate.every((concertDateItem: ConcertDate): boolean => {
      const concertDate: Date = new Date(concertDateItem.date);
      concertDate.setHours(0, 0, 0, 0); // 콘서트 날짜의 시간 초기화
      return concertDate < currentDate;
    });
  };

  return (
    <VStack spacing={4} align="start" height="100%">
      <Input
        ref={searchInputRef}
        placeholder={t("mapSearchPlaceholder")} // JSON 파일에서 번역된 문자열
        value={query}
        focusBorderColor="purple.500"
        onChange={handleInputChange}
        size="md"
      />
      <Flex width="100%" align="center" justifyContent="space-between">
        <Menu>
          <MenuButton
            minW="100px"
            as={Button}
            rightIcon={<ChevronDownIcon />}
            bg="white"
            borderWidth="1px"
            color="gray.800"
            fontSize="sm"
            fontWeight="medium"
            height="40px"
            borderRadius="md"
            boxShadow="sm"
            _hover={{
              borderColor: "purple.400",
              boxShadow: "md",
            }}
            _active={{
              bg: "purple.50",
              borderColor: "purple.500",
            }}
            _focus={{
              borderColor: "purple.500",
              boxShadow: "0 0 0 1px #9F7AEA",
            }}
            textAlign="left"
            justifyContent="space-between"
            px={3}
          >
            {t(selectedType) || t("mapSelectPlaceholder")}
          </MenuButton>
          <MenuList
            bg="white"
            borderColor="purple.200"
            borderRadius="md"
            boxShadow="lg"
            minW="200px"
            zIndex={10}
            py={1}
            mt={1}
          >
            <MenuItem
              onClick={() => setSelectedType("")}
              bg="white"
              color="gray.800"
              fontSize="sm"
              _hover={{ bg: "purple.50", color: "purple.700" }}
              _focus={{ bg: "purple.50" }}
              px={4}
              py={2}
            >
              {t("mapTypeOptions.mapAll")}
            </MenuItem>
            <MenuItem
              onClick={() => setSelectedType("concert")}
              bg="white"
              color="gray.800"
              fontSize="sm"
              _hover={{ bg: "purple.50", color: "purple.700" }}
              _focus={{ bg: "purple.50" }}
              px={4}
              py={2}
            >
              {t("mapTypeOptions.mapConcert")}
            </MenuItem>
            <MenuItem
              onClick={() => setSelectedType("festival")}
              bg="white"
              color="gray.800"
              fontSize="sm"
              _hover={{ bg: "purple.50", color: "purple.700" }}
              _focus={{ bg: "purple.50" }}
              px={4}
              py={2}
            >
              {t("mapTypeOptions.mapFestival")}
            </MenuItem>
            <MenuItem
              onClick={() => setSelectedType("event")}
              bg="white"
              color="gray.800"
              fontSize="sm"
              _hover={{ bg: "purple.50", color: "purple.700" }}
              _focus={{ bg: "purple.50" }}
              px={4}
              py={2}
            >
              {t("mapTypeOptions.mapEvent")}
            </MenuItem>
          </MenuList>
        </Menu>

        <Flex align="center" gap={1}>
          <Text fontSize="10px">{t("mapShowPastConcerts")}</Text>
          <Switch
            id="show-past-events"
            isChecked={showPastConcerts}
            onChange={() => setShowPastConcerts(!showPastConcerts)}
            sx={{
              ".chakra-switch__track": {
                bg: showPastConcerts ? "#9F7AEA" : "gray.200",
              },
            }}
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
