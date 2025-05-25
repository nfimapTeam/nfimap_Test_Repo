import { Box, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import YouTubePlayer from "./Components/Youtube";


const Content = () => {
  const { t, i18n } = useTranslation();
  const isMobileOrTablet = useBreakpointValue({ base: true, md: true, lg: false });

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
        <YouTubePlayer />
      </Box>
    </Box>
  );
};

export default Content;
