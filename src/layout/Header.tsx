// Header.tsx
import React, { useEffect } from "react";
import { Box, Flex, Image, useBreakpointValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Select } from "antd";
import NavItems from "./NavItems";

const Header = () => {
  const { i18n } = useTranslation();

  // 언어 변경 및 세션 스토리지에 저장하는 함수
  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value);
    sessionStorage.setItem("preferredLanguage", value);
  };

  // 컴포넌트가 마운트될 때 세션에서 언어 설정 불러오기
  useEffect(() => {
    const savedLanguage = sessionStorage.getItem("preferredLanguage");
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
            <Select
              onChange={changeLanguage}
              value={i18n.language}
              style={{ width: 100, height: 40 }}
              dropdownStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#4BA4F2",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Select.Option value="ko">한국어</Select.Option>
              <Select.Option value="en">English</Select.Option>
              <Select.Option value="ja">日本語</Select.Option>
              <Select.Option value="zh">中文</Select.Option>
            </Select>
          </Box>
        </>
      ) : (
        /* Desktop Layout */
        <>
          {/* Left Logo */}
          <Link to="/">
            <Flex alignItems="center">
              <Image src={logoSrc} alt="Nfimap Logo" height="150px"/>
            </Flex>
          </Link>
          {/* Navigation Items (Centered-Right) */}
          <Flex flex="1" justifyContent="center" alignItems="center">
            <NavItems direction="row" fontSize="md" textOnly={true} />
          </Flex>
          {/* Language Dropdown (Far Right) */}
          <Box pr="16px">
            <Select
              onChange={changeLanguage}
              value={i18n.language}
              style={{ width: 100, height: 40 }}
              dropdownStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#4BA4F2",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Select.Option value="ko">한국어</Select.Option>
              <Select.Option value="en">English</Select.Option>
              <Select.Option value="ja">日本語</Select.Option>
              <Select.Option value="zh">中文</Select.Option>
            </Select>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Header;