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
} from "@chakra-ui/react";
import {
  RiTeamLine,
  RiHeart2Line,
  RiMusic2Line,
  RiLightbulbLine,
  RiShieldStarLine,
} from "@remixicon/react";
import { profileData } from "../datas/profile";
import { profileDataEng } from "../datas/profileEng";
import dayjs from "dayjs";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

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

  useEffect(() => {
    if (i18n.language === "ko") {
      setProfileState(profileData);
    } else {
      setProfileState(profileDataEng);
    }
  }, [profileData, profileDataEng, i18n]);

  return (
    <Box
      h="calc(100vh - 120px)"
      width="100%"
      maxWidth="1200px"
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
      <Helmet>
        <title>{t("Profile.title")}</title>
        <meta name="description" content={t("Profile.description")} />
        <meta property="og:description" content={t("Profile.og.description")} />
        <meta property="og:image" content="%PUBLIC_URL%/image/nfimap.png" />
        <meta property="og:url" content="https://nfimap.co.kr" />
      </Helmet>
      <Box width="100%" maxWidth="1200px" mx="auto" p="4">
        <Box mb="8">
          <Image
            src={profileState?.cover_image_url}
            alt={`${profileState?.name} Cover`}
            w="100%"
            h={{ base: "300px", md: "700px" }}
            objectFit="cover"
            borderRadius="md"
            boxShadow="md"
          />
        </Box>

        <Stack mb="8" align="center" spacing="4">
          <Heading as="h1" size="2xl">
            <Image src={"/image/nfLogo.png"} alt="NF Logo" />
          </Heading>

          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap="6"
            w="100%"
            my="6"
          >
            {/* Debut Date */}
            <Flex
              direction="column"
              align="center"
              justifyContent="center"
              p="4"
              borderRadius="md"
              boxShadow="md"
              gap="4"
              border="2px solid #eee"
              width="100%"
            >
              <Icon as={RiLightbulbLine} w="6" h="6" color="blue.500" />
              <Box textAlign="center">
                <Text fontWeight="bold" fontSize="lg" color="blue.700">
                  {t("Profile.debut_date")}
                </Text>
                <Text fontSize="lg" color="gray.600" fontWeight="600">
                  {profileState?.debut_date}
                </Text>
              </Box>
            </Flex>

            {/* Debut Song */}
            <Flex
              direction="column"
              align="center"
              justifyContent="center"
              p="4"
              borderRadius="md"
              boxShadow="md"
              gap="4"
              border="2px solid #eee"
              width="100%"
            >
              <Icon as={RiMusic2Line} w="6" h="6" color="green.500" />
              <Box textAlign="center">
                <Text fontWeight="bold" fontSize="lg" color="green.700">
                  {t("Profile.debut_song")}
                </Text>
                <Text fontSize="lg" color="gray.600" fontWeight="600">
                  {profileState?.debut_song}
                </Text>
              </Box>
            </Flex>

            {/* Fandom */}
            <Flex
              direction="column"
              align="center"
              justifyContent="center"
              p="4"
              borderRadius="md"
              boxShadow="md"
              gap="4"
              border="2px solid #eee"
              width="100%"
            >
              <Icon as={RiHeart2Line} w="6" h="6" color="red.500" />
              <Box textAlign="center">
                <Text fontWeight="bold" fontSize="lg" color="red.700">
                  {t("Profile.fandom")}
                </Text>
                <Text fontSize="lg" color="gray.600" fontWeight="600">
                  {profileState?.fandom_name}
                </Text>
              </Box>
            </Flex>

            {/* Light Stick */}
            <Flex
              direction="column"
              align="center"
              justifyContent="center"
              p="4"
              borderRadius="md"
              boxShadow="md"
              gap="4"
              border="2px solid #eee"
              width="100%"
            >
              <Icon as={RiTeamLine} w="6" h="6" color="purple.500" />
              <Box textAlign="center">
                <Text fontWeight="bold" fontSize="lg" color="purple.700">
                  {t("Profile.light_stick")}
                </Text>
                <Text fontSize="lg" color="gray.600" fontWeight="600">
                  {profileState?.light_stick}
                </Text>
              </Box>
            </Flex>
          </Grid>
        </Stack>

        {/* Members */}
        <Heading as="h2" size="xl" mb="4">
          {t("Profile.members")}
        </Heading>
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(5, 1fr)" }}
          gap="6"
        >
          {profileState?.members.map((member) => (
            <Box
              key={member.name}
              position="relative"
              textAlign="center"
              p="4"
              boxShadow="lg"
              borderRadius="md"
              bg="white"
              border="2px solid #eee"
            >
              <Image
                src={member.imageUrl}
                alt={member.name}
                borderRadius="md"
                boxSize="150px"
                mx="auto"
                objectFit="cover"
                boxShadow="md"
              />
              <Text fontWeight="bold" mt="4">
                {member.name}
              </Text>

              {/* Position Labels */}
              <Flex justifyContent="center" wrap="wrap" gap="2" mt="2">
                {member.position.map((pos, index) => (
                  <Box
                    key={index}
                    bg="teal.100"
                    color="teal.900"
                    px="2"
                    py="1"
                    borderRadius="md"
                    fontSize="sm"
                    boxShadow="md"
                  >
                    {pos}
                  </Box>
                ))}
              </Flex>

              {/* AKA Labels */}
              <Flex justifyContent="center" wrap="wrap" gap="2" mt="2">
                {member.aka.map((akaName, index) => (
                  <Box
                    key={index}
                    bg="blue.100"
                    color="blue.700"
                    px="2"
                    py="1"
                    borderRadius="md"
                    fontSize="sm"
                    boxShadow="md"
                  >
                    {akaName}
                  </Box>
                ))}
              </Flex>

              <Flex justifyContent="center" mt="2">
                <Box
                  bg="purple.100"
                  color="purple.700"
                  px="3"
                  py="1"
                  borderRadius="md"
                  fontSize="sm"
                  boxShadow="md"
                >
                  {member.birthdate}
                </Box>
              </Flex>

              {/* Military Information */}
              {member.military && (
                <Box mt="2" textAlign="center">
                  <Box
                    bg="yellow.100"
                    color="yellow.900"
                    px="2"
                    py="1"
                    borderRadius="md"
                    fontSize="sm"
                    boxShadow="md"
                    display="inline-block"
                  >
                    MBTI: {member.mbti}
                  </Box>
                </Box>
              )}

              {/* Instagram Link */}
              <Flex justifyContent="center" mt="2">
                <Link href={member.instagram} isExternal>
                  <Image
                    borderRadius="4px"
                    src="/image/instagram.jpg"
                    w="24px"
                  />
                </Link>
              </Flex>

              {isFutureDate(member.military) && (
                <Box
                  position="absolute"
                  top="4px"
                  right="4px"
                  bg="green.900"
                  color="white"
                  px="3"
                  py="1"
                  borderRadius="md"
                  fontSize="xs"
                  boxShadow="md"
                  display="flex"
                  alignItems="center"
                >
                  <Icon as={RiShieldStarLine} w="4" h="4" mr="1" />
                  {t("military")}: {member.military}
                </Box>
              )}
            </Box>
          ))}
        </Grid>

        <Heading as="h2" size="xl" mt="8" mb="4">
          SNS
        </Heading>
        <Flex justifyContent="center" gap="6" align="center" wrap="wrap">
          <Link href={profileState?.official_sites.x} isExternal>
            <Image
              src="/image/x.png"
              w="50px"
              h="50px"
              borderRadius="8px"
              transition="all 0.2s"
              _hover={{ transform: "scale(1.1)", boxShadow: "lg" }}
            />
          </Link>

          <Link href={profileState?.official_sites.facebook} isExternal>
            <Image
              src="/image/facebook.jpg"
              w="50px"
              h="50px"
              borderRadius="8px"
              transition="all 0.2s"
              _hover={{ transform: "scale(1.1)", boxShadow: "lg" }}
            />
          </Link>

          <Link href={profileState?.official_sites.instagram} isExternal>
            <Image
              src="/image/instagram.jpg"
              w="50px"
              h="50px"
              borderRadius="8px"
              transition="all 0.2s"
              _hover={{ transform: "scale(1.1)", boxShadow: "lg" }}
            />
          </Link>

          <Link href={profileState?.official_sites.daumcafe} isExternal>
            <Image
              src="/image/daumcafe.png"
              w="50px"
              h="50px"
              borderRadius="8px"
              transition="all 0.2s"
              _hover={{ transform: "scale(1.1)", boxShadow: "lg" }}
            />
          </Link>

          <Link href={profileState?.official_sites.youtube} isExternal>
            <Image
              src="/image/youtube.png"
              w="50px"
              h="50px"
              borderRadius="8px"
              border="1px solid #eee"
              transition="all 0.2s"
              _hover={{ transform: "scale(1.1)", boxShadow: "lg" }}
            />
          </Link>
        </Flex>
      </Box>
    </Box>
  );
};

export default Profile;
