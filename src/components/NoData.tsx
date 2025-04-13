import React from "react";
import { Box, Image, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const NoData = () => {
  const { t } = useTranslation();
  return (
    <VStack
      spacing={4}
      align="center"
      justify="center"
      minHeight="calc(100svh - 120px)"
      height="100%"
      position="relative"
    >
      <Box width="200px" height="200px">
        <Image
          src="/image/logo/logo.svg"
          alt="No Data"
          width="100%"
          height="100%"
          opacity={0.3}
          objectFit="contain"
        />
      </Box>
      <Text fontSize="lg" fontWeight="medium" color="gray.500">
        {t("mapNoData")}
      </Text>
    </VStack>
  );
};

export default NoData;