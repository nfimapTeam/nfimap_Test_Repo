import { Box, Button, ButtonGroup, useBreakpointValue, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import YouTubePlayer from "./Components/Youtube";
import Music from "./Components/Music";


const Content = () => {
  const { t, i18n } = useTranslation();
  const isMobileOrTablet = useBreakpointValue({ base: true, md: true, lg: false });
  const [category, setCategory] = useState<'video' | 'npart' | 'music'>('video');


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
      <Box maxWidth="1200px" margin="auto" pb={10}>
        <Flex justifyContent="center" mt={10}>
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
            <Button
              isActive={category === 'music'}
              onClick={() => setCategory('music')}
            >
              {t('music')}
            </Button>
          </ButtonGroup>
        </Flex>
        {category === 'music' && (
          <Music />
        )}
        {(category === 'video' || category === 'npart') && (
          <YouTubePlayer category={category} setCategory={setCategory} />)}
      </Box>
    </Box>
  );
};

export default Content;
