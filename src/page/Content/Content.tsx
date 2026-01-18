import { Box, Button, ButtonGroup, useBreakpointValue, Flex, IconButton, chakra } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import YouTubePlayer from "./Components/Youtube";
import Music from "./Components/Music";
import { ImageIcon, TriangleRightIcon, VideoIcon } from "lucide-react";

const MotionBox = chakra(motion.div)

const Content = () => {
  const { t } = useTranslation();
  const isMobileOrTablet = useBreakpointValue({ base: true, md: true, lg: false });
  const [category, setCategory] = useState<'video' | 'npart' | 'music'>('video');
  const [mediaType, setMediaType] = useState<'videos' | 'images'>('videos');
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <MotionBox
      ref={containerRef}
      h={isMobileOrTablet ? "calc(100svh - 120px)" : "calc(100svh - 70px)"}
      width="100%"
      mx="auto"
      p={{ base: "12px", md: "16px", lg: "20px 24px 120px" }}
      overflowY="auto"
      boxShadow="lg"
      borderRadius="xl"
      css={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Box maxWidth="1200px" margin="auto" pb={12}>
        <Flex justifyContent="center" my={4}>
          <ButtonGroup isAttached spacing={0}>
            {/* {["video", "npart", "music"].map((cat) => ( */}
            {["video", "npart"].map((cat) => (
              <Button
                key={cat}
                onClick={() => {
                  // setCategory(cat as "video" | "npart" | "music");
                  setCategory(cat as "video" | "npart");
                  if (cat !== "npart") setMediaType("videos"); // Reset mediaType for non-npart
                }}
                bg={category === cat ? "purple.400" : "white"}
                color={category === cat ? "white" : "purple.700"}
                px={{ base: 4, md: 6 }}
                py={{ base: 2, md: 3 }}
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="bold"
                _hover={{
                  bg: category === cat ? "purple.400" : "purple.200",
                }}
                transition="all 0.3s ease"
                boxShadow={category === cat ? "0 4px 12px rgba(128, 90, 213, 0.3)" : "none"}
              >
                {t(cat === "video" ? "content" : cat)}
              </Button>
            ))}
          </ButtonGroup>
        </Flex>
        {category === "npart" && (
          <MotionBox
            display="flex"
            justifyContent="center"
            initial={{ opacity: 0, y: -1 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -1 }}
          >
            <IconButton
              aria-label="Videos"
              icon={<VideoIcon size={20} />}
              bg={mediaType === "videos" ? "purple.500" : "gray.100"}
              color={mediaType === "videos" ? "white" : "purple.700"}
              borderRadius="full"
              size="lg"
              mr={4}
              mb={4}
              _hover={{
                bg: mediaType === "videos" ? "purple.600" : "gray.200",
                transform: "scale(1.1)",
              }}
              transition="all 0.3s ease"
              boxShadow={mediaType === "videos" ? "0 4px 12px rgba(128, 90, 213, 0.3)" : "none"}
              onClick={() => setMediaType("videos")}
            />
            <IconButton
              aria-label="Images"
              icon={<ImageIcon size={20} />}
              bg={mediaType === "images" ? "purple.500" : "gray.100"}
              color={mediaType === "images" ? "white" : "purple.700"}
              borderRadius="full"
              size="lg"
              _hover={{
                bg: mediaType === "images" ? "purple.600" : "gray.200",
                transform: "scale(1.1)",
              }}
              transition="all 0.3s ease"
              boxShadow={mediaType === "images" ? "0 4px 12px rgba(128, 90, 213, 0.3)" : "none"}
              onClick={() => setMediaType("images")}
            />
          </MotionBox>
        )}
        {category === "music" && <Music />}
        {(category === "video" || category === "npart") && (
          <YouTubePlayer
            category={category}
            mediaType={mediaType}
            scrollToTop={scrollToTop}
          />
        )}
      </Box>
    </MotionBox>
  );
};

export default Content;