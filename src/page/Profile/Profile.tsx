import React, { useEffect, useState } from "react";
import {
  Box,
  Image,
  Text,
  Heading,
  Flex,
  Grid,
  Stack,
  Link,
  Icon,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  RiTeamLine,
  RiHeart2Line,
  RiMusic2Line,
  RiLightbulbLine,
  RiStarFill,
  RiShieldStarLine,
} from "@remixicon/react";
import { profileData } from "../../datas/profile";
import { profileDataEng } from "../../datas/profileEng";
import dayjs from "dayjs";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import ProfileModal from "./components/ProfileModal";
import YouTubePlayer from "./components/Youtube";

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
    { src: "/image/icon/sns/x.png", url: profileState?.official_sites.x },
    { src: "/image/icon/sns/facebook.jpg", url: profileState?.official_sites.facebook },
    { src: "/image/icon/sns/instagram.jpg", url: profileState?.official_sites.instagram },
    { src: "/image/icon/sns/daumcafe.png", url: profileState?.official_sites.daumcafe },
    { src: "/image/icon/sns/youtube.png", url: profileState?.official_sites.youtube },
  ];

  const infoCards = [
    {
      icon: RiLightbulbLine,
      title: t("Profile.debut_date"),
      value: profileState?.debut_date,
      color: "blue.500",
    },
    {
      icon: RiMusic2Line,
      title: t("Profile.debut_song"),
      value: profileState?.debut_song,
      color: "green.500",
    },
    {
      icon: RiHeart2Line,
      title: t("Profile.fandom"),
      value: profileState?.fandom_name,
      color: "red.500",
    },
    {
      icon: RiTeamLine,
      title: t("Profile.light_stick"),
      value: profileState?.light_stick,
      color: "purple.500",
    },
  ];

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    onOpen();
  };

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
                bgGradient="linear(to-r, #9F7AEA, #805AD5)"
                p="2px"
                boxShadow="0 4px 10px rgba(159, 122, 234, 0.5)"
                _hover={{
                  transform: "scale(1.2)",
                  boxShadow: "0 8px 20px rgba(159, 122, 234, 0.8)",
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
        {/* Cover Image */}
        <Box position="relative" mb={8} borderRadius="lg" overflow="hidden" boxShadow="lg">
          <Image
            src={profileState?.cover_image_url}
            alt={`${profileState?.name} Cover`}
            w="100%"
            h={{ base: "250px", md: "400px", lg: "500px" }}
            objectFit="cover"
          />
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bgGradient="linear(to-t, rgba(0,0,0,0.3), transparent)"
          />
        </Box>

        {/* Profile Info */}
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
            {infoCards.map((card, index) => (
              <Flex
                key={index}
                direction="column"
                align="center"
                p={4}
                borderRadius="lg"
                bg={cardBg}
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.100"
                _hover={{ boxShadow: "md", transform: "translateY(-4px)" }}
                transition="all 0.2s ease"
              >
                <Icon as={card.icon} w={6} h={6} color={card.color} />
                <Text fontWeight="bold" fontSize="md" color={`${card.color.split(".")[0]}.700`}>
                  {card.title}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {card.value || "N/A"}
                </Text>
              </Flex>
            ))}
          </Grid>
        </Stack>

        {/* Members Grid */}
        <Flex
          wrap="wrap"
          justify="center"
          align="stretch"
          gap={6}
          w="100%"
        >
          {profileState?.members.map((member) => (
            <Box
              key={member.name}
              cursor="pointer"
              textAlign="center"
              position="relative"
              bg={cardBg}
              borderRadius="lg"
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
              border="1px solid"
              borderColor={cardBorder}
              p={3}
              _hover={{
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
                transform: "translateY(-6px)",
              }}
              transition="all 0.3s ease"
              onClick={() => handleMemberClick(member)}
              role="button"
              aria-label={`View ${member.name}'s profile`}
              flexBasis={{
                base: "100%",     // 모바일 1열
                sm: "100%",       // 작은 화면 1열
                md: "calc(33.333% - 1rem)", // 중간 화면 3열
                lg: "calc(19% - 1rem)"      // 큰 화면 5열
              }}
              maxW={{
                base: "100%",
                sm: "100%",
                md: "calc(33.333% - 1rem)",
                lg: "calc(20% - 1rem)"
              }}
            >
              <Box position="relative" w="100%" h="0" paddingBottom="100%" mx="auto">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  w="100%"
                  h="100%"
                  position="absolute"
                  top={0}
                  left={0}
                  borderRadius="md"
                  objectFit="cover"
                  border="1px solid"
                  borderColor={cardBorder}
                  _hover={{ filter: "brightness(0.9)" }}
                  transition="all 0.3s ease"
                />
                {/* Hover Overlay */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bg={overlayBg}
                  borderRadius="md"
                  opacity={0}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  color="white"
                  _hover={{ opacity: 1 }}
                  transition="opacity 0.3s ease"
                >
                  <Text fontSize="sm" fontWeight="bold">
                    {member.mbti || "N/A"}
                  </Text>
                  <Text fontSize="xs">{member.position.join(", ") || "N/A"}</Text>
                  <Text fontSize="xs" mt={2} fontStyle="italic">
                    View Profile
                  </Text>
                </Box>
                {/* Leader Badge */}
                {member.position.includes("Leader") && (
                  <Box
                    position="absolute"
                    top={2}
                    left={2}
                    bg="yellow.400"
                    borderRadius="full"
                    p={1}
                    title="Group Leader"
                  >
                    <Icon as={RiStarFill} w={4} h={4} color="white" />
                  </Box>
                )}
              </Box>
              <Text mt={2} fontWeight="medium" fontSize="md" color="gray.700">
                {member.name}
              </Text>
            </Box>
          ))}
        </Flex>

        <ProfileModal isOpen={isOpen} onClose={onClose} selectedMember={selectedMember} />
        <YouTubePlayer isMobile={isMobile} />
      </Box>
    </Box>
  );
};

export default Profile;