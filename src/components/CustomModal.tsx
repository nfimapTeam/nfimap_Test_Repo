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

interface CustomModalProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
}

const CustomModal = ({ item, isOpen, onClose }: CustomModalProps) => {
  if (!item) return null;

  const isNfiLoad = !("poster" in item);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent maxW={isNfiLoad ? "500px" : "900px"} boxShadow="xl">
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
            {!isNfiLoad && (
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
                    src={item.poster}
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
            <Box width={{ base: "100%", md: isNfiLoad ? "100%" : "60%" }} bg="white" p={6} borderRadius="lg" boxShadow="md">
              <VStack align="stretch" spacing={5}>
                <Box>
                  <HStack spacing={2} mb={2}>
                    <Badge colorScheme={isNfiLoad ? "green" : "purple"} fontSize="md" px={2} py={1}>
                      {isNfiLoad ? item.category : "공연"}
                    </Badge>
                  </HStack>
                </Box>
                <Divider />
                <VStack align="stretch" spacing={4}>
                  <HStack spacing={4}>
                    <MapPinIcon size={20} color="#3182CE" />
                    <Text fontWeight="medium">{item.location}</Text>
                  </HStack>
                  {isNfiLoad ? (
                    <>
                      {item.note && (
                        <HStack spacing={4}>
                          <StickyNoteIcon  size={20} color="#3182CE" />
                          <Text fontWeight="medium">{item.note}</Text>
                        </HStack>
                      )}
                      {item.naverLink && (
                        <Link href={item.naverLink} isExternal>
                          <Button
                            colorScheme="green"
                            variant="solid"
                            size="md"
                            width="100%"
                          >
                            네이버 지도로 이동
                          </Button>
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <HStack spacing={4}>
                        <CalendarIcon size={20} color="#3182CE" />
                        <Text fontWeight="medium">{item.date.join(" ~ ")}</Text>
                      </HStack>
                      <HStack spacing={4}>
                        <ClockIcon size={20} color="#3182CE" />
                        <Text fontWeight="medium">
                          {item.startTime} (총 {item.durationMinutes}분)
                        </Text>
                      </HStack>
                      <HStack spacing={4} alignItems="flex-start">
                        <UserIcon size={20} color="#3182CE" />
                        <Text fontWeight="medium">{item.artists.join(", ")}</Text>
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