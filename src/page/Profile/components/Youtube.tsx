import {
  Box,
  VStack,
  Flex,
  Text,
  Image,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { youtubeData } from '../youtubeData';
import { RepeatIcon, CloseIcon } from '@chakra-ui/icons';

interface Video {
  videoId: string;
  title: string;
  thumbnail: string;
  url: string;
}

interface YouTubePlayerProps {
  isMobile: boolean | undefined;
}


const YouTubePlayer = ({ isMobile }: YouTubePlayerProps) => {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const ITEMS_LIMIT = isMobile ? 6 : 9; // 🔥 추가: 최대 보여줄 영상 수

  const shuffleVideos = () => {
    const shuffled = youtubeData
      .map(video => ({
        ...video,
        thumbnail: video.thumbnail.replace('default.jpg', 'hqdefault.jpg'),
      }))
      .sort(() => Math.random() - 0.5)
      .slice(0, ITEMS_LIMIT); // 🔥 셔플 후 12개만 선택
    setVideos(shuffled);
  };

  useEffect(() => {
    shuffleVideos();
  }, []);

  const openVideo = (video: Video) => {
    setCurrentVideo(video);
    onOpen();
  };

  return (
    <Box minH="100vh" py={8} px={2} mt={10}>
      <VStack spacing={6} mx="auto">

        {/* 비디오 목록 */}
        <Flex wrap="wrap" justify="space-between" gap={4}>
          {videos.map((video) => (
            <Box
              key={video.videoId}
              bg="white"
              boxShadow="md"
              borderRadius="lg"
              overflow="hidden"
              cursor="pointer"
              w={["100%", "45%", "30%"]}
              transition="all 0.2s"
              _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
              onClick={() => openVideo(video)}
            >
              <Image src={video.thumbnail} alt={video.title} w="100%" />
              <Box p={3}>
                <Text fontWeight="bold" noOfLines={2}>{video.title}</Text>
                <Text fontSize="sm" color="gray.500" noOfLines={1}>{video.url}</Text>
              </Box>
            </Box>
          ))}
        </Flex>

        {/* 새로고침 버튼 */}
        <IconButton
          aria-label="목록 새로고침"
          icon={<RepeatIcon />}
          colorScheme="purple"
          size="lg"
          borderRadius="full"
          onClick={shuffleVideos}
        />
        {/* 모달 */}
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
          <ModalOverlay />
          <ModalContent bg="black" p={0} position="relative">
            <IconButton
              icon={<CloseIcon />}
              aria-label="닫기"
              position="absolute"
              top="10px"
              right="10px"
              size="sm"
              borderRadius="full"
              onClick={onClose}
              zIndex={1}
            />
            <ModalBody p={0}>
              {currentVideo && (
                <Box w="100%" aspectRatio={16 / 9}>
                  <iframe
                    src={`https://www.youtube.com/embed/${currentVideo.videoId}`}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={currentVideo.title}
                    style={{ width: '100%', height: '100%' }}
                  />
                </Box>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default YouTubePlayer;
