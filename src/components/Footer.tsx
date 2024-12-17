import { Box, Flex, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { RiListUnordered, RiMapPinLine, RiUser3Line, RiMusicLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const getLinkColor = (path: string) => {
    return location.pathname === path ? "brand.sub2" : "black";
  };

  const getLinkColorIcon = (path: string) => {
    return location.pathname === path ? "#0597F2" : "black";
  };

  return (
    <Flex
      direction="column"
      px={4}
      py={2}
      bg="white"
      borderTop="1px solid black"
      position="fixed"
      bottom="0"
      width="100%"
      height="50px" 
      zIndex="2"
    >
      <Flex justify="space-between">
        <Flex
          flex="1"
          justifyContent="center"
          alignItems="center"
          gap="5px"
          cursor="pointer"
          onClick={() => navigate("/")}
        >
          <RiListUnordered color={getLinkColorIcon("/")} />
          <Text fontSize="lg" color={getLinkColor("/")} fontWeight={600}>
            {t('list')}
          </Text>
        </Flex>
        <Flex
          flex="1"
          justifyContent="center"
          alignItems="center"
          gap="5px"
          cursor="pointer"
          onClick={() => navigate("/map")}
        >
          <RiMapPinLine color={getLinkColorIcon("/map")} />
          <Text fontSize="lg" color={getLinkColor("/map")} fontWeight={600}>
            {t('map')}
          </Text>
        </Flex>
        <Flex
          flex="1"
          justifyContent="center"
          alignItems="center"
          gap="5px"
          cursor="pointer"
          onClick={() => navigate("/profile")}
        >
          <RiUser3Line color={getLinkColorIcon("/profile")} />
          <Text fontSize="lg" color={getLinkColor("/profile")} fontWeight={600}>
            {t('profile')}
          </Text>
        </Flex>
        <Flex
          flex="1"
          justifyContent="center"
          alignItems="center"
          gap="5px"
          cursor="pointer"
          onClick={() => navigate("/music")}
        >
          <RiMusicLine color={getLinkColorIcon("/music")} />
          <Text fontSize="lg" color={getLinkColor("/music")} fontWeight={600}>
            {t('music')}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Footer;