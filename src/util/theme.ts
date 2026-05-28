import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      main: "#8B5CF6", // Vivid violet
      sub: "#FF2E93",  // Neon pink
      sub2: "#06B6D4", // Cyan
      purpleLight: "#F5F3FF",
      purpleSoft: "rgba(139, 92, 246, 0.08)",
      glass: "rgba(255, 255, 255, 0.75)",
      bg: "#F8F7FC",   // Light violet-tinted white
    },
  },
  shadows: {
    soft: "0 4px 20px rgba(139, 92, 246, 0.05), 0 2px 8px rgba(0, 0, 0, 0.02)",
    card: "0 10px 30px -10px rgba(139, 92, 246, 0.12), 0 1px 3px rgba(0, 0, 0, 0.02)",
    elevated: "0 20px 40px -15px rgba(139, 92, 246, 0.2), 0 0 1px rgba(139, 92, 246, 0.1)",
    glow: "0 0 20px rgba(139, 92, 246, 0.25)",
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
            bg: "purple.600",
            transform: "translateY(-1px)",
            boxShadow: "0 8px 20px rgba(139, 92, 246, 0.3)",
          },
          _active: {
            bg: "purple.700",
            transform: "translateY(0)",
          },
        },
        outline: {
          borderColor: "purple.200",
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
          borderColor: "purple.100",
          boxShadow: "0 10px 25px rgba(139, 92, 246, 0.08)",
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
