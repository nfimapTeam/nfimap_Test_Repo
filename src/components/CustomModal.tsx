import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Image,
  Text,
  Flex,
  Box,
  VStack,
  HStack,
  Divider,
  Button,
  Badge,
  Link,
} from "@chakra-ui/react";
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon, ExternalLinkIcon, StickyNoteIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

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

interface NfiRoad {
  id: number;
  name: string;
  location: string;
  category: string;
  lat: string;
  lng: string;
  naverLink: string;
  note: string;
}

interface CustomModalProps {
  item: Concert | NfiRoad | null;
  isOpen: boolean;
  onClose: () => void;
}

const CustomModal = ({ item, isOpen, onClose }: CustomModalProps) => {
  const { t, i18n } = useTranslation();
  if (!item) return null;

  const isNfiRoad = !("poster" in item);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent maxW={isNfiRoad ? "500px" : "900px"} boxShadow="xl">
        <ModalHeader borderBottom="1px" borderColor="gray.200" py={4} bg="blue.50">
          <Text fontSize="2xl" fontWeight="bold" color="blue.700">
            {item.name}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p="30px" bg="gray.50">
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            gap={{ base: 6, md: 8 }}
          >
            {!isNfiRoad && (
              <Box
                width={{ base: "100%", md: "40%" }}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Box
                  width="100%"
                  height="0"
                  paddingBottom="140%"
                  position="relative"
                  overflow="hidden"
                  borderRadius="lg"
                  boxShadow="md"
                >
                  <Image
                    src={(item as Concert).poster || "/image/logo/logo.svg"} // 포스터가 없으면 기본 이미지
                    alt={item.name}
                    objectFit="cover"
                    position="absolute"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                  />
                </Box>
              </Box>
            )}
            <Box width={{ base: "100%", md: isNfiRoad ? "100%" : "60%" }} bg="white" p={6} borderRadius="lg" boxShadow="md">
              <VStack align="stretch" spacing={5}>
                <Box>
                  <HStack spacing={2} mb={2}>
                    <Badge colorScheme={isNfiRoad ? "green" : "purple"} fontSize="md" px={2} py={1}>
                      {isNfiRoad ? (item as NfiRoad).category : t("performance")}
                    </Badge>
                  </HStack>
                </Box>
                <Divider />
                <VStack align="stretch" spacing={4}>
                  <HStack spacing={4}>
                    <MapPinIcon size={20} color="#3182CE" />
                    <Text fontWeight="medium">{item.location}</Text>
                  </HStack>
                  {isNfiRoad ? (
                    <>
                      {(item as NfiRoad).note && (
                        <HStack spacing={4}>
                          <StickyNoteIcon size={20} color="#3182CE" />
                          <Text fontWeight="medium">{(item as NfiRoad).note}</Text>
                        </HStack>
                      )}
                      {(item as NfiRoad).naverLink && (
                        <Link href={(item as NfiRoad).naverLink} isExternal>
                          <Button
                            colorScheme="green"
                            variant="solid"
                            size="md"
                            width="100%"
                          >
                            {t("checkLocationInfo")}
                          </Button>
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <HStack spacing={4}>
                        <CalendarIcon size={20} color="#3182CE" />
                        <Text fontWeight="medium">
                          {(item as Concert).concertDate.map((d) => d.date).join(" ~ ")}
                        </Text>
                      </HStack>
                      <HStack spacing={4}>
                        <ClockIcon size={20} color="#3182CE" />
                        <Text fontWeight="medium">
                          {(item as Concert).concertDate[0]?.start_time || (item as Concert).startTime}{" "}
                          {t("total")}{" "}
                          {(item as Concert).concertDate[0]?.duration_minutes || "N/A"}{" "}
                          {t("minutes")}
                        </Text>
                      </HStack>
                      <HStack spacing={4} alignItems="flex-start">
                        <UserIcon size={20} color="#3182CE" />
                        <Text fontWeight="medium">
                          {(item as Concert).artists.join(", ")}
                        </Text>
                      </HStack>
                    </>
                  )}
                </VStack>
              </VStack>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;