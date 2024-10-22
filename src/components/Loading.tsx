import { Box, Flex, Image, keyframes, Text, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Loading = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { t, i18n } = useTranslation();

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      height="100vh"
      direction="column"
    >
      <Image
        src="/image/logo/logo.svg"
        alt="MyApp Logo"
        boxSize="150px"
        animation={`${rotate} 2s infinite linear`} 
        mb={4}
      />
      <Text fontSize={isMobile ? "4xl" : "6xl"} fontWeight="bold">
        {t("loading")}
      </Text>
    </Flex>
  );
};

export default Loading;
