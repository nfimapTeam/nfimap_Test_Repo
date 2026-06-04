import React, { useEffect, useState } from "react";
import {
  Box,
  Image,
  Text,
  Heading,
  Flex,
  Grid,
  Stack,
  VStack,
  Link,
  Icon,
  Badge,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  RiTeamLine,
  RiHeart2Line,
  RiMusic2Line,
  RiStarFill,
} from "@remixicon/react";
import { CalendarDays, Disc, Heart, Sparkles } from "lucide-react";
import { profileData } from "../../datas/profile";
import { profileDataEng } from "../../datas/profileEng";
import dayjs from "dayjs";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import ProfileModal from "./components/ProfileModal";
import YouTubePlayer from "../Content/Components/Youtube";
import { motion, AnimatePresence } from "framer-motion";

interface Member {
  name: string;
  position: string[];
  aka: string[];
  birthdate: string;
  imageUrl: string;
  military: string;
  instagram: string;
  mbti: string;
}

interface OfficialSites {
  x: string;
  facebook: string;
  instagram: string;
  youtube: string;
  daumcafe: string;
}

interface ProfileData {
  name: string;
  debut_date: string;
  debut_song: string;
  cover_image_url: string;
  members: Member[];
  fandom_name: string;
  light_stick: string;
  official_sites: OfficialSites;
}

const today = dayjs();

const isFutureDate = (militaryDate: string) => {
  if (!militaryDate) return false;
  return dayjs(militaryDate, "YYMMDD").isAfter(today);
};

const Profile = () => {
  const { t, i18n } = useTranslation();
  const [profileState, setProfileState] = useState<ProfileData>();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const cardBg = useColorModeValue("white", "gray.800");
  const overlayBg = useColorModeValue("rgba(0, 0, 0, 0.6)", "rgba(255, 255, 255, 0.2)");
  const cardBorder = useColorModeValue("gray.200", "gray.600");
  const isMobileOrTablet = useBreakpointValue({ base: true, md: true, lg: false });

  useEffect(() => {
    const newProfileData = i18n.language === "ko" ? profileData : profileDataEng;
    setProfileState(newProfileData);
  }, [i18n.language]);

  const snsIcons = [
    { src: "/image/icon/sns/x.png", url: profileState?.official_sites.x, name: "X" },
    { src: "/image/icon/sns/facebook.jpg", url: profileState?.official_sites.facebook, name: "Facebook" },
    { src: "/image/icon/sns/instagram.jpg", url: profileState?.official_sites.instagram, name: "Instagram" },
    { src: "/image/icon/sns/daumcafe.png", url: profileState?.official_sites.daumcafe, name: "Daum Cafe" },
    { src: "/image/icon/sns/youtube.png", url: profileState?.official_sites.youtube, name: "YouTube" },
  ];

  const infoCards = [
    {
      icon: CalendarDays,
      title: t("Profile.debut_date"),
      value: profileState?.debut_date,
      color: "purple.500",
    },
    {
      icon: Disc,
      title: t("Profile.debut_song"),
      value: profileState?.debut_song,
      color: "cyan.500",
    },
    {
      icon: Heart,
      title: t("Profile.fandom"),
      value: profileState?.fandom_name,
      color: "pink.500",
    },
    {
      icon: Sparkles,
      title: t("Profile.light_stick"),
      value: profileState?.light_stick,
      color: "orange.500",
    },
  ];

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    onOpen();
  };

  const coverImages = [
    "/image/nflying_cover_image_1.webp",
    "/image/nflying_cover_image_2.webp",
    "/image/nflying_cover_image_3.webp",
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % coverImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      h={isMobileOrTablet ? "calc(100svh - 120px)" : "calc(100svh - 70px)"}
      width="100%"
      mx="auto"
      p="16px 16px 100px 16px"
      overflowY="auto"
      css={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
    >
      <Box maxWidth="1200px" margin="auto">
        <Helmet>
          <title>{t("Profile.title")}</title>
          <meta name="description" content={t("Profile.description")} />
          <meta property="og:description" content={t("Profile.og.description")} />
          <meta property="og:image" content="%PUBLIC_URL%/image/nfimap.png" />
          <meta property="og:url" content="https://nfimap.co.kr" />
        </Helmet>
        <Flex justify={isMobile ? "center" : "flex-end"} gap={4} py={4} wrap="wrap">
          {snsIcons.map((sns, index) => (
            <Link
              key={index}
              href={sns.url}
              isExternal
              _hover={{ textDecoration: "none" }}
              aria-label={`Visit ${sns.url}`}
            >
              <Image
                src={sns.src}
                w="40px"
                h="40px"
                borderRadius="full"
                border="1px solid transparent"
                bgGradient="linear(to-r, #9DBCBF, #7AA8A6)"
                p="2px"
                boxShadow="0 4px 10px rgba(157, 188, 191, 0.5)"
                _hover={{
                  transform: "scale(1.2)",
                  boxShadow: "0 8px 20px rgba(157, 188, 191, 0.8)",
                  filter: "brightness(1.1)",
                }}
                transition="all 0.4s ease"
              />
            </Link>
          ))}
        </Flex>

        <Flex w="100%" bg="#9DBCBF" justifyContent="center" py={4} mb={4} borderRadius="lg">
          <Heading as="h1" size={{ base: "xl", md: "2xl" }} textAlign="center">
            <Image
              src="/image/nflying_logo_mint.svg"
              alt="NF Logo"
              maxW={{ base: "150px", md: "200px" }}
              mx="auto"
            />
          </Heading>
        </Flex>

        {/* Cover Image Banner (Carousel) */}
        <Box 
          position="relative" 
          mb={10} 
          borderRadius="3xl" 
          overflow="hidden" 
          boxShadow="0 20px 40px -15px rgba(139, 92, 246, 0.12)"
          h={{ base: "240px", md: "400px", lg: "480px" }}
          w="100%"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <Image
                src={coverImages[activeImageIndex]}
                alt="N.Flying Cover Banner"
                w="100%"
                h="100%"
                objectFit="cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Subtle gradient overlay */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bgGradient="linear(to-t, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.05) 60%, transparent 100%)"
            pointerEvents="none"
            zIndex={1}
          />

          {/* Indicator dots */}
          <Flex
            position="absolute"
            bottom="16px"
            left="50%"
            transform="translateX(-50%)"
            gap={2.5}
            zIndex={2}
          >
            {coverImages.map((_, index) => (
              <Box
                key={index}
                w={activeImageIndex === index ? "24px" : "8px"}
                h="8px"
                borderRadius="full"
                bg="white"
                opacity={activeImageIndex === index ? 1 : 0.4}
                transition="all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                cursor="pointer"
                onClick={() => setActiveImageIndex(index)}
              />
            ))}
          </Flex>
        </Box>

        {/* Profile Info Grid */}
        <Stack w="100%" spacing={6} align="center" mb={10}>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={4}
            w="100%"
          >
            {infoCards.map((card, index) => {
              const colorPrefix = card.color.split(".")[0];
              return (
                <Flex
                  key={index}
                  direction="row"
                  align="center"
                  p={5}
                  borderRadius="2xl"
                  bg={cardBg}
                  boxShadow="soft"
                  border="1px solid"
                  borderColor="purple.50"
                  _hover={{ 
                    boxShadow: "card", 
                    transform: "translateY(-4px)",
                    borderColor: `${colorPrefix}.300`
                  }}
                  transition="all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                  gap={4}
                >
                  <Flex
                    w="44px"
                    h="44px"
                    borderRadius="xl"
                    bg={`${colorPrefix}.50`}
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    <Icon as={card.icon} w={5} h={5} color={card.color} />
                  </Flex>
                  <Stack spacing={0.5} align="start">
                    <Text fontSize="11px" fontWeight="bold" color="gray.400" textTransform="uppercase" letterSpacing="widest">
                      {card.title}
                    </Text>
                    <Text fontSize="15px" fontWeight="extrabold" color="gray.800" noOfLines={1}>
                      {card.value || "N/A"}
                    </Text>
                  </Stack>
                </Flex>
              );
            })}
          </Grid>
        </Stack>

        {/* Members Section Header */}
        <VStack align="center" spacing={2} mt={12} mb={8}>
          <Text fontSize="xs" fontWeight="bold" color="purple.500" textTransform="uppercase" letterSpacing="widest">
            {t("Profile.members_subtitle", "MEMBERS")}
          </Text>
          <Heading as="h2" size="lg" fontWeight="extrabold" color="gray.850">
            {t("Profile.members")}
          </Heading>
          <Box w="32px" h="3px" bg="purple.400" borderRadius="full" />
        </VStack>

        {/* Members Grid */}
        <Flex
          wrap="wrap"
          justify="center"
          align="stretch"
          gap={6}
          w="100%"
        >
          {profileState?.members.map((member) => {
            const isLeader = member.position.includes("Leader") || member.position.includes("리더");
            const displayPositions = member.position.filter(pos => pos !== "Leader" && pos !== "리더");
            const primaryPosition = displayPositions[0] || member.position[0];

            return (
              <Box
                key={member.name}
                cursor="pointer"
                position="relative"
                bg={cardBg}
                borderRadius="3xl"
                boxShadow="soft"
                border="1px solid"
                borderColor="purple.50"
                p={4}
                role="group"
                _hover={{
                  boxShadow: "card",
                  transform: "translateY(-6px)",
                  borderColor: "purple.100",
                }}
                transition="all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                onClick={() => handleMemberClick(member)}
                flexBasis={{
                  base: "100%",
                  sm: "100%",
                  md: "calc(33.333% - 1rem)",
                  lg: "calc(20% - 1rem)"
                }}
                maxW={{
                  base: "100%",
                  sm: "100%",
                  md: "calc(33.333% - 1rem)",
                  lg: "calc(20% - 1rem)"
                }}
              >
                <Box 
                  position="relative" 
                  w="100%" 
                  h="0" 
                  paddingBottom="100%" 
                  mx="auto"
                  borderRadius="2xl"
                  overflow="hidden"
                  bg="gray.50"
                >
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    w="100%"
                    h="100%"
                    position="absolute"
                    top={0}
                    left={0}
                    objectFit="cover"
                    transition="transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
                    _groupHover={{ transform: "scale(1.06)", filter: "brightness(0.9)" }}
                  />
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="linear-gradient(to top, rgba(139, 92, 246, 0.9) 0%, rgba(139, 92, 246, 0.3) 70%, transparent 100%)"
                    opacity={0}
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-end"
                    p={4}
                    _groupHover={{ opacity: 1 }}
                    transition="all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                  >
                    <Badge bg="white" color="brand.main" alignSelf="start" mb={1.5} fontSize="10px" borderRadius="full" px={2.5}>
                      MBTI: {member.mbti || "N/A"}
                    </Badge>
                    <Text fontSize="13px" fontWeight="bold" color="white" noOfLines={1} mb={0.5}>
                      {displayPositions.join(" / ")}
                    </Text>
                    <Text fontSize="11px" color="purple.100" fontWeight="medium">
                      Birth: {dayjs(member.birthdate).format("YYYY.MM.DD")}
                    </Text>
                  </Box>
                  {isLeader && (
                    <Box
                      position="absolute"
                      top={3}
                      left={3}
                      bg="rgba(139, 92, 246, 0.9)"
                      backdropFilter="blur(4px)"
                      borderRadius="full"
                      p={1.5}
                      boxShadow="lg"
                      title="Group Leader"
                      zIndex={1}
                    >
                      <Icon as={RiStarFill} w={3.5} h={3.5} color="white" />
                    </Box>
                  )}
                </Box>
                <VStack align="center" spacing={0.5} mt={3}>
                  <Text fontWeight="extrabold" fontSize="lg" color="gray.850" _groupHover={{ color: "brand.main" }} transition="color 0.2s">
                    {member.name}
                  </Text>
                  <Text fontSize="11px" fontWeight="bold" color="purple.500" textTransform="uppercase" letterSpacing="wider">
                    {primaryPosition}
                  </Text>
                </VStack>
              </Box>
            );
          })}
        </Flex>

        <ProfileModal isOpen={isOpen} onClose={onClose} selectedMember={selectedMember} />
      </Box>
    </Box>
  );
};

export default Profile;