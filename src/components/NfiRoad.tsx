import React, { useState } from "react";
import { Box, Input, Flex, Text, VStack, InputGroup, InputRightElement, Icon } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "@chakra-ui/icons";

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
      <InputGroup size="md">
        <Input
          borderColor="gray.200"
          placeholder={t("mapSearchPlaceholder")}
          value={searchQuery}
          focusBorderColor="brand.main"
          onChange={(e) => setSearchQuery(e.target.value)}
          borderRadius="full"
          boxShadow="soft"
          _hover={{ borderColor: "gray.300" }}
          pl={5}
          pr={11}
          transition="all 0.3s ease"
          _focus={{
            boxShadow: "glow",
            transform: "translateY(-1px)"
          }}
        />
        <InputRightElement width="3rem">
          <Icon as={SearchIcon} color="gray.400" />
        </InputRightElement>
      </InputGroup>
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
            p={3}
            margin="12px 0"
            border="1px solid"
            borderColor={selectedNfiRoad?.id === data.id ? "brand.main" : "gray.100"}
            borderRadius="2xl"
            w="100%"
            boxShadow="soft"
            position="relative"
            bg={selectedNfiRoad?.id === data.id ? "brand.purpleSoft" : "white"}
            transition="all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            _hover={{ 
              transform: "translateY(-2px)", 
              boxShadow: "card", 
              borderColor: "brand.main" 
            }}
          >
            <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="center">
              <Text fontSize="15px" fontWeight="black" color={selectedNfiRoad?.id === data.id ? "brand.main" : "gray.800"} mb="4px" noOfLines={1}>
                {data.name}
              </Text>
              <Text fontSize="12px" fontWeight="medium" color={selectedNfiRoad?.id === data.id ? "brand.main" : "gray.500"} noOfLines={2}>
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
