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
  BoxProps,
  IconProps,
  TextProps,
  ButtonProps,
  useToast,
} from '@chakra-ui/react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

// Interfaces remain the same
interface Music {
  name: string;
  youtube_url: string;
}

interface Song {
  music: Music;
}

interface Setlist {
  date: string;
  music: Song[];
}

interface AugmentedConcertDetail {
  setlist: Setlist[];
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
    // Format the setlist as plain text
    const setlistText = set.music
      .map((song: Song, index: number) => `${index + 1}. ${song.music.name}`)
      .join('\n');

    // Use concert name as title, followed by translated "Setlist" and date
    const fullText = `${augmentedConcertDetail.name}\n${moment(set.date, 'YYYY-MM-DD').format('YYYY/MM/DD')} ${t('setlist')}\n\n${setlistText}`;

    // Copy to clipboard
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

  return (
    <>
      {augmentedConcertDetail.setlist &&
        augmentedConcertDetail.setlist.length > 0 && (
          <Box
            bg={cardBgColor}
            p={{ base: 4, md: 6 }}
            borderRadius="lg"
            boxShadow="lg"
            width="100%"
            as="section"
            {...({} as BoxProps)}
          >
            <HStack mb={4} justify="space-between" align="center">
              <HStack>
                <Icon
                  color="purple.500"
                  boxSize={{ base: 5, md: 6 }}
                  {...({} as IconProps)}
                />
                <Text
                  fontSize={{ base: 'lg', md: 'xl' }}
                  fontWeight="bold"
                  color="gray.800"
                  {...({} as TextProps)}
                >
                  {t('setlist')}
                </Text>
              </HStack>
            </HStack>

            <Tabs variant="soft-rounded" colorScheme="purple" size="sm">
              <TabList
                overflowX="auto"
                whiteSpace="nowrap"
                mb={4}
                display="flex"
                flexWrap={isDoubleLine ? 'wrap' : 'nowrap'}
                gap={2}
                css={{
                  '&::-webkit-scrollbar': { height: '4px' },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(160, 174, 192, 0.4)',
                    borderRadius: '4px',
                  },
                }}
              >
                {augmentedConcertDetail.setlist.map(
                  (set: Setlist, index: number) => (
                    <Tab
                      key={index}
                      fontSize={tabFontSize}
                      px={{ base: 2, md: 3 }}
                      py={1}
                      minW="auto"
                      bg="purple.100"
                      _selected={{ bg: 'purple.500', color: 'white' }}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      mb={isDoubleLine ? 2 : 0}
                    >
                      {moment(set.date, 'YYYY-MM-DD').format('MM/DD')}
                    </Tab>
                  )
                )}
              </TabList>

              <TabPanels pt={1}>
                {augmentedConcertDetail.setlist.map(
                  (set: Setlist, index: number) => (
                    <TabPanel key={index} p={0}>
                      {/* Conditionally render the Copy Setlist button only if setlist has songs */}
                      {set.music.length > 0 && (
                        <Flex w="100%" h="40px" justifyContent="flex-end" mb={4}>
                          <Button
                            size="sm"
                            colorScheme="purple"
                            borderRadius="full"
                            px={6}
                            onClick={() => handleCopySetlist(set)}
                            {...({} as ButtonProps)}
                          >
                            {t('copy_setlist')}
                          </Button>
                        </Flex>
                      )}

                      {set.music.length > 0 ? (
                        <VStack spacing={3} align="stretch">
                          {set.music.map((song: Song, songIndex: number) => (
                            <Box
                              key={songIndex}
                              py={2}
                              px={4}
                              bg="white"
                              borderRadius="full"
                              boxShadow="0 2px 4px rgba(0,0,0,0.05)"
                              border="1px solid"
                              borderColor="purple.100"
                              _hover={{
                                bg: 'purple.50',
                                borderColor: 'purple.300',
                                transform: 'translateY(-1px)',
                              }}
                              transition="all 0.2s"
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
                                color="purple.500"
                                mr={3}
                                flexShrink={0}
                                {...({} as TextProps)}
                              >
                                {songIndex + 1}.
                              </Text>
                              <Text
                                fontSize={tabFontSize}
                                fontWeight="medium"
                                color="gray.700"
                                noOfLines={2}
                                lineHeight="short"
                                {...({} as TextProps)}
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
                          p={4}
                        >
                          <Text
                            fontSize={tabFontSize}
                            color="gray.500"
                            {...({} as TextProps)}
                          >
                            {t('no_setlist_available')}
                          </Text>
                        </Flex>
                      )}
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