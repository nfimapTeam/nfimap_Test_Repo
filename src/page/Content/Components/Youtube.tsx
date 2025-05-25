import {
  Box,
  VStack,
  Flex,
  Text,
  Image,
  IconButton,
  Button,
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  useBreakpointValue,
  Grid,
} from '@chakra-ui/react';
import React, { useEffect, useState, useRef } from 'react';
import { youtubeData } from '../Data/youtubeData';
import { npart } from '../Data/npart';
import { RepeatIcon, CloseIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

interface Video {
  videoId: string;
  title: string;
  thumbnail: string;
  url: string;
}

const YouTubePlayer = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [category, setCategory] = useState<'video' | 'npart'>('video');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();

  const shuffleVideos = () => {
    const ITEMS_LIMIT = isMobile ? 8 : 12;
    const shuffled = youtubeData
      .map(video => ({
        ...video,
        thumbnail: video.thumbnail.replace('default.jpg', 'hqdefault.jpg'),
      }))
      .sort(() => Math.random() - 0.5)
      .slice(0, ITEMS_LIMIT);
    setVideos(shuffled);
    scrollToTop();
  };

  const loadNpartVideos = () => {
    const allNpart = npart.map(video => ({
      ...video,
      thumbnail: video.thumbnail.replace('default.jpg', 'hqdefault.jpg'),
    }));
    setVideos(allNpart);
    scrollToTop();
  };

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (category === 'video') {
      shuffleVideos();
    } else {
      loadNpartVideos();
    }
  }, [isMobile, category]);

  const openVideo = (video: Video) => {
    setCurrentVideo(video);
    onOpen();
  };

  return (
    <Box ref={containerRef} minH="100vh" py={8} px={2} mt={10}>
      <VStack spacing={6} mx="auto">
        {/* 카테고리 선택 버튼 */}
        <ButtonGroup isAttached variant="outline" colorScheme="purple">
          <Button
            isActive={category === 'video'}
            onClick={() => setCategory('video')}
          >
            {t('content')}
          </Button>
          <Button
            isActive={category === 'npart'}
            onClick={() => setCategory('npart')}
          >
            {t('npart')}
          </Button>
        </ButtonGroup>

        {/* 비디오 목록 */}
        <Grid
          templateColumns={isMobile ? '1fr' : 'repeat(3, 1fr)'}
          gap={4}
          w="100%"
        >
          {videos.map((video) => (
            <Box
              key={video.videoId}
              bg="white"
              boxShadow="md"
              borderRadius="lg"
              overflow="hidden"
              cursor="pointer"
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
        </Grid>

        {/* 새로고침 버튼 (영상 모드일 때만) */}
        {category === 'video' && (
          <IconButton
            aria-label="목록 새로고침"
            icon={<RepeatIcon />}
            colorScheme="purple"
            size="lg"
            borderRadius="full"
            onClick={shuffleVideos}
          />
        )}

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
