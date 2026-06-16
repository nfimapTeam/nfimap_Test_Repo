import React from "react";
import {
  Box,
  Image,
  Flex,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
  Text,
  Heading,
  VStack,
  Divider,
  Button,
  Icon,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Calendar, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

const MotionBox = chakra(motion.div);

interface Member {
  name: string;
  imageUrl: string;
  position: string[];
  aka: string[] | null;
  birthdate: string;
  mbti: string;
  instagram: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMember: Member | null;
}

const ProfileModal = ({ isOpen, onClose, selectedMember }: ProfileModalProps) => {
  const { t } = useTranslation();
  
  // Theme Color Configurations (Rules of Hooks compliant)
  const cardBg = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const labelTextColors = useColorModeValue("gray.450", "gray.500");
  
  const modalBorderColor = useColorModeValue("purple.50", "whiteAlpha.100");
  const badgeBorderColor = useColorModeValue("purple.100", "rgba(139, 92, 246, 0.2)");
  const badgeColor = useColorModeValue("purple.500", "purple.200");
  const dividerColor = useColorModeValue("gray.100", "whiteAlpha.100");

  const closeButtonBg = useColorModeValue("gray.100", "whiteAlpha.100");
  const closeButtonColor = useColorModeValue("gray.400", "gray.300");

  const [isLightboxOpen, setIsLightboxOpen] = React.useState(true);

  React.useEffect(() => {
    if (isOpen) {
      setIsLightboxOpen(true);
    }
  }, [isOpen, selectedMember]);

  const getInstagramHandle = (url: string) => {
    return url
      .replace("https://www.instagram.com/", "")
      .replace("https://instagram.com/", "")
      .replace("/", "");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom">
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(12px)" />
      {!isLightboxOpen && (
        <ModalContent
          maxW={{ base: "88%", md: "500px" }}
          borderRadius="3xl"
          boxShadow="2xl"
          bg={cardBg}
          overflow="hidden"
          borderWidth="1px"
          borderColor={modalBorderColor}
        >
          {/* Responsive Layout: Column on mobile, Row on desktop */}
          <Flex direction={{ base: "column", md: "row" }} align="stretch" position="relative">
            
            {/* Custom Context-aware Close Button */}
            <ModalCloseButton 
              color={{ base: "white", md: closeButtonColor }} 
              borderRadius="full" 
              bg={{ base: "blackAlpha.400", md: "transparent" }}
              _hover={{ bg: { base: "blackAlpha.600", md: closeButtonBg } }} 
              top="4" 
              right="4" 
              zIndex="10" 
            />

            {/* Left / Top Side: Editorial Photo Poster */}
            <Box
              w={{ base: "100%", md: "210px" }}
              h={{ base: "260px", md: "auto" }}
              position="relative"
              overflow="hidden"
              flexShrink={0}
              cursor="zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            >
              <MotionBox
                animate={{ scale: [1, 1.08] }}
                transition={{
                  duration: 8,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                } as any}
                w="100%"
                h="100%"
                position={{ base: "static", md: "absolute" }}
                top={0}
                left={0}
              >
                <Image
                  src={selectedMember?.imageUrl}
                  alt={selectedMember?.name}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              </MotionBox>
              {/* Subtle Gradient Overlay on mobile for depth */}
              <Box 
                display={{ base: "block", md: "none" }}
                position="absolute"
                bottom={0}
                left={0}
                w="100%"
                h="60px"
                bgGradient="linear(to-t, rgba(0,0,0,0.4), transparent)"
                pointerEvents="none"
                zIndex={2}
              />
            </Box>

            {/* Right / Bottom Side: Profile Details */}
            <Flex
              flex={1}
              direction="column"
              justifyContent="center"
              p={{ base: 5, md: 6 }}
              bg={cardBg}
            >
              {selectedMember && (
                <Flex direction="column" align={{ base: "center", md: "flex-start" }} width="100%">
                  
                  {/* Name */}
                  <Heading 
                    as="h3" 
                    size="md" 
                    fontWeight="black" 
                    color={textColor} 
                    textAlign={{ base: "center", md: "left" }}
                    letterSpacing="-0.5px"
                  >
                    {selectedMember.name}
                  </Heading>

                  {/* AKA / Aliases */}
                  {selectedMember.aka && selectedMember.aka.length > 0 && (
                    <Text
                      fontSize="11px"
                      fontWeight="bold"
                      color="gray.400"
                      textAlign={{ base: "center", md: "left" }}
                      mt={1}
                    >
                      {selectedMember.aka.join(" • ")}
                    </Text>
                  )}

                  {/* Positions Badges */}
                  <Flex justifyContent={{ base: "center", md: "flex-start" }} wrap="wrap" gap={1.5} mt={3} mb={1}>
                    {selectedMember.position.map((pos, index) => (
                      <Box
                        key={index}
                        fontSize="9px"
                        fontWeight="extrabold"
                        px={2.5}
                        py={0.5}
                        borderRadius="full"
                        borderWidth="1px"
                        borderColor={badgeBorderColor}
                        color={badgeColor}
                        letterSpacing="0.3px"
                        textTransform="uppercase"
                      >
                        {pos}
                      </Box>
                    ))}
                  </Flex>

                  <Divider my={4} borderColor={dividerColor} />

                  {/* Metadata List */}
                  <VStack spacing={3} align="stretch" w="100%" px={1}>
                    {/* Birthday */}
                    <Flex justify="space-between" align="center">
                      <Flex align="center" gap={2}>
                        <Icon as={Calendar} color="purple.400" boxSize="14px" />
                        <Text fontSize="xs" fontWeight="semibold" color={labelTextColors}>
                          {t("birthdate")}
                        </Text>
                      </Flex>
                      <Text fontSize="xs" fontWeight="extrabold" color={textColor}>
                        {selectedMember.birthdate}
                      </Text>
                    </Flex>

                    {/* MBTI */}
                    <Flex justify="space-between" align="center">
                      <Flex align="center" gap={2}>
                        <Icon as={Sparkles} color="orange.400" boxSize="14px" />
                        <Text fontSize="xs" fontWeight="semibold" color={labelTextColors}>
                          MBTI
                        </Text>
                      </Flex>
                      <Text fontSize="xs" fontWeight="extrabold" color={textColor}>
                        {selectedMember.mbti}
                      </Text>
                    </Flex>
                  </VStack>

                  <Divider my={4} borderColor={dividerColor} />

                  {/* Instagram Button */}
                  <Button
                    as={Link}
                    href={selectedMember.instagram}
                    isExternal
                    w="100%"
                    h="38px"
                    bg="brand.main"
                    color="white"
                    borderRadius="full"
                    leftIcon={<Instagram size={14} />}
                    fontSize="xs"
                    fontWeight="black"
                    _hover={{
                      bg: "purple.600",
                      transform: "translateY(-1px)",
                      boxShadow: "0 6px 15px rgba(139, 92, 246, 0.25)",
                      textDecoration: "none",
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                    transition="all 0.2s"
                  >
                    @{getInstagramHandle(selectedMember.instagram)}
                  </Button>

                </Flex>
              )}
            </Flex>

          </Flex>
        </ModalContent>
      )}

      {/* Full-screen Lightbox Overlay for Image Zoom */}
      <AnimatePresence>
        {isLightboxOpen && selectedMember && (
          <Box
            position="fixed"
            top={0}
            left={0}
            w="100vw"
            h="100vh"
            bg="blackAlpha.900"
            zIndex={1600}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={() => setIsLightboxOpen(false)}
            cursor="zoom-out"
            backdropFilter="blur(5px)"
          >
            <MotionBox
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" } as any}
              position="relative"
              onClick={() => setIsLightboxOpen(false)}
              cursor="zoom-out"
            >
              <Image
                src={selectedMember.imageUrl}
                alt={selectedMember.name}
                maxW="90vw"
                maxH="85vh"
                objectFit="contain"
                borderRadius="2xl"
                boxShadow="2xl"
              />
              <Box 
                position="absolute"
                top="-30px"
                right="0"
                color="whiteAlpha.750"
                fontSize="xs"
                fontWeight="extrabold"
                cursor="pointer"
                onClick={() => setIsLightboxOpen(false)}
                _hover={{ color: "white" }}
              >
                CLOSE ✕
              </Box>
            </MotionBox>
          </Box>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default ProfileModal;
