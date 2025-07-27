import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      main: "#000",
      sub: "#0597F2",
      sub2: "#0597F2",
    },
  },
  components: {
    Menu: {
      baseStyle: {
        list: {
          bg: "white", // MenuList 기본 배경색 제거
          boxShadow: "none", // 기본 그림자 제거 (필요한 경우)
          _hover: {
            bg: "none", // 마우스 오버 시 배경색
          },
        },
        item: {
          bg: "bg", // MenuItem 기본 배경색 제거
          _hover: {
            bg: "purple.100", // 마우스 오버 시 배경색
          },
        },
      },
    },
  },
});

export default theme;
