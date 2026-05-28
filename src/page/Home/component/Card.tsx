import React from "react";
import {
  Box,
  Image,
  Text,
  HStack,
  VStack,
  Badge,
  Button,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { keyframes } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TicketModal } from "../../DetailPage/components/TicketModal";
import { TicketDrawer } from "../../DetailPage/components/Drawer";

// Concert 타입 정의
interface Concert {
  id: number;
  name: string;
  location: string;
  type: string; // "콘서트" | "페스티벌" | "행사" 등
  performanceType: string; // "단독" | "합동" | "출연" 등
  concertDate: { date: string; start_time: string; duration_minutes: number }[];
  startTime: string;
  artists: string[];
  ticketLink: string[];
  poster: string;
  lat: string | number;
  lng: string | number;
  ticketOpen: {
    date: string;
    time: string;
  };
  date: string[]; // Home에서 map으로 추가된 속성
}

interface CardProps {
  concert: Concert;
  isTodayEvent: boolean;
  isPastEvent: boolean;
  isTicketOpen: boolean;
  timeRemaining: { days: number; hours: number; minutes: number } | null;
  lang: string;
  getButtonText: (
    concert: Concert,
    isPastEvent: boolean,
    timeRemaining: { days: number; hours: number; minutes: number } | null
  ) => string;
  handleButtonClick: (
    e: React.MouseEvent<HTMLButtonElement>,
    concert: Concert,
    isPastEvent: boolean
  ) => void;
}

// Sophisticated Border Glow keyframes
const borderGlow = keyframes`
  0% {
    border-color: rgba(6, 182, 212, 0.4);
    box-shadow: 0 4px 15px rgba(6, 182, 212, 0.15);
  }
  50% {
    border-color: rgba(6, 182, 212, 0.7);
    box-shadow: 0 4px 25px rgba(6, 182, 212, 0.35);
  }
  100% {
    border-color: rgba(6, 182, 212, 0.4);
    box-shadow: 0 4px 15px rgba(6, 182, 212, 0.15);
  }
`;

const lavenderGlow = keyframes`
  0% {
    border-color: rgba(139, 92, 246, 0.4);
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.15);
  }
  50% {
    border-color: rgba(139, 92, 246, 0.7);
    box-shadow: 0 4px 25px rgba(139, 92, 246, 0.35);
  }
  100% {
    border-color: rgba(139, 92, 246, 0.4);
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.15);
  }
`;

const Card = ({
  concert,
  isTodayEvent,
  isTicketOpen,
  isPastEvent,
  timeRemaining,
  lang,
  getButtonText,
  handleButtonClick,
}: CardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();

  const handleTicketButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const links = concert.ticketLink || [];
    if (isPastEvent) {
      handleButtonClick(e, concert, isPastEvent);
    } else if (links.length === 1 && links[0]) {
      window.open(links[0], "_blank");
    } else if (links.length > 1) {
      onDrawerOpen();
    }
  };

  return (
    <Box
      position="relative"
      onClick={() => navigate(`/${concert.id}`)}
      borderRadius="24px"
      bg="white"
      borderWidth="1px"
      borderColor={isTodayEvent ? "brand.sub2" : "gray.100"}
      animation={
        isTodayEvent
          ? `${borderGlow} 2s ease-in-out infinite`
          : isTicketOpen
            ? `${lavenderGlow} 2s ease-in-out infinite`
            : "none"
      }
      boxShadow="soft"
      role="group"
      cursor="pointer"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      height="100%"
      transition="all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
      _hover={{
        transform: "translateY(-6px)",
        boxShadow: "elevated",
        borderColor: "brand.main",
      }}
    >
      {/* Poster Image Container */}
      <Box
        position="relative"
        width="100%"
        paddingBottom="125%" // 4:5 aspect ratio
        overflow="hidden"
        bg="gray.50"
        filter={isPastEvent ? "grayscale(100%)" : "none"}
        opacity={isPastEvent ? 0.8 : 1}
        transition="all 0.4s ease"
      >
        <Image
          src={concert.poster}
          alt={concert.name}
          objectFit="cover"
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          fallbackSrc="/image/logo/logo.svg"
          transition="transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
          _groupHover={{
            transform: "scale(1.05)",
          }}
        />

        {/* Shadow overlay at the bottom of the poster */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          height="40%"
          bgGradient="linear(to-t, rgba(0,0,0,0.15), transparent)"
          pointerEvents="none"
        />

        {/* State Badges (Absolute overlay) */}
        <Box position="absolute" top={3} left={3} zIndex={2}>
          {isTodayEvent ? (
            <Badge
              bg="brand.sub2"
              color="white"
              boxShadow="0 2px 10px rgba(6, 182, 212, 0.3)"
              fontSize="xs"
              px={3}
              py={1}
            >
              {t("today_concert")}
            </Badge>
          ) : isPastEvent ? (
            <Badge
              bg="gray.400"
              color="white"
              fontSize="xs"
              px={3}
              py={1}
            >
              {t("concert_ended")}
            </Badge>
          ) : (
            <Badge
              bg="brand.main"
              color="white"
              boxShadow="0 2px 10px rgba(139, 92, 246, 0.3)"
              fontSize="xs"
              px={3}
              py={1}
            >
              {t("concert_upcoming")}
            </Badge>
          )}
        </Box>
      </Box>

      {/* Card Content Area */}
      <VStack p={4} spacing={3} align="stretch" flex="1" justify="space-between" height="100%">
        <VStack align="start" spacing={2} width="100%">
          {/* Tag Badges */}
          <HStack spacing={1.5} flexWrap="wrap">
            {(concert.type === "콘서트" || concert.type === "Concert") && (
              <Badge
                bg="pink.50"
                color="pink.600"
                fontSize="10px"
                fontWeight="extrabold"
                px={2.5}
                py={0.5}
              >
                {t("concert_type_concert")}
              </Badge>
            )}
            {(concert.type === "페스티벌" || concert.type === "Festival") && (
              <Badge
                bg="blue.50"
                color="blue.600"
                fontSize="10px"
                fontWeight="extrabold"
                px={2.5}
                py={0.5}
              >
                {t("concert_type_festival")}
              </Badge>
            )}
            {(concert.type === "행사" || concert.type === "Event") && (
              <Badge
                bg="amber.50"
                color="amber.600"
                fontSize="10px"
                fontWeight="extrabold"
                px={2.5}
                py={0.5}
              >
                {t("concert_type_event")}
              </Badge>
            )}
            {(concert.performanceType === "단독" || concert.performanceType === "Solo") && (
              <Badge
                bg="purple.50"
                color="brand.main"
                fontSize="10px"
                fontWeight="extrabold"
                px={2.5}
                py={0.5}
              >
                {t("performance_type_solo")}
              </Badge>
            )}
            {(concert.performanceType === "합동" || concert.performanceType === "Joint") && (
              <Badge
                bg="teal.50"
                color="teal.600"
                fontSize="10px"
                fontWeight="extrabold"
                px={2.5}
                py={0.5}
              >
                {t("performance_type_joint")}
              </Badge>
            )}
            {(concert.performanceType === "출연" || concert.performanceType === "Guest") && (
              <Badge
                bg="orange.50"
                color="orange.600"
                fontSize="10px"
                fontWeight="extrabold"
                px={2.5}
                py={0.5}
              >
                {t("performance_type_guest")}
              </Badge>
            )}
          </HStack>

          {/* Concert Name */}
          <Text
            fontSize="md"
            fontWeight="extrabold"
            color="gray.800"
            noOfLines={2}
            minHeight="2.6rem"
            lineHeight="shorter"
            transition="color 0.2s"
            _groupHover={{ color: "brand.main" }}
          >
            {concert.name}
          </Text>

          {/* Location & Date info */}
          <VStack align="start" spacing={1} width="100%">
            <Text fontSize="xs" fontWeight="semibold" color="gray.600" noOfLines={1}>
              {concert.location}
            </Text>
            <Text fontSize="11px" color="gray.400" noOfLines={1}>
              {concert.date ? concert.date.join(", ") : ""}
            </Text>
          </VStack>
        </VStack>

        {/* CTA Button */}
        {!isPastEvent && (
          <Button
            size="sm"
            width="100%"
            fontSize="12px"
            height="36px"
            mt={2}
            bgGradient="linear(to-r, brand.main, brand.sub)"
            color="white"
            borderRadius="full"
            boxShadow="soft"
            _hover={{
              bgGradient: "linear(to-r, purple.600, brand.sub)",
              boxShadow: "glow",
            }}
            onClick={handleTicketButtonClick}
            isDisabled={!concert.ticketLink || concert.ticketLink.length === 0 || concert.ticketLink[0] === ""}
          >
            {getButtonText(concert, isPastEvent, timeRemaining)}
          </Button>
        )}
      </VStack>

      {isMobile ? (
        <TicketDrawer
          links={concert.ticketLink || []}
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
          lang={lang}
          t={t}
        />
      ) : (
        <TicketModal
          links={concert.ticketLink || []}
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
          lang={lang}
          t={t}
        />
      )}
    </Box>
  );
};

export default Card;