import React, { useEffect, useRef } from "react";
import {
  Box,
  Input,
  Flex,
  Switch,
  Image,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  InputGroup,
  InputRightElement,
  Icon,
} from "@chakra-ui/react";
import NoData from "./NoData";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";

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
  years: string[];
  selectedYear: string;
  setSelectedYear: (year: string) => void;
};

const ConcertInfo = ({
  concerts,
  query,
  setQuery,
  showPastConcerts,
  setShowPastConcerts,
  setSelectedConcert,
  years,
  selectedYear,
  setSelectedYear,
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
      <InputGroup size="md">
        <Input
          borderColor="gray.200"
          ref={searchInputRef}
          placeholder={t("mapSearchPlaceholder")}
          value={query}
          focusBorderColor="brand.main"
          onChange={handleInputChange}
          borderRadius="full"
          boxShadow="soft"
          _hover={{ borderColor: "gray.300" }}
          pl={5}
          pr={11}
          transition="all 0.3s ease"
          _focus={{
            boxShadow: "glow",
            transform: "translateY(-1px)"
          }}
        />
        <InputRightElement width="3rem">
          <Icon as={SearchIcon} color="gray.400" />
        </InputRightElement>
      </InputGroup>
      <Flex width="100%" align="center" gap={2} flexWrap="wrap" justifyContent="space-between">
        <HStack spacing={2}>
          {/* Year Filter */}
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              borderColor={selectedYear ? "brand.main" : "gray.200"}
              bg={selectedYear ? "brand.purpleSoft" : "white"}
              borderWidth="1px"
              color={selectedYear ? "brand.main" : "gray.700"}
              fontSize="xs"
              fontWeight="extrabold"
              height="36px"
              minW="90px"
              borderRadius="full"
              _hover={{
                borderColor: "brand.main",
                bg: "brand.purpleSoft",
              }}
              _active={{
                bg: "brand.purpleSoft",
                borderColor: "brand.main",
              }}
              textAlign="left"
              px={4}
            >
              {selectedYear === "" ? t("mapTypeOptions.mapAll") : selectedYear}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setSelectedYear("")}>
                {t("mapTypeOptions.mapAll")}
              </MenuItem>
              {years.map((y) => (
                <MenuItem key={y} onClick={() => setSelectedYear(y)}>
                  {y}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>

        <FormControl
          display="flex"
          alignItems="center"
          width="auto"
          bg="brand.purpleSoft"
          px={3}
          py={1.5}
          borderRadius="full"
          m={0}
        >
          <FormLabel
            htmlFor="show-past-events"
            mb="0"
            mr={2}
            fontSize="10px"
            fontWeight="extrabold"
            color="brand.main"
            cursor="pointer"
          >
            {t("mapShowPastConcerts")}
          </FormLabel>
          <Switch
            id="show-past-events"
            colorScheme="purple"
            size="sm"
            isChecked={showPastConcerts}
            onChange={() => setShowPastConcerts(!showPastConcerts)}
          />
        </FormControl>
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
              p={3}
              margin="12px 0"
              border="1px solid"
              borderColor="gray.100"
              borderRadius="2xl"
              w="100%"
              boxShadow="soft"
              position="relative"
              bg={past ? "rgba(249, 250, 251, 0.85)" : "#fff"}
              opacity={past ? 0.75 : 1}
              transition="all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
              _hover={{ 
                transform: "translateY(-2px)", 
                boxShadow: "card", 
                borderColor: "brand.main" 
              }}
            >
              <Box
                width="70px"
                height="70px"
                minWidth="70px"
                minHeight="70px"
                mr="15px"
                position="relative"
                overflow="hidden"
                borderRadius="xl"
                boxShadow="xs"
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
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                    bg="rgba(0, 0, 0, 0.4)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      fontSize="9px"
                      fontWeight="black"
                      color="#fff"
                      bg="rgba(0, 0, 0, 0.75)"
                      borderRadius="full"
                      py="2px"
                      px="8px"
                      textAlign="center"
                    >
                      {t("mapPastConcert")}
                    </Text>
                  </Box>
                )}
              </Box>
              <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="center">
                <Text fontSize="15px" fontWeight="black" color={past ? "gray.500" : "gray.800"} mb="4px" noOfLines={1}>
                  {concert.name}
                </Text>
                <Text fontSize="12px" fontWeight="medium" color={past ? "gray.400" : "gray.500"} noOfLines={1}>
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
