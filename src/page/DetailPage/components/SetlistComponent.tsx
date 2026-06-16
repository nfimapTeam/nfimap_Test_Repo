import { useState } from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  VStack,
  Flex,
  Button,
  useBreakpointValue,
  Image,
  SimpleGrid,
  useToast,
  useColorModeValue,
  Spacer,
  IconButton,
} from '@chakra-ui/react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { MusicIcon, CameraIcon, Play, Copy } from 'lucide-react';

// Interfaces
interface Music {
  name: string;
  youtube_url: string;
}

interface Song {
  music: Music;
  status: string;
}

interface Setlist {
  date: string;
  formatted_date: string;
  start_time: string;
  duration_minutes: number;
  music: Song[];
  status: string;
}

interface OOTD {
  image: string;
  date: string;
}

interface SetlistComponentProps {
  lang: string;
  augmentedConcertDetail: any;
  cardBgColor: string;
}

const SetlistComponent: React.FC<SetlistComponentProps> = ({
  lang,
  augmentedConcertDetail,
  cardBgColor,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const tabFontSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const isDoubleLine: boolean = augmentedConcertDetail.setlist?.length > 10;

  const textColor = useColorModeValue("gray.800", "gray.100");
  const textColorSec = useColorModeValue("gray.500", "gray.400");
  const numberColor = useColorModeValue("brand.main", "purple.300");
  const songBg = useColorModeValue("white", "gray.850");
  const borderColor = useColorModeValue("purple.50", "whiteAlpha.100");
  const tabBg = useColorModeValue("purple.50", "whiteAlpha.100");
  const tabHoverBg = useColorModeValue("purple.100", "whiteAlpha.200");
  const tabTextColor = useColorModeValue("purple.600", "purple.200");
  const hoverBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const placeholderBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const numberBg = useColorModeValue("purple.50", "whiteAlpha.100");

  // Function to copy setlist to clipboard
  const handleCopySetlist = (set: Setlist): void => {
    const setlistText = set.music
      .map((song: Song, index: number) => `${index + 1}. ${song.music.name}${songStatus(song.status)}`)
      .join('\n');

    const fullText = `${augmentedConcertDetail.name}\n${moment(set.date, 'YYYY-MM-DD').format('YYYY/MM/DD')} ${t('setlist')}\n\n${setlistText}`;

    navigator.clipboard
      .writeText(fullText)
      .then(() => {
        toast({
          title: t('setlist_copied'),
          description: t('setlist_copied_description'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error('Failed to copy setlist:', err);
        toast({
          title: t('copy_failed'),
          description: t('copy_failed_description'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // Function to open all setlist youtube videos as a custom playlist
  const handleOpenPlaylist = (set: Setlist): void => {
    const videoIds = set.music
      .map((song: Song) => {
        const url = song.music.youtube_url;
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
      })
      .filter((id): id is string => !!id);

    if (videoIds.length === 0) {
      toast({
        title: t('no_youtube_links'),
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const playlistUrl = `https://www.youtube.com/watch_videos?video_ids=${videoIds.join(',')}`;
    window.open(playlistUrl, '_blank');
  };

  // Function to get OOTD images for a specific date
  const getOOTDForDate = (date: string): OOTD[] => {
    return augmentedConcertDetail.ootd.filter((ootd: OOTD) => ootd.date === date);
  };

  const songStatus = (status: string) => {
    const statusMessages: { [key: string]: string } = {
      encore: lang === "ko" ? " - 앵콜" : " - Encore",
      double_encore: lang === "ko" ? " - 앵앵콜" : " - Double Encore",
      extra: lang === "ko" ? " - 한번 더" : " - Once More",
    };

    return statusMessages[status] || "";
  };

  return (
    <>
      {augmentedConcertDetail.setlist &&
        augmentedConcertDetail.setlist.length > 0 && (
          <Box>
            <Tabs variant="soft-rounded" colorScheme="purple" size="md">
              <TabList
                overflowX="auto"
                whiteSpace="nowrap"
                mb={6}
                display="flex"
                flexWrap={isDoubleLine ? 'wrap' : 'nowrap'}
                gap={3}
                css={{
                  '&::-webkit-scrollbar': { height: '6px' },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(160, 174, 192, 0.5)',
                    borderRadius: '6px',
                  },
                }}
              >
                {augmentedConcertDetail.setlist.map(
                  (set: Setlist, index: number) => (
                    <Tab
                      key={index}
                      onClick={(e) => e.currentTarget.focus()}
                      fontSize={tabFontSize}
                      px={{ base: 4, md: 5 }}
                      py={2}
                      minW="auto"
                      bg={tabBg}
                      color={tabTextColor}
                      _selected={{
                        bg: 'brand.main',
                        color: 'white',
                        boxShadow: 'soft',
                        _hover: {
                          bg: 'brand.main',
                          color: 'white',
                        },
                        _active: {
                          bg: 'brand.main',
                        }
                      }}
                      _hover={{
                        bg: tabHoverBg,
                        color: tabTextColor,
                      }}
                      _active={{
                        bg: 'transparent',
                      }}
                      _focus={{
                        boxShadow: 'none',
                      }}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      mb={isDoubleLine ? 3 : 0}
                      transition="all 0.2s"
                      fontWeight="bold"
                    >
                      {moment(set.date, 'YYYY-MM-DD').format('MM/DD')}
                    </Tab>
                  )
                )}
              </TabList>

              <TabPanels pt={2}>
                {augmentedConcertDetail.setlist.map(
                  (set: Setlist, index: number) => (
                    <TabPanel key={index} p={0}>
                      <HStack mb={5} justify="space-between" align="center">
                        <HStack spacing={3}>
                          <Flex 
                            align="center" 
                            justify="center" 
                            w="36px" 
                            h="36px" 
                            borderRadius="full" 
                            bg="brand.purpleSoft"
                          >
                            <Icon
                              as={MusicIcon}
                              color="brand.main"
                              w="18px"
                              h="18px"
                            />
                          </Flex>
                          <Text
                            fontSize={{ base: 'lg', md: 'xl' }}
                            fontWeight="black"
                            color={textColor}
                          >
                            {t("setlist")}
                          </Text>
                        </HStack>
                        {set.music.length > 0 && (
                          <HStack spacing={2.5}>
                            <IconButton
                              aria-label={t("youtube_playlist")}
                              icon={<Icon as={Play} w="14px" h="14px" fill="white" />}
                              onClick={() => handleOpenPlaylist(set)}
                              size="md"
                              bg="red.500"
                              color="white"
                              borderRadius="full"
                              _hover={{ 
                                bg: "red.600",
                                boxShadow: "0 4px 12px rgba(229, 62, 62, 0.3)",
                                transform: "translateY(-1.5px)" 
                              }}
                              _active={{
                                transform: "translateY(0)"
                              }}
                              transition="all 0.2s"
                            />
                            <IconButton
                              aria-label={t("copy_setlist")}
                              icon={<Icon as={Copy} w="16px" h="16px" />}
                              onClick={() => handleCopySetlist(set)}
                              size="md"
                              bg="brand.main"
                              color="white"
                              borderRadius="full"
                              _hover={{ 
                                bg: "purple.600",
                                boxShadow: "glow",
                                transform: "translateY(-1.5px)" 
                              }}
                              _active={{
                                bg: "purple.750",
                                transform: "translateY(0)"
                              }}
                              transition="all 0.2s"
                            />
                          </HStack>
                        )}
                      </HStack>

                      {set.music.length > 0 ? (
                        <VStack spacing={3} align="stretch" mb={8}>
                          {set.music.map((song: Song, songIndex: number) => (
                            <Box
                              key={songIndex}
                              py={3.5}
                              px={5}
                              bg={songBg}
                              borderRadius="2xl"
                              boxShadow="soft"
                              role="group"
                              _hover={{
                                bg: hoverBg,
                                transform: 'translateY(-2px)',
                                boxShadow: 'card',
                              }}
                              transition="all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
                              onClick={() =>
                                window.open(song.music.youtube_url, '_blank')
                              }
                              cursor="pointer"
                              display="flex"
                              alignItems="center"
                              width="100%"
                            >
                              <Flex
                                align="center"
                                justify="center"
                                w="28px"
                                h="28px"
                                borderRadius="full"
                                bg={numberBg}
                                mr={4}
                                flexShrink={0}
                              >
                                <Text
                                  fontSize="xs"
                                  fontWeight="bold"
                                  color={numberColor}
                                >
                                  {songIndex + 1}
                                </Text>
                              </Flex>
                              <Text
                                fontSize={tabFontSize}
                                fontWeight="bold"
                                color={textColor}
                                noOfLines={2}
                                lineHeight="short"
                              >
                                {song.music.name}{songStatus(song.status)}
                              </Text>
                              <Spacer />
                              <Icon 
                                as={Play} 
                                color="brand.main" 
                                opacity={0} 
                                transform="translateX(-10px)"
                                _groupHover={{ opacity: 1, transform: "translateX(0)" }} 
                                transition="all 0.25s cubic-bezier(0.16, 1, 0.3, 1)" 
                                w="14px" 
                                h="14px"
                                fill="brand.main"
                              />
                            </Box>
                          ))}
                        </VStack>
                      ) : (
                        <Flex
                          w="100%"
                          justifyContent="center"
                          alignItems="center"
                          p={8}
                          bg={placeholderBg}
                          borderRadius="2xl"
                          border="1px dashed"
                          borderColor={borderColor}
                        >
                          <Text
                            fontSize={tabFontSize}
                            color={textColorSec}
                            fontWeight="medium"
                          >
                            {t('no_setlist_available')}
                          </Text>
                        </Flex>
                      )}

                      {/* OOTD Section - Display OOTD images for the selected tab's date */}
                      <Box mt={8}>
                        <HStack mb={5} spacing={3}>
                          <Flex 
                            align="center" 
                            justify="center" 
                            w="36px" 
                            h="36px" 
                            borderRadius="full" 
                            bg="pink.50"
                          >
                            <Icon as={CameraIcon} color="pink.500" w="18px" h="18px" />
                          </Flex>
                          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="black" color={textColor}>
                            {t("costume")}
                          </Text>
                        </HStack>
                        {getOOTDForDate(set.date).length > 0 ? (
                          <SimpleGrid columns={{ base: 1 }} spacing={5}>
                            {getOOTDForDate(set.date).map((ootd: OOTD, ootdIndex: number) => (
                              <Box
                                key={ootdIndex}
                                position="relative"
                                overflow="hidden"
                                borderRadius="2xl"
                                boxShadow="soft"
                                transition="all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                                _hover={{ transform: "translateY(-4px)", boxShadow: "card" }}
                              >
                                <Image
                                  src={ootd.image}
                                  alt={`Outfit for ${ootd.date}`}
                                  w="100%"
                                  transition="transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
                                  _hover={{ transform: "scale(1.03)" }}
                                />
                              </Box>
                            ))}
                          </SimpleGrid>
                        ) : (
                          <Flex
                            w="100%"
                            justifyContent="center"
                            alignItems="center"
                            p={8}
                            bg={placeholderBg}
                            borderRadius="2xl"
                            border="1px dashed"
                            borderColor={borderColor}
                          >
                            <Text fontSize={tabFontSize} color={textColorSec} fontWeight="medium">
                              {t("no_ootd_available")}
                            </Text>
                          </Flex>
                        )}
                      </Box>
                    </TabPanel>
                  )
                )}
              </TabPanels>
            </Tabs>
          </Box>
        )}
    </>
  );
};

export default SetlistComponent;