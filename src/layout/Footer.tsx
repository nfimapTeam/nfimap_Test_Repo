import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, MapPin, User, PlayCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Better path matching logic for highlighting active footer items
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/map") return "map";
    if (path === "/profile") return "profile";
    if (path === "/content") return "content";
    return "list"; // Default to list for "/" and detail pages
  };

  const activeTab = getActiveTab();

  const activeColor = "brand.main";
  const inactiveColor = useColorModeValue("gray.450", "gray.500");
  
  const bg = useColorModeValue("rgba(255, 255, 255, 0.85)", "rgba(26, 32, 44, 0.85)");
  const borderColor = useColorModeValue("purple.50", "whiteAlpha.100");

  const navigationItems = [
    { key: "list", label: t("list"), icon: Calendar, path: "/" },
    { key: "map", label: t("map"), icon: MapPin, path: "/map" },
    { key: "profile", label: t("profile"), icon: User, path: "/profile" },
    { key: "content", label: t("content"), icon: PlayCircle, path: "/content" },
  ];

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      height="70px"
      bg={bg}
      backdropFilter="blur(16px)"
      borderTop="1px solid"
      borderColor={borderColor}
      zIndex={100}
      px={4}
      py={2}
    >
      <Flex justify="space-between" align="center" h="100%" maxW="600px" mx="auto">
        {navigationItems.map((item) => {
          const isActive = activeTab === item.key;
          const IconComponent = item.icon;

          return (
            <Flex
              key={item.key}
              flex="1"
              direction="column"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              onClick={() => navigate(item.path)}
              transition="all 0.2s ease"
              _active={{ transform: "scale(0.95)" }}
              position="relative"
            >
              {/* Icon with scale animation when active */}
              <Box
                color={isActive ? activeColor : inactiveColor}
                transform={isActive ? "scale(1.1)" : "scale(1)"}
                transition="all 0.2s ease"
                mb="3px"
              >
                <IconComponent size={22} strokeWidth={isActive ? 2.5 : 2} />
              </Box>

              {/* Text Label */}
              <Text
                fontSize="10px"
                fontWeight={isActive ? "black" : "bold"}
                color={isActive ? activeColor : inactiveColor}
                transition="all 0.2s ease"
                textAlign="center"
                letterSpacing="-0.2px"
              >
                {item.label}
              </Text>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};

export default Footer;