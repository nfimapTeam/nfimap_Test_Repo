import React, { useEffect } from "react";
import { Box, Flex, Image, Select } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { i18n } = useTranslation();

  // 언어 변경 및 세션 스토리지에 저장하는 함수
  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value;
    i18n.changeLanguage(language);
    sessionStorage.setItem("preferredLanguage", language); // 세션에 언어 저장
  };

  // 컴포넌트가 마운트될 때 세션에서 언어 설정 불러오기
  useEffect(() => {
    const savedLanguage = sessionStorage.getItem("preferredLanguage");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage); // 세션에 저장된 언어로 설정
    }
  }, [i18n]);

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
    >
      <Flex justifyContent="center" flex="1">
        <Link to="/">
          <Image
            src="/image/nfimap.png"
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
        <Select onChange={changeLanguage} value={i18n.language}>
          <option value="ko">한국어</option>
          <option value="en">English</option>
          <option value="ja">日本語</option>
          <option value="zh">中文</option>
        </Select>
      </Box>
    </Box>
  );
};

export default Header;
