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
  BoxProps,
  IconProps,
  TextProps,
  ButtonProps,
  useToast,
} from '@chakra-ui/react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { MusicIcon, CameraIcon } from 'lucide-react';

// Interfaces
interface Music {
  name: string;
  youtube_url: string;
}

interface Song {
  music: Music;
}

interface Setlist {
  date: string;
  formatted_date: string;
  start_time: string;
  duration_minutes: number;
  music: Song[];
}

interface OOTD {
  image: string;
  date: string;
}

interface AugmentedConcertDetail {
  setlist: Setlist[];
  ootd: OOTD[];
  poster: string;
  name: string;
}

interface SetlistComponentProps {
  augmentedConcertDetail: any;
  cardBgColor: string;
}

const SetlistComponent: React.FC<SetlistComponentProps> = ({
  augmentedConcertDetail,
  cardBgColor,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const tabFontSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const isDoubleLine: boolean = augmentedConcertDetail.setlist?.length > 10;

  // Function to copy setlist to clipboard
  const handleCopySetlist = (set: Setlist): void => {
    const setlistText = set.music
      .map((song: Song, index: number) => `${index + 1}. ${song.music.name}`)
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

  // Function to get OOTD images for a specific date
  const getOOTDForDate = (date: string): OOTD[] => {
    return augmentedConcertDetail.ootd.filter((ootd: OOTD) => ootd.date === date);
  };

  return (
    <>
      {augmentedConcertDetail.setlist &&
        augmentedConcertDetail.setlist.length > 0 && (
          <Box
            bg={cardBgColor}
            p={{ base: 4, md: 6 }}
            width="100%"
            as="section"
            border="1px solid"
            borderRadius="2xl"
            boxShadow="xl"
            borderColor="purple.100"
            transition="all 0.3s"
            _hover={{ boxShadow: '2xl', transform: 'translateY(-4px)' }}
          >
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
                      fontSize={tabFontSize}
                      px={{ base: 4, md: 5 }}
                      py={2}
                      minW="auto"
                      bg="purple.50"
                      _selected={{
                        bg: 'purple.600',
                        color: 'white',
                        boxShadow: 'md',
                      }}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      mb={isDoubleLine ? 3 : 0}
                      transition="all 0.2s"
                      _hover={{ bg: 'purple.100' }}
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
                      <HStack mb={6} justify="space-between" align="center">
                        <HStack>
                          <Icon
                            as={MusicIcon}
                            color="purple.500"
                            boxSize={{ base: 6, md: 8 }}
                          />
                          <Text
                            fontSize={{ base: 'xl', md: '2xl' }}
                            fontWeight="extrabold"
                            color="gray.800"
                            bgGradient="linear(to-r, purple.600, pink.500)"
                            bgClip="text"
                          >
                            {t('setlist')}
                          </Text>
                        </HStack>
                      </HStack>
                      {/* Setlist Section */}
                      {set.music.length > 0 && (
                        <Flex w="100%" h="40px" justifyContent="flex-end" mb={6}>
                          <Button
                            size="md"
                            colorScheme="purple"
                            borderRadius="full"
                            px={8}
                            onClick={() => handleCopySetlist(set)}
                            leftIcon={<Icon as={MusicIcon} />}
                            _hover={{ transform: 'scale(1.05)' }}
                            transition="all 0.2s"
                          >
                            {t('copy_setlist')}
                          </Button>
                        </Flex>
                      )}

                      {set.music.length > 0 ? (
                        <VStack spacing={4} align="stretch" mb={8}>
                          {set.music.map((song: Song, songIndex: number) => (
                            <Box
                              key={songIndex}
                              py={3}
                              px={5}
                              bg="white"
                              borderRadius="xl"
                              boxShadow="0 4px 6px rgba(0,0,0,0.05)"
                              border="1px solid"
                              borderColor="purple.100"
                              _hover={{
                                bg: 'purple.50',
                                borderColor: 'purple.300',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                              }}
                              transition="all 0.3s"
                              onClick={() =>
                                window.open(song.music.youtube_url, '_blank')
                              }
                              cursor="pointer"
                              display="flex"
                              alignItems="center"
                              width="100%"
                            >
                              <Text
                                fontSize={tabFontSize}
                                fontWeight="bold"
                                color="purple.600"
                                mr={4}
                                flexShrink={0}
                              >
                                {songIndex + 1}.
                              </Text>
                              <Text
                                fontSize={tabFontSize}
                                fontWeight="medium"
                                color="gray.800"
                                noOfLines={2}
                                lineHeight="short"
                              >
                                {song.music.name}
                              </Text>
                            </Box>
                          ))}
                        </VStack>
                      ) : (
                        <Flex
                          w="100%"
                          justifyContent="center"
                          alignItems="center"
                          p={6}
                          bg="gray.50"
                          borderRadius="lg"
                          border="1px dashed"
                          borderColor="gray.200"
                        >
                          <Text
                            fontSize={tabFontSize}
                            color="gray.500"
                          >
                            {t('no_setlist_available')}
                          </Text>
                        </Flex>
                      )}

                      {/* OOTD Section - Display OOTD images for the selected tab's date */}
                      <Box mt={8}>
                        <HStack mb={4}>
                          <Icon as={CameraIcon} color="pink.500" boxSize={6} />
                          <Text
                            fontSize={{ base: 'lg', md: 'xl' }}
                            fontWeight="bold"
                            color="gray.800"
                            bgGradient="linear(to-r, pink.500, purple.500)"
                            bgClip="text"
                          >
                            {t('costume')}
                          </Text>
                        </HStack>
                        {getOOTDForDate(set.date).length > 0 ? (
                          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                            {getOOTDForDate(set.date).map((ootd: OOTD, ootdIndex: number) => (
                              <Box
                                key={ootdIndex}
                                position="relative"
                                overflow="hidden"
                                borderRadius="lg"
                                transition="all 0.3s"
                              >
                                <Image
                                  src={ootd.image}
                                  alt={`Outfit for ${ootd.date}`}
                                  borderRadius="lg"
                                  boxShadow="md"
                                  w="100%"
                                />
                              </Box>
                            ))}
                          </SimpleGrid>
                        ) : (
                          <Flex
                            w="100%"
                            justifyContent="center"
                            alignItems="center"
                            p={6}
                            bg="gray.50"
                            borderRadius="lg"
                            border="1px dashed"
                            borderColor="gray.200"
                          >
                            <Text
                              fontSize={tabFontSize}
                              color="gray.500"
                            >
                              {t('no_ootd_available')}
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