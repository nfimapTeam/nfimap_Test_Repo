import { Box, Flex, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { RiListUnordered, RiMapPinLine, RiUser3Line, RiMusicLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const getLinkColor = (path: string) => {
    return location.pathname === path ? "purple.400" : "black";
  };

  const getLinkColorIcon = (path: string) => {
    return location.pathname === path ? "#9F7AEA" : "black";
  };

  return (
    <Flex
      direction="row" // Horizontal layout for the footer items
      px={4}
      py={2}
      bg="white"
      borderTop="1px solid black"
      position="fixed"
      bottom="0"
      width="100%"
      height="70px" // Increased height to accommodate the stacked layout
      zIndex="2"
    >
      <Flex justify="space-between" width="100%">
        {/* List Item */}
        <Flex
          flex="1"
          direction="column" // Stack icon and text vertically
          justifyContent="center"
          alignItems="center"
          gap="2px" // Small gap between icon and text
          cursor="pointer"
          onClick={() => navigate("/")}
        >
          <RiListUnordered color={getLinkColorIcon("/")} size={24} />
          <Text fontSize="sm" color={getLinkColor("/")} fontWeight={600} textAlign="center">
            {t('list')}
          </Text>
        </Flex>

        {/* Map Item */}
        <Flex
          flex="1"
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap="2px"
          cursor="pointer"
          onClick={() => navigate("/map")}
        >
          <RiMapPinLine color={getLinkColorIcon("/map")} size={24} />
          <Text fontSize="sm" color={getLinkColor("/map")} fontWeight={600} textAlign="center">
            {t('map')}
          </Text>
        </Flex>

        {/* Profile Item */}
        <Flex
          flex="1"
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap="2px"
          cursor="pointer"
          onClick={() => navigate("/profile")}
        >
          <RiUser3Line color={getLinkColorIcon("/profile")} size={24} />
          <Text fontSize="sm" color={getLinkColor("/profile")} fontWeight={600} textAlign="center">
            {t('profile')}
          </Text>
        </Flex>

        {/* Music Item */}
        <Flex
          flex="1"
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap="2px"
          cursor="pointer"
          onClick={() => navigate("/music")}
        >
          <RiMusicLine color={getLinkColorIcon("/music")} size={24} />
          <Text fontSize="sm" color={getLinkColor("/music")} fontWeight={600} textAlign="center">
            {t('music')}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Footer;