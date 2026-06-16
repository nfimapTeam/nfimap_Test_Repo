import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      main: "#7C3AED", // Modern Premium Violet (toned down, less neon)
      sub: "#EC4899",  // Muted pink
      sub2: "#06B6D4", // Cyan
      purpleLight: "#F5F3FF",
      purpleSoft: "rgba(124, 58, 237, 0.05)", // Soft brand violet tint
      glass: "rgba(255, 255, 255, 0.8)",
      bg: "#FAFAFE",   // Pure off-white
    },
  },
  shadows: {
    soft: "0 4px 18px rgba(15, 23, 42, 0.03), 0 1px 4px rgba(0, 0, 0, 0.01)",
    card: "0 12px 28px -8px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(0, 0, 0, 0.01)",
    elevated: "0 20px 40px -12px rgba(15, 23, 42, 0.08), 0 0 1px rgba(15, 23, 42, 0.04)",
    glow: "0 0 15px rgba(124, 58, 237, 0.12)", // Very soft, refined brand glow
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "full",
        fontWeight: "bold",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      variants: {
        solid: {
          bg: "brand.main",
          color: "white",
          _hover: {
            bg: "brand.main",
            opacity: 0.9,
            transform: "translateY(-1px)",
            boxShadow: "0 8px 20px rgba(124, 58, 237, 0.2)",
          },
          _active: {
            transform: "translateY(0)",
          },
        },
        outline: {
          borderColor: "gray.200",
          color: "brand.main",
          _hover: {
            bg: "brand.purpleSoft",
            borderColor: "brand.main",
          },
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: "full",
        px: 3,
        py: 1,
        textTransform: "none",
        fontWeight: "bold",
      },
    },
    Menu: {
      baseStyle: {
        list: {
          bg: "white",
          borderWidth: "1px",
          borderColor: "gray.100",
          boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
          borderRadius: "xl",
          py: 2,
          minW: "180px",
          zIndex: 100,
        },
        item: {
          bg: "transparent",
          color: "gray.700",
          fontSize: "sm",
          py: 2.5,
          px: 4,
          _hover: {
            bg: "brand.purpleSoft",
            color: "brand.main",
          },
          _focus: {
            bg: "brand.purpleSoft",
          },
        },
      },
    },
  },
});

export default theme;
