// components/Card.tsx
import React from "react";
import {
  Box,
  Image,
  Text,
  HStack,
  VStack,
  Badge,
  Button,
  Link,
} from "@chakra-ui/react";
import { keyframes } from "@chakra-ui/react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Concert {
  id: number;
  name: string;
  location: string;
  type: string; // 콘서트 | 페스티벌 | 행사
  performanceType: string; // 단독 | 합동 | 출연
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

interface CardProps {
  concert: Concert;
  isTodayEvent: boolean;
  isPastEvent: boolean;
  isTicketOpen: boolean;
  timeRemaining: { days: number; hours: number; minutes: number } | null;
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

const borderGlow = keyframes`
  0% {
    border-color: rgba(121, 174, 242, 0.5);
    box-shadow: 0 0 8px rgba(121, 174, 242, 0.5);
  }
  50% {
    border-color: rgba(121, 174, 242, 0.7);
    box-shadow: 0 0 12px rgba(121, 174, 242, 0.7);
  }
  100% {
    border-color: rgba(121, 174, 242, 0.5);
    box-shadow: 0 0 8px rgba(121, 174, 242, 0.5);
  }
`;

const lavenderGlow = keyframes`
  0% {
    border-color: rgba(186, 85, 211, 0.5); // Lavender purple
    box-shadow: 0 0 8px rgba(186, 85, 211, 0.5);
  }
  50% {
    border-color: rgba(186, 85, 211, 0.7); // Lavender purple
    box-shadow: 0 0 12px rgba(186, 85, 211, 0.7);
  }
  100% {
    border-color: rgba(186, 85, 211, 0.5); // Lavender purple
    box-shadow: 0 0 8px rgba(186, 85, 211, 0.5);
  }
`;

const Card = ({
  concert,
  isTodayEvent,
  isTicketOpen,
  isPastEvent,
  timeRemaining,
  getButtonText,
  handleButtonClick,
}: CardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box
      position="relative"
      onClick={() => navigate(`/${concert.id}`)}
      sx={{
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-10px)",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        bg="white"
        alignItems="flex-start"
        borderColor={isTodayEvent ? "brand.sub" : "gray.200"}
        animation={
          isTodayEvent
            ? `${borderGlow} 1.5s ease-in-out infinite`
            : isTicketOpen
            ? `${lavenderGlow} 1.5s ease-in-out infinite`
            : "none"
        }
        position="relative"
        zIndex={1}
        cursor="pointer"
      >
        <HStack alignItems="flex-start" spacing={4}>
          <Box
            w="150px"
            h="200px"
            overflow="hidden"
            borderRadius="md"
            flexShrink={0}
            filter={isPastEvent ? "grayscale(100%)" : "none"}
            opacity={isPastEvent ? 0.9 : 1}
            transition="all 0.3s ease"
          >
            <Image
              src={concert.poster}
              alt={concert.name}
              objectFit="cover"
              w="100%"
              h="100%"
              fallbackSrc="/image/logo/logo.svg"
            />
          </Box>
          <VStack align="start" spacing={2} flex="1">
            <Box>
              {isPastEvent ? (
                <Badge colorScheme="gray" mb={2}>
                  {t("concert_ended")} {/* 다국어 공연 종료 */}
                </Badge>
              ) : (
                <Badge colorScheme="green" mb={2}>
                  {t("concert_upcoming")} {/* 다국어 공연 예정 */}
                </Badge>
              )}

              <Text
                fontSize="lg"
                fontWeight="bold"
                noOfLines={2}
                mb={2}
                minHeight="3rem"
              >
                {concert.name}
              </Text>

              <Text fontSize="md" noOfLines={1} mb={2}>
                {concert.location}
              </Text>

              <Text fontSize="sm" color="gray.500" noOfLines={1} mb={4}>
                {concert.date.join(", ")}
              </Text>

              <HStack spacing={2}>
                {concert.type === "콘서트" && (
                  <Badge
                    bg="pink.100"
                    color="pink.600"
                    p="4px 8px"
                    borderRadius={4}
                    fontWeight="900"
                  >
                    {t("concert_type_concert")} {/* 다국어 콘서트 */}
                  </Badge>
                )}
                {concert.type === "페스티벌" && (
                  <Badge
                    bg="blue.100"
                    color="blue.600"
                    p="4px 8px"
                    borderRadius={4}
                    fontWeight="900"
                  >
                    {t("concert_type_festival")} {/* 다국어 페스티벌 */}
                  </Badge>
                )}
                {concert.type === "행사" && (
                  <Badge
                    bg="yellow.100"
                    color="yellow.600"
                    p="4px 8px"
                    borderRadius={4}
                    fontWeight="900"
                  >
                    {t("concert_type_event")} {/* 다국어 행사 */}
                  </Badge>
                )}
                {concert.performanceType === "단독" && (
                  <Badge
                    bg="purple.100"
                    color="purple.600"
                    p="4px 8px"
                    borderRadius={4}
                    fontWeight="900"
                  >
                    {t("performance_type_solo")} {/* 다국어 단독 */}
                  </Badge>
                )}
                {concert.performanceType === "합동" && (
                  <Badge
                    bg="teal.100"
                    color="teal.600"
                    p="4px 8px"
                    borderRadius={4}
                    fontWeight="900"
                  >
                    {t("performance_type_joint")} {/* 다국어 합동 */}
                  </Badge>
                )}
                {concert.performanceType === "출연" && (
                  <Badge
                    bg="orange.100"
                    color="orange.600"
                    p="4px 8px"
                    borderRadius={4}
                    fontWeight="900"
                  >
                    {t("performance_type_guest")} {/* 다국어 출연 */}
                  </Badge>
                )}
              </HStack>
            </Box>
          </VStack>
        </HStack>
        {!isPastEvent && (
          <Link href={concert.ticketLink} isExternal>
            <Button
              mt={4}
              border="2px solid #eee"
              bg="brand.sub2"
              _hover={{ bg: "brand.main" }}
              width="100%"
              fontSize="13px"
              onClick={(e) => handleButtonClick(e, concert, isPastEvent)}
              isDisabled={concert.ticketLink === ""}
              color="white"
            >
              {getButtonText(concert, isPastEvent, timeRemaining)}
            </Button>
          </Link>
        )}
      </Box>
    </Box>
  );
};

export default Card;
