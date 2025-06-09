import {
  Box,
  VStack,
  Flex,
  Text,
  Image,
  IconButton,
  Grid,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  chakra,
  useDisclosure,
  Skeleton,
} from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { youtubeData } from "../Data/youtubeData";
import { npart } from "../Data/npart";
import { RepeatIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon, AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

// Interfaces for videos and images
interface Video {
  videoId: string;
  title: string;
  thumbnail: string;
  url: string;
  publishedAt: string;
}

interface ImageItem {
  imageId: string;
  imageUrl: string;
  alt: string;
}

interface YouTubePlayerProps {
  category: "video" | "npart" | "music";
  mediaType: "videos" | "images";
  scrollToTop: () => void;
}

const MotionBox = chakra(motion.div);

const YouTubePlayer = ({ category, mediaType, scrollToTop }: YouTubePlayerProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const transformWrapperRef = useRef<ReactZoomPanPinchRef>(null); // Proper typing for TransformWrapper

  const imageFileNames: { [key: string]: string }[] = [
    { "Everlasting.jpeg": "만년설(Everlasting)" },
    { "RunLikeThis.jpeg": "Run Like This" },
    { "BornToBe.jpeg": "Born To Be" },
    { "Moebius.jpeg": "뫼비우스(Moebius)" },
    { "LoveYouLikeThat.jpeg": "Love You Like That" },
    { "RiseAgain.jpeg": "사랑을 마주하고(Rise Again)" },
    { "Flowerwork.jpeg": "불놀이(Flowerwork)" },
    { "4242.jpeg": "4242" },
    { "Anyway.jpeg": "ANYWAY" },
    { "E-YO.jpeg": "에요(E-YO)" },
    { "SunSet.jpeg": "Sunset" },
    { "Good-Bam.jpeg": "굿밤(GOOD BAM)" },
    { "i'm-gonna.jpeg": "아무거나(I'M GONNA)" },
    { "ILikeYou.jpeg": "폭망(I Like You)" },
    { "IntoYou.jpeg": "네가 내 마음에 자리 잡았다(Into You)" },
    { "MoonShot.jpeg": "Moonshot" },
    { "oh-really.jpeg": "아 진짜요.(Oh really.)" },
    { "Pardon.jpeg": "ㅈㅅ(Pardon?)" },
    { "Preview.jpeg": "Preview" },
    { "UP-ALL-NIGHT.jpeg": "UP ALL NIGHT" },
  ];

  // Generate ImageItem array from imageFileNames
  const generateNpartImages = (): ImageItem[] => {
    return imageFileNames.map((item) => {
      const filename = Object.keys(item)[0];
      const displayName = item[filename];
      return {
        imageId: filename.split(".")[0],
        imageUrl: `/image/npart/${filename}`,
        alt: displayName,
      };
    });
  };

  // Shuffle youtubeData videos
  const shuffleVideos = () => {
    const ITEMS_LIMIT = isMobile ? 8 : 12;
    const shuffled = youtubeData
      .map((video) => ({
        ...video,
        thumbnail: video.thumbnail.replace("default.jpg", "hqdefault.jpg"),
      }))
      .sort(() => Math.random() - 0.5)
      .slice(0, ITEMS_LIMIT);
    setVideos(shuffled);
    scrollToTop();
  };

  // Load npart videos and images
  const loadNpartMedia = () => {
    const npartVideos: Video[] = npart.map((video) => ({
      ...video,
      thumbnail: video.thumbnail.replace("default.jpg", "hqdefault.jpg"),
    }));
    const npartImages: ImageItem[] = generateNpartImages();
    setVideos(npartVideos);
    setImages(npartImages);
    scrollToTop();
  };

  useEffect(() => {
    if (category === "video") {
      shuffleVideos();
    } else if (category === "npart") {
      loadNpartMedia();
    }
    setZoomLevel(1);
  }, [category, isMobile]);

  const openVideo = (video: Video) => {
    setCurrentVideo(video);
    setCurrentImageIndex(null);
    setZoomLevel(1);
    onOpen();
  };

  const openImage = (index: number) => {
    setCurrentImageIndex(index);
    setCurrentVideo(null);
    setZoomLevel(1);
    onOpen();
  };

  const goToPreviousImage = () => {
    if (currentImageIndex !== null) {
      setCurrentImageIndex((prev: any) => (prev === 0 ? images.length - 1 : prev - 1));
      setZoomLevel(1);
      transformWrapperRef.current?.resetTransform();
    }
  };

  const goToNextImage = () => {
    if (currentImageIndex !== null) {
      setCurrentImageIndex((prev: any) => (prev === images.length - 1 ? 0 : prev + 1));
      setZoomLevel(1);
      transformWrapperRef.current?.resetTransform();
    }
  };

  const handleZoomIn = () => {
    transformWrapperRef.current?.zoomIn(0.5);
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    transformWrapperRef.current?.zoomOut(0.5);
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  };

  const handleDoubleTap = () => {
    if (transformWrapperRef.current) {
      const newZoom = zoomLevel === 1 ? 2 : 1;
      transformWrapperRef.current.setTransform(0, 0, newZoom);
      setZoomLevel(newZoom);
    }
  };

  return (
    <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <VStack spacing={6} mx="auto" maxW="100%">
        <Grid templateColumns={isMobile ? "1fr" : "repeat(3, 1fr)"} gap={4} w="100%">
          {mediaType === "videos" &&
            category !== "music" &&
            videos.map((video, index) => (
              <MotionBox
                key={video.videoId}
                bg="white"
                boxShadow="md"
                borderWidth="1px"
                borderColor="purple.200"
                borderRadius="lg"
                overflow="hidden"
                cursor="pointer"
                mt={category === "video" ? "64px" : 0}
                whileHover={{ scale: 1.05, boxShadow: "xl" }}
                onClick={() => openVideo(video)}
              >
                <Skeleton isLoaded={!!video.thumbnail} height="300px">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    w="100%"
                    h="300px"
                    objectFit="cover"
                    loading={index < 3 ? "eager" : "lazy"}
                    fallback={<Box bg="gray.200" w="100%" h="300px" />}
                  />
                </Skeleton>
                <Box p={4}>
                  <Text fontWeight="bold" noOfLines={2}>
                    {video.title}
                  </Text>
                  <Text fontSize="sm" color="gray.500" noOfLines={1}>
                    {video.url}
                  </Text>
                </Box>
              </MotionBox>
            ))}

          {mediaType === "images" &&
            category === "npart" &&
            images.map((image, index) => (
              <MotionBox
                key={image.imageId}
                bg="white"
                boxShadow="md"
                borderWidth="1px"
                borderColor="purple.200"
                borderRadius="lg"
                overflow="hidden"
                cursor="pointer"
                whileHover={{ scale: 1.05, boxShadow: "xl" }}
                onClick={() => openImage(index)}
              >
                <Skeleton isLoaded={!!image.imageUrl} height="300px">
                  <Image
                    src={image.imageUrl}
                    alt={image.alt}
                    w="100%"
                    h="300px"
                    objectFit="cover"
                    loading={index < 3 ? "eager" : "lazy"}
                    fallback={<Box bg="gray.200" w="100%" h="300px" />}
                  />
                </Skeleton>
                <Box p={4}>
                  <Text fontWeight="bold" noOfLines={2}>
                    {image.alt}
                  </Text>
                </Box>
              </MotionBox>
            ))}
        </Grid>

        {category === "video" && (
          <IconButton
            aria-label="Refresh list"
            icon={<RepeatIcon />}
            colorScheme="purple"
            size="lg"
            borderRadius="full"
            onClick={shuffleVideos}
            _hover={{ transform: "scale(1.1)" }}
            transition="all 0.3s ease"
          />
        )}

        <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
          <ModalOverlay bg="blackAlpha.800" />
          <ModalContent bg="transparent" maxW="90vw" maxH="90vh" m="auto">
            <IconButton
              icon={<CloseIcon />}
              aria-label="Close"
              position="absolute"
              top="10px"
              right="10px"
              size="sm"
              borderRadius="full"
              onClick={onClose}
              zIndex={10}
              bg="blackAlpha.600"
              color="white"
              _hover={{ bg: "blackAlpha.800" }}
            />
            <ModalBody p={0} display="flex" alignItems="center" justifyContent="center">
              {currentVideo && (
                <Box w="100%" maxW="1200px" aspectRatio={16 / 9}>
                  <iframe
                    src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1`}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={currentVideo.title}
                    style={{ width: "100%", height: "100%" }}
                  />
                </Box>
              )}
              {currentImageIndex !== null && (
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  position="relative"
                  w="100%"
                  h="100%"
                  maxH="90vh"
                >
                  <IconButton
                    icon={<ChevronLeftIcon />}
                    aria-label="Previous Image"
                    position="absolute"
                    left="10px"
                    top="50%"
                    transform="translateY(-50%)"
                    size="lg"
                    borderRadius="full"
                    onClick={goToPreviousImage}
                    zIndex={10}
                    bg="blackAlpha.600"
                    color="white"
                    _hover={{ bg: "blackAlpha.800" }}
                  />
                  <IconButton
                    icon={<AddIcon />}
                    aria-label="Zoom In"
                    position="absolute"
                    bottom="20px"
                    right="60px"
                    size="sm"
                    borderRadius="full"
                    onClick={handleZoomIn}
                    zIndex={10}
                    bg="blackAlpha.600"
                    color="white"
                    _hover={{ bg: "blackAlpha.800" }}
                    isDisabled={zoomLevel >= 3}
                  />
                  <IconButton
                    icon={<MinusIcon />}
                    aria-label="Zoom Out"
                    position="absolute"
                    bottom="20px"
                    right="20px"
                    size="sm"
                    borderRadius="full"
                    onClick={handleZoomOut}
                    zIndex={10}
                    bg="blackAlpha.600"
                    color="white"
                    _hover={{ bg: "blackAlpha.800" }}
                    isDisabled={zoomLevel <= 1}
                  />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TransformWrapper
                        ref={transformWrapperRef}
                        initialScale={1}
                        minScale={1}
                        maxScale={3}
                        doubleClick={{ mode: "toggle", step: 2 }}
                        wheel={{ disabled: false, step: 0.1 }}
                        pinch={{ step: 10, disabled: false }}
                        smooth={true}
                        velocityAnimation={{ sensitivity: 1, animationTime: 400 }}
                        centerOnInit={true}
                        centerZoomedOut={true}
                        panning={{ disabled: zoomLevel === 1 }}
                        onZoom={(ref) => setZoomLevel(ref.state.scale)}
                      >
                        <TransformComponent
                          wrapperStyle={{
                            width: "100%",
                            height: "80vh",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          contentStyle={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <Image
                            src={images[currentImageIndex].imageUrl}
                            alt={images[currentImageIndex].alt}
                            maxH="80vh"
                            maxW="90vw"
                            objectFit="contain"
                            mx="auto"
                            display="block"
                          />
                        </TransformComponent>
                      </TransformWrapper>
                    </motion.div>
                  </AnimatePresence>
                  <IconButton
                    icon={<ChevronRightIcon />}
                    aria-label="Next Image"
                    position="absolute"
                    right="10px"
                    top="50%"
                    transform="translateY(-50%)"
                    size="lg"
                    borderRadius="full"
                    onClick={goToNextImage}
                    zIndex={10}
                    bg="blackAlpha.600"
                    color="white"
                    _hover={{ bg: "blackAlpha.800" }}
                  />
                </Flex>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </MotionBox>
  );
};

export default YouTubePlayer;