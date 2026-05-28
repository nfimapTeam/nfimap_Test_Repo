import React, { useEffect } from "react";
import {
  Box,
  Flex,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NavItems from "./NavItems";

const Header = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const isMobileOrTablet = useBreakpointValue({
    base: true,
    md: true,
    lg: false,
  });
  const logoSrc = useBreakpointValue({
    base: "/image/logo/logo.svg",
    lg: "/image/logo/Nfimap-text-logo.svg",
  });

  return (
    <Box
      p="10px"
      bg="rgba(255, 255, 255, 0.85)"
      backdropFilter="blur(16px)"
      borderBottom="1px solid"
      borderColor="purple.50"
      height="70px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      position="sticky"
      top={0}
      zIndex={10}
      px={6}
      boxShadow="0 4px 30px -10px rgba(139, 92, 246, 0.08)"
    >
      {/* Mobile/Tablet Layout */}
      {isMobileOrTablet ? (
        <>
          <Flex justifyContent="center" flex="1">
            <Link to="/">
              <Image
                src={logoSrc}
                alt="MyApp Logo"
                boxSize="46px"
                transition="all 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
                _hover={{
                  transform: "rotate(360deg) scale(1.05)",
                }}
              />
            </Link>
          </Flex>
        </>
      ) : (
        /* Desktop Layout */
        <>
          <Flex flex="1" alignItems="center" justifyContent="space-between">
            {/* Left: Logo */}
            <Flex flex="1" alignItems="center">
              <Link to="/">
                <Flex alignItems="center">
                  <Image 
                    src={logoSrc} 
                    alt="Nfimap Logo" 
                    height="120px" 
                    transition="transform 0.3s"
                    _hover={{ transform: "scale(1.02)" }}
                  />
                </Flex>
              </Link>
            </Flex>

            {/* Center: Nav Menu */}
            <Flex flex="1" justifyContent="center" alignItems="center">
              <NavItems direction="row" fontSize="sm" textOnly={true} />
            </Flex>

            {/* Right: empty menu for spacing layout */}
            <Flex flex="1" justifyContent="flex-end" alignItems="center" pr={4} gap={4}>
            </Flex>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default Header;
