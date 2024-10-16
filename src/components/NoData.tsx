import React from "react";
import { Box, Image, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const NoData = () => {
  const { t } = useTranslation();
  return (
    <VStack spacing={4} align="center" justify="center" height="100%">
      <Box position="relative" width="200px" height="200px">
        <Image
          src="/image/nfimap.png"
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
