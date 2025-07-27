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
        </>
      ) : (
        /* Desktop Layout */
        <>
          {/* Left Logo */}
          {/* Navigation Items (Centered-Right) */}
          <Flex flex="1" alignItems="center" justifyContent="space-between">
            {/* 왼쪽: 로고 */}
            <Flex flex="1" alignItems="center">
              <Link to="/">
                <Flex alignItems="center">
                  <Image src={logoSrc} alt="Nfimap Logo" height="150px" />
                </Flex>
              </Link>
            </Flex>

            {/* 가운데: 메뉴 */}
            <Flex flex="1" justifyContent="center" alignItems="center">
              <NavItems direction="row" fontSize="md" textOnly={true} />
            </Flex>

            {/* 오른쪽: 설정 버튼 메뉴 */}
            <Flex flex="1" justifyContent="flex-end" alignItems="center" pr={4} gap={4}>
            </Flex>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default Header;
