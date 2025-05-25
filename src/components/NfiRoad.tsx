import React, { useState } from "react";
import { Box, Input, Flex, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

type NfiRoad = {
  id: number;
  name: string;
  location: string;
  category: string;
  lat: string;
  lng: string;
  naverLink: string;
  note: string;
};

interface NfiRoadProps {
  nfiRoad: NfiRoad[];
  setSelectedNfiRoad: (nfiRoad: NfiRoad) => void;
  selectedNfiRoad: NfiRoad | null;
}

const NfiRoad = ({
  nfiRoad,
  setSelectedNfiRoad,
  selectedNfiRoad,
}: NfiRoadProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  const filteredNfiRoad = nfiRoad.filter(
    (data) =>
      data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNfiRoadClick = (data: NfiRoad) => {
    setSelectedNfiRoad(data);
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
        {filteredNfiRoad.map((data) => (
          <Flex
            key={data.id}
            onClick={() => handleNfiRoadClick(data)}
            cursor="pointer"
            p="10px"
            border="1px solid #eee"
            margin="10px 0"
            borderRadius="4px"
            borderColor="purple.200"
            w="100%"
            _hover={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
            position="relative"
            bg={selectedNfiRoad?.id === data.id ? "blue.50" : "white"}
          >
            <Box flexGrow={1}>
              <Text fontSize="16px" fontWeight="bold" mb="5px" noOfLines={1}>
                {data.name}
              </Text>
              <Text fontSize="14px" color="#666" noOfLines={2}>
                {data.location}
              </Text>
            </Box>
          </Flex>
        ))}
      </Box>
    </VStack>
  );
};

export default NfiRoad;
