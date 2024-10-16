import React, { useState } from "react";
import { Box, Input, Flex, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

type Nfiload = {
  id: number;
  name: string;
  location: string;
  category: string;
  lat: string;
  lng: string;
  naverLink: string;
  note: string;
};

interface NfiLoadProps {
  nfiload: Nfiload[];
  setSelectedNfiLoad: (nfiload: Nfiload) => void;
  selectedNfiLoad: Nfiload | null;
}

const NfiLoad = ({
  nfiload,
  setSelectedNfiLoad,
  selectedNfiLoad,
}: NfiLoadProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  const filteredNfiload = nfiload.filter(
    (data) =>
      data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNfiLoadClick = (data: Nfiload) => {
    setSelectedNfiLoad(data);
  };

  return (
    <VStack spacing={4} align="start" height="100%">
      <Input
        placeholder={t("mapSearchPlaceholder")}
        size="md"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Box
        flex="1"
        w="100%"
        overflow="auto"
        css={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        {filteredNfiload.map((data) => (
          <Flex
            key={data.id}
            onClick={() => handleNfiLoadClick(data)}
            cursor="pointer"
            p="10px"
            border="1px solid #eee"
            margin="10px 0"
            borderRadius="4px"
            w="100%"
            _hover={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
            position="relative"
            bg={selectedNfiLoad?.id === data.id ? "blue.50" : "white"}
          >
            <Box flexGrow={1}>
              <Text fontSize="16px" fontWeight="bold" mb="5px">
                {data.name}
              </Text>
              <Text fontSize="14px" color="#666">
                {data.location}
              </Text>
            </Box>
          </Flex>
        ))}
      </Box>
    </VStack>
  );
};

export default NfiLoad;
