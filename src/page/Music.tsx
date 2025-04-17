import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Input,
  VStack,
  Image,
  Text,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Center,
  Flex,
  useBreakpointValue,
  Link,
} from "@chakra-ui/react";
import Loading from "../components/Loading";
import { musicData } from "../datas/music";
import SlotMachine from "../components/SlotMachine";
import { Helmet } from "react-helmet-async";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";

interface Image {
  url: string;
}

interface Album {
  id: string;
  name: string;
  release_date: string;
  images: Image[];
  tracks: {
    href: string;
  };
  href: string;
}

interface Track {
  id: string;
  name: string;
  preview_url: string | null;
}

interface SpotifyTokenResponse {
  access_token: string;
}

interface SpotifySearchResponse {
  artists: {
    items: Array<{ id: string }>;
  };
}

interface SpotifyAlbumsResponse {
  items: Album[];
  next: string | null;
}

interface SpotifyTracksResponse {
  items: Track[];
}

interface MusicType {
  name: string;
  youtubeUrl: string;
}

const Music = () => {
  const { t, i18n } = useTranslation();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [token, setToken] = useState<string>("");
  const [artistId, setArtistId] = useState<string>("");
  const [limit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(""); // New state for search query
  const { isOpen, onOpen, onClose } = useDisclosure();
  const musicNames = musicData.map((music: MusicType) => music.name);
  const youtubeUrl = musicData.map((music: MusicType) => music.youtubeUrl);
  const columnCount = useBreakpointValue({ base: 1, md: 2, lg: 3, xl: 4 });
  const isMobileOrTablet = useBreakpointValue({ base: true, md: true, lg: false });

  const getToken = useCallback(async () => {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID_API_KEY;
    const clientSecret = process.env.REACT_APP_SPOTIFY_SECRET_ID_API_KEY;
    try {
      const result = await axios.post<SpotifyTokenResponse>(
        "https://accounts.spotify.com/api/token",
        "grant_type=client_credentials",
        {
          headers: {
            Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      setToken(result.data.access_token);
    } catch (error) {
      console.error("Failed to get token:", error);
    }
  }, []);

  useEffect(() => {
    getToken();
  }, [getToken]);

  const searchArtist = useCallback(async () => {
    if (token) {
      try {
        const result = await axios.get<SpotifySearchResponse>(
          `https://api.spotify.com/v1/search?q=N.Flying&type=artist`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        if (result.data.artists.items.length > 0) {
          setArtistId(result.data.artists.items[0].id);
          setOffset(0);
          setAlbums([]);
          setHasMore(true);
        }
      } catch (error) {
        console.error("Failed to search artist:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    searchArtist();
  }, [searchArtist]);

  const getAlbums = useCallback(async () => {
    if (artistId && !loading && hasMore) {
      setLoading(true);
      try {
        const result = await axios.get<SpotifyAlbumsResponse>(
          `https://api.spotify.com/v1/artists/${artistId}/albums?limit=${limit}&offset=${offset}`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        setAlbums((prevAlbums) => {
          const newAlbums = [...prevAlbums, ...result.data.items];
          const uniqueAlbums = Array.from(
            new Map(newAlbums.map((album) => [album.id, album])).values()
          );
          return uniqueAlbums;
        });
        setHasMore(result.data.next !== null);
        setOffset((prevOffset) => prevOffset + limit);
      } catch (error) {
        console.error("Failed to fetch albums:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [token, artistId, limit, offset, loading, hasMore]);

  useEffect(() => {
    if (artistId) {
      getAlbums();
    }
  }, [artistId, getAlbums]);

  const handleAlbumClick = async (album: Album) => {
    if (!album.href) {
      console.error("No tracks URL available for the selected album");
      return;
    }

    setSelectedAlbum(album);
    onOpen(); // Open modal before fetching tracks

    try {
      const result = await axios.get<Album>(album.href, {
        headers: { Authorization: "Bearer " + token },
      });

      if (!result.data.tracks || !result.data.tracks.href) {
        console.error("No tracks URL available for the selected album");
        return;
      }
      const tracksResult = await axios.get<SpotifyTracksResponse>(
        result.data.tracks.href,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      setTracks(tracksResult.data.items);
    } catch (error) {
      console.error("Failed to fetch tracks:", error);
    }
  };

  const handleLoadMore = () => {
    getAlbums();
  };

  // Filter albums based on the search query
  const filteredAlbums = albums.filter((album) =>
    album.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <title>{t("music_page_title")}</title> {/* 다국어 제목 */}
        <meta
          name="description"
          content="N.Fimap은 팬덤 N.Fia의 덕질을 응원합니다."
        />
        <meta
          property="og:description"
          content="N.Fimap의 예제 페이지입니다."
        />
        <meta property="og:image" content="%PUBLIC_URL%/image/logo/logo.svg" />
        <meta property="og:url" content="https://nfimap.co.kr" />
      </Helmet>
      <Box p="20px">
        <Flex
          alignItems="center"
          gap="5px"
          zIndex="10"
          justifyContent="flex-end"
          flexGrow={1}
          overflow="hidden"
        >
          <SlotMachine textData={musicNames} youtubeUrl={youtubeUrl} />
        </Flex>
      </Box>
      <VStack spacing={4}>
        <Input
          placeholder={t("music_search_placeholder")} // 다국어 검색 안내
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          focusBorderColor="#4BA4F2"
          bg="whiteAlpha.900"
          _hover={{ borderColor: "#79AEF2" }}
          _placeholder={{ color: "gray.400" }}
          size="lg"
          borderRadius="md"
          boxShadow="md"
          m="20px 0"
        />

        <Grid templateColumns={`repeat(${columnCount}, 1fr)`} gap={6}>
          {filteredAlbums.map((album) => (
            <Box
              key={album.id}
              onClick={() => handleAlbumClick(album)}
              cursor="pointer"
              p={4}
              borderWidth={1}
              borderRadius="md"
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
            >
              <Image src={album.images[0]?.url} alt={album.name} />
              <Text mt={2} fontSize="sm" fontWeight="bold">
                {album.name}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {album.release_date}
              </Text>
            </Box>
          ))}
        </Grid>
        {loading && <Loading />}
        {hasMore && !loading && (
          <Center mt={4}>
            <Button onClick={handleLoadMore}>{t("music_load_more")}</Button>{" "}
            {/* 다국어 더 불러오기 */}
          </Center>
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedAlbum?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={4}>
            {tracks.length === 0 ? (
              <Text textAlign="center" color="gray.500">
                {t("music_no_tracks")} {/* 다국어 트랙 없음 */}
              </Text>
            ) : (
              <VStack spacing={4} align="start">
                {tracks.map((track) => (
                  <Box
                    key={track.id}
                    p={3}
                    borderWidth={1}
                    borderRadius="md"
                    boxShadow="sm"
                    bg="gray.50"
                    w="100%"
                  >
                    <Flex align="center" justify="space-between">
                      <Text fontWeight="bold" fontSize="md">
                        {track.name}
                      </Text>
                      {track.preview_url && (
                        <audio
                          controls
                          controlsList="nodownload"
                          src={track.preview_url}
                        >
                          {t("music_audio_support")}{" "}
                          {/* 다국어 오디오 지원 관련 */}
                        </audio>
                      )}
                    </Flex>
                  </Box>
                ))}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      </Box>
    </Box>
  );
};

export default Music;
