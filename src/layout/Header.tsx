import React, { useEffect } from "react";
import {
  Box,
  Flex,
  Image,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NavItems from "./NavItems";

const Header = () => {
  const { i18n } = useTranslation();

  // 언어 변경 및 세션 스토리지에 저장하는 함수
  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem("preferredLanguage", value);
  };

  // 컴포넌트가 마운트될 때 세션에서 언어 설정 불러오기
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  // Determine if the header should use mobile/tablet or desktop layout
  const isMobileOrTablet = useBreakpointValue({ base: true, md: true, lg: false });
  const logoSrc = useBreakpointValue({
    base: "/image/logo/logo.svg",
    lg: "/image/logo/Nfimap-text-logo.svg",
  });

  return (
    <Box
      p="10px"
      bg="white"
      borderBottom="1px solid black"
      height="70px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      position="relative"
      px={4}
    >
      {/* Mobile/Tablet Layout */}
      {isMobileOrTablet ? (
        <>
          <Flex justifyContent="center" flex="1">
            <Link to="/">
              <Image
                src={logoSrc}
                alt="MyApp Logo"
                boxSize="50px"
                transition="transform 0.5s ease"
                _hover={{
                  transform: "rotate(360deg)",
                }}
              />
            </Link>
          </Flex>
          <Box position="absolute" right="16px">
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                bg="white"
                borderWidth="1px"
                color="gray.800"
                fontSize="sm"
                fontWeight="medium"
                height="40px"
                width="100px"
                borderRadius="md"
                boxShadow="sm"
                _hover={{
                  borderColor: "purple.400",
                  boxShadow: "md",
                }}
                _active={{
                  bg: "purple.50",
                  borderColor: "purple.500",
                }}
                _focus={{
                  borderColor: "purple.500",
                  boxShadow: "0 0 0 1px #9F7AEA",
                }}
                textAlign="left"
                justifyContent="space-between"
                px={3}
              >
                {i18n.language === "ko" ? "한국어" : 
                 i18n.language === "en" ? "English" : 
                 i18n.language === "ja" ? "日本語" : 
                 i18n.language === "zh" ? "中文" : i18n.language}
              </MenuButton>
              <MenuList
                bg="white"
                borderColor="purple.200"
                borderRadius="md"
                boxShadow="lg"
                minW="100px"
                zIndex={10}
                py={1}
                mt={1}
              >
                <MenuItem
                  onClick={() => changeLanguage("ko")}
                  bg="white"
                  color="gray.800"
                  fontSize="sm"
                  _hover={{ bg: "purple.50", color: "purple.700" }}
                  _focus={{ bg: "purple.50" }}
                  px={4}
                  py={2}
                >
                  한국어
                </MenuItem>
                <MenuItem
                  onClick={() => changeLanguage("en")}
                  bg="white"
                  color="gray.800"
                  fontSize="sm"
                  _hover={{ bg: "purple.50", color: "purple.700" }}
                  _focus={{ bg: "purple.50" }}
                  px={4}
                  py={2}
                >
                  English
                </MenuItem>
                <MenuItem
                  onClick={() => changeLanguage("ja")}
                  bg="white"
                  color="gray.800"
                  fontSize="sm"
                  _hover={{ bg: "purple.50", color: "purple.700" }}
                  _focus={{ bg: "purple.50" }}
                  px={4}
                  py={2}
                >
                  日本語
                </MenuItem>
                <MenuItem
                  onClick={() => changeLanguage("zh")}
                  bg="white"
                  color="gray.800"
                  fontSize="sm"
                  _hover={{ bg: "purple.50", color: "purple.700" }}
                  _focus={{ bg: "purple.50" }}
                  px={4}
                  py={2}
                >
                  中文
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </>
      ) : (
        /* Desktop Layout */
        <>
          {/* Left Logo */}
          <Link to="/">
            <Flex alignItems="center">
              <Image src={logoSrc} alt="Nfimap Logo" height="150px" />
            </Flex>
          </Link>
          {/* Navigation Items (Centered-Right) */}
          <Flex flex="1" justifyContent="center" alignItems="center">
            <NavItems direction="row" fontSize="md" textOnly={true} />
          </Flex>
          {/* Language Dropdown (Far Right) */}
          <Box pr="16px">
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                bg="white"
                borderColor="purple.200"
                borderWidth="1px"
                color="gray.800"
                fontSize="sm"
                fontWeight="medium"
                height="40px"
                width="100px"
                borderRadius="md"
                boxShadow="sm"
                _hover={{
                  borderColor: "purple.400",
                  boxShadow: "md",
                }}
                _active={{
                  bg: "purple.50",
                  borderColor: "purple.500",
                }}
                _focus={{
                  borderColor: "purple.500",
                  boxShadow: "0 0 0 1px #9F7AEA",
                }}
                textAlign="left"
                justifyContent="space-between"
                px={3}
              >
                {i18n.language === "ko" ? "한국어" : 
                 i18n.language === "en" ? "English" : 
                 i18n.language === "ja" ? "日本語" : 
                 i18n.language === "zh" ? "中文" : i18n.language}
              </MenuButton>
              <MenuList
                bg="white"
                borderColor="purple.200"
                borderRadius="md"
                boxShadow="lg"
                minW="100px"
                zIndex={10}
                mt={1}
              >
                <MenuItem
                  onClick={() => changeLanguage("ko")}
                  bg="white"
                  color="gray.800"
                  fontSize="sm"
                  _hover={{ bg: "purple.50", color: "purple.700" }}
                  _focus={{ bg: "purple.50" }}
                  px={4}
                  py={2}
                >
                  한국어
                </MenuItem>
                <MenuItem
                  onClick={() => changeLanguage("en")}
                  bg="white"
                  color="gray.800"
                  fontSize="sm"
                  _hover={{ bg: "purple.50", color: "purple.700" }}
                  _focus={{ bg: "purple.50" }}
                  px={4}
                  py={2}
                >
                  English
                </MenuItem>
                <MenuItem
                  onClick={() => changeLanguage("ja")}
                  bg="white"
                  color="gray.800"
                  fontSize="sm"
                  _hover={{ bg: "purple.50", color: "purple.700" }}
                  _focus={{ bg: "purple.50" }}
                  px={4}
                  py={2}
                >
                  日本語
                </MenuItem>
                <MenuItem
                  onClick={() => changeLanguage("zh")}
                  bg="white"
                  color="gray.800"
                  fontSize="sm"
                  _hover={{ bg: "purple.50", color: "purple.700" }}
                  _focus={{ bg: "purple.50" }}
                  px={4}
                  py={2}
                >
                  中文
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Header;