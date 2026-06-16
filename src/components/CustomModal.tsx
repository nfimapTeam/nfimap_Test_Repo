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
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon, ExternalLinkIcon, StickyNoteIcon, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import moment from "moment";

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  if (!item) return null;

  const isNfiRoad = !("poster" in item);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(12px)" bg="rgba(15, 23, 42, 0.35)" />
      <ModalContent 
        maxW={isNfiRoad ? "520px" : "920px"} 
        mx={{ base: 4, md: 0 }}
        boxShadow="2xl" 
        borderRadius="30px" 
        overflow="hidden" 
        border="1px solid" 
        borderColor="gray.100"
        bg="white"
      >
        <ModalHeader 
          borderBottom="1px solid" 
          borderColor="gray.100" 
          py={{ base: 5, md: 6 }} 
          px={{ base: 6, md: 8 }} 
          bg="white"
          zIndex={1}
        >
          <Text 
            fontSize={{ base: "lg", md: "xl" }} 
            fontWeight="extrabold" 
            color="gray.800"
            letterSpacing="-0.5px"
          >
            {item.name}
          </Text>
        </ModalHeader>

        <ModalCloseButton 
          color="gray.400" 
          borderRadius="full"
          _hover={{ bg: "gray.100" }} 
          _active={{ scale: 0.95 }} 
          _focus={{ boxShadow: "none" }} 
          top={{ base: "16px", md: "20px" }} 
          right={{ base: "16px", md: "24px" }}
          transition="all 0.2s"
          zIndex={2}
        />

        <ModalBody p={{ base: 4, md: 8 }} zIndex={1}>
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            gap={{ base: 5, md: 8 }}
          >
            {!isNfiRoad && (
              <Box
                width={{ base: "100%", md: "42%" }}
                maxW={{ base: "240px", md: "100%" }}
                mx="auto"
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Box
                  width="100%"
                  height="0"
                  paddingBottom="142%"
                  position="relative"
                  overflow="hidden"
                  borderRadius="2xl"
                  boxShadow="md"
                  border="1px solid"
                  borderColor="gray.100"
                  transition="all 0.3s"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "lg"
                  }}
                >
                  <Image
                    src={(item as Concert).poster || "/image/logo/logo.svg"}
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
            <Box 
              width={{ base: "100%", md: isNfiRoad ? "100%" : "58%" }} 
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <VStack align="stretch" spacing={4} height="100%">
                <Box>
                  <HStack spacing={2} mb={1}>
                    <Badge 
                      bg="brand.purpleSoft" 
                      color="brand.main"
                      borderRadius="full" 
                      fontSize="9px" 
                      fontWeight="black" 
                      px={3.5} 
                      py={1}
                      letterSpacing="0.5px"
                    >
                      {isNfiRoad ? (
                        (item as NfiRoad).category
                      ) : (
                        <>
                          {((item as Concert).type === "콘서트" || (item as Concert).type === "Concert") && t("concert_type_concert")}
                          {((item as Concert).type === "페스티벌" || (item as Concert).type === "Festival") && t("concert_type_festival")}
                          {((item as Concert).type === "행사" || (item as Concert).type === "Event") && t("concert_type_event")}
                          {!["콘서트", "Concert", "페스티벌", "Festival", "행사", "Event"].includes((item as Concert).type) && (item as Concert).type}
                        </>
                      )}
                    </Badge>
                  </HStack>
                </Box>
                
                {/* Information cards styled as premium separate glass panels */}
                <VStack align="stretch" spacing={3} flex="1">
                  
                  {/* Location Card */}
                  <Flex 
                    align="center" 
                    p={{ base: 3, md: 4 }} 
                    bg="gray.50" 
                    border="1px solid" 
                    borderColor="gray.100" 
                    borderRadius="20px" 
                    boxShadow="sm"
                    transition="all 0.2s"
                    _hover={{ bg: "white", borderColor: "gray.200" }}
                  >
                    <Flex 
                      align="center" 
                      justify="center" 
                      w={{ base: "34px", md: "40px" }} 
                      h={{ base: "34px", md: "40px" }} 
                      minW={{ base: "34px", md: "40px" }}
                      minH={{ base: "34px", md: "40px" }}
                      borderRadius="full" 
                      bg="purple.50"
                      mr={{ base: 3, md: 4 }}
                    >
                      <MapPinIcon size={16} color="#7C3AED" />
                    </Flex>
                    <VStack align="start" spacing={0} minW={0}>
                      <Text fontSize={{ base: "9px", md: "10px" }} fontWeight="black" color="gray.400" textTransform="uppercase" letterSpacing="0.8px">
                        {t("location")}
                      </Text>
                      <Text fontWeight="extrabold" color="gray.700" fontSize={{ base: "xs", md: "sm" }} noOfLines={1}>
                        {item.location}
                      </Text>
                    </VStack>
                  </Flex>
                  
                  {isNfiRoad ? (
                    <>
                      {(item as NfiRoad).note && (
                        <Flex 
                          align="center" 
                          p={{ base: 3, md: 4 }} 
                          bg="gray.50" 
                          border="1px solid" 
                          borderColor="gray.100" 
                          borderRadius="20px" 
                          boxShadow="sm"
                          transition="all 0.2s"
                          _hover={{ bg: "white", borderColor: "gray.200" }}
                        >
                          <Flex 
                            align="center" 
                            justify="center" 
                            w={{ base: "34px", md: "40px" }} 
                            h={{ base: "34px", md: "40px" }} 
                            minW={{ base: "34px", md: "40px" }}
                            minH={{ base: "34px", md: "40px" }}
                            borderRadius="full" 
                            bg="purple.50"
                            mr={{ base: 3, md: 4 }}
                          >
                            <StickyNoteIcon size={16} color="#7C3AED" />
                          </Flex>
                          <VStack align="start" spacing={0} minW={0}>
                            <Text fontSize={{ base: "9px", md: "10px" }} fontWeight="black" color="gray.400" textTransform="uppercase" letterSpacing="0.8px">
                              {t("notes") || "Note"}
                            </Text>
                            <Text fontWeight="extrabold" color="gray.700" fontSize={{ base: "xs", md: "sm" }} noOfLines={2}>
                              {(item as NfiRoad).note}
                            </Text>
                          </VStack>
                        </Flex>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Date Card */}
                      <Flex 
                        align="center" 
                        p={{ base: 3, md: 4 }} 
                        bg="gray.50" 
                        border="1px solid" 
                        borderColor="gray.100" 
                        borderRadius="20px" 
                        boxShadow="sm"
                        transition="all 0.2s"
                        _hover={{ bg: "white", borderColor: "gray.200" }}
                      >
                        <Flex 
                          align="center" 
                          justify="center" 
                          w={{ base: "34px", md: "40px" }} 
                          h={{ base: "34px", md: "40px" }} 
                          minW={{ base: "34px", md: "40px" }}
                          minH={{ base: "34px", md: "40px" }}
                          borderRadius="full" 
                          bg="purple.50"
                          mr={{ base: 3, md: 4 }}
                        >
                          <CalendarIcon size={16} color="#7C3AED" />
                        </Flex>
                        <VStack align="start" spacing={0} minW={0}>
                          <Text fontSize={{ base: "9px", md: "10px" }} fontWeight="black" color="gray.400" textTransform="uppercase" letterSpacing="0.8px">
                            {t("concert_date")}
                          </Text>
                          <Text fontWeight="extrabold" color="gray.700" fontSize={{ base: "xs", md: "sm" }} noOfLines={1}>
                            {(item as Concert).concertDate.map((d) => d.date).join(" ~ ")}
                          </Text>
                        </VStack>
                      </Flex>

                      {/* Time Card */}
                      <Flex 
                        align="center" 
                        p={{ base: 3, md: 4 }} 
                        bg="gray.50" 
                        border="1px solid" 
                        borderColor="gray.100" 
                        borderRadius="20px" 
                        boxShadow="sm"
                        transition="all 0.2s"
                        _hover={{ bg: "white", borderColor: "gray.200" }}
                      >
                        <Flex 
                          align="center" 
                          justify="center" 
                          w={{ base: "34px", md: "40px" }} 
                          h={{ base: "34px", md: "40px" }} 
                          minW={{ base: "34px", md: "40px" }}
                          minH={{ base: "34px", md: "40px" }}
                          borderRadius="full" 
                          bg="purple.50"
                          mr={{ base: 3, md: 4 }}
                        >
                          <ClockIcon size={16} color="#7C3AED" />
                        </Flex>
                        <VStack align="start" spacing={0} minW={0}>
                          <Text fontSize={{ base: "9px", md: "10px" }} fontWeight="black" color="gray.400" textTransform="uppercase" letterSpacing="0.8px">
                            {t("startTime") || "Time"}
                          </Text>
                          <Text fontWeight="extrabold" color="gray.700" fontSize={{ base: "xs", md: "sm" }} noOfLines={1}>
                            {(() => {
                              const timeStr = (item as Concert).concertDate[0]?.start_time || (item as Concert).startTime;
                              return timeStr ? moment(timeStr, "HH:mm:ss").format("HH:mm") : "";
                            })()}{" "}
                            {((item as Concert).concertDate[0]?.duration_minutes && Number((item as Concert).concertDate[0].duration_minutes) > 0) && (
                              <Text as="span" color="gray.400" fontSize="10px" fontWeight="bold">
                                ({t("total")}{" "}{(item as Concert).concertDate[0].duration_minutes}{t("minutes")})
                              </Text>
                            )}
                          </Text>
                        </VStack>
                      </Flex>

                      {/* Artist Card */}
                      <Flex 
                        align="center" 
                        p={{ base: 3, md: 4 }} 
                        bg="gray.50" 
                        border="1px solid" 
                        borderColor="gray.100" 
                        borderRadius="20px" 
                        boxShadow="sm"
                        transition="all 0.2s"
                        _hover={{ bg: "white", borderColor: "gray.200" }}
                      >
                        <Flex 
                          align="center" 
                          justify="center" 
                          w={{ base: "34px", md: "40px" }} 
                          h={{ base: "34px", md: "40px" }} 
                          minW={{ base: "34px", md: "40px" }}
                          minH={{ base: "34px", md: "40px" }}
                          borderRadius="full" 
                          bg="purple.50"
                          mr={{ base: 3, md: 4 }}
                        >
                          <UserIcon size={16} color="#7C3AED" />
                        </Flex>
                        <VStack align="start" spacing={0} minW={0}>
                          <Text fontSize={{ base: "9px", md: "10px" }} fontWeight="black" color="gray.400" textTransform="uppercase" letterSpacing="0.8px">
                            {t("performers") || "Artist"}
                          </Text>
                          <Text fontWeight="extrabold" color="gray.700" fontSize={{ base: "xs", md: "sm" }} noOfLines={{ base: 2, md: 1 }}>
                            {(item as Concert).artists.join(", ")}
                          </Text>
                        </VStack>
                      </Flex>
                    </>
                  )}
                </VStack>
                
                {isNfiRoad ? (
                  (item as NfiRoad).naverLink && (
                    <Link href={(item as NfiRoad).naverLink} isExternal style={{ textDecoration: "none", width: "100%" }}>
                      <Button
                        rightIcon={<ExternalLinkIcon size={16} />}
                        colorScheme="green"
                        variant="solid"
                        h={{ base: "44px", md: "52px" }}
                        width="100%"
                        borderRadius="full"
                        fontWeight="black"
                        boxShadow="0 10px 20px rgba(72, 187, 120, 0.2)"
                        mt={4}
                        _hover={{
                          transform: "translateY(-1px)",
                          boxShadow: "0 12px 22px rgba(72, 187, 120, 0.3)"
                        }}
                        transition="all 0.2s"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {t("checkLocationInfo")}
                      </Button>
                    </Link>
                  )
                ) : (
                  <Button
                    rightIcon={<ArrowUpRight size={16} />}
                    bg="brand.main"
                    color="white"
                    h={{ base: "44px", md: "52px" }}
                    width="100%"
                    borderRadius="full"
                    fontWeight="black"
                    boxShadow="0 10px 22px rgba(124, 58, 237, 0.2)"
                    mt={4}
                    _hover={{
                      bg: "brand.main",
                      opacity: 0.95,
                      transform: "translateY(-1px)",
                      boxShadow: "0 12px 25px rgba(124, 58, 237, 0.3)"
                    }}
                    _active={{
                      transform: "translateY(0)"
                    }}
                    onClick={() => {
                      onClose();
                      navigate(`/${item.id}`);
                    }}
                    transition="all 0.2s"
                    letterSpacing="0.5px"
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    {t("View Details")}
                  </Button>
                )}
              </VStack>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;