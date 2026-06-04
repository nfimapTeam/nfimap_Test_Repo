import React from "react";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Option<T> {
  value: T;
  label: string;
  icon?: LucideIcon;
}

interface SegmentedToggleProps<T> {
  layoutId: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  width?: string | { base: string; md: string };
}

export function SegmentedToggle<T extends string>({
  layoutId,
  options,
  value,
  onChange,
  width,
}: SegmentedToggleProps<T>) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const defaultWidth = { base: "170px", md: "210px" };

  return (
    <Flex
      bg="purple.50"
      p={{ base: "2px", md: "4px" }}
      borderRadius="full"
      alignItems="center"
      borderWidth="1px"
      borderColor="purple.100"
      boxShadow="inner"
      position="relative"
      width={width || defaultWidth}
      flexShrink={0}
      userSelect="none"
    >
      {options.map((option) => {
        const isActive = value === option.value;
        const IconComponent = option.icon;

        return (
          <Box
            key={option.value}
            position="relative"
            flex={1}
            height={{ base: "28px", md: "34px" }}
          >
            <Flex
              onClick={() => onChange(option.value)}
              height="100%"
              alignItems="center"
              justifyContent="center"
              gap={2}
              cursor="pointer"
              fontSize={{ base: "11px", md: "xs" }}
              fontWeight="extrabold"
              color={isActive ? "white" : "purple.500"}
              transition="color 0.25s"
              position="relative"
              zIndex={3}
              whiteSpace="nowrap"
            >
              {IconComponent && (
                <IconComponent size={isMobile ? 12 : 14} strokeWidth={2.5} />
              )}
              <Box as="span">{option.label}</Box>
            </Flex>
            {isActive && (
              <motion.div
                layoutId={layoutId}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "#8B5CF6",
                  borderRadius: "9999px",
                  boxShadow: "0 4px 12px rgba(139, 92, 246, 0.35)",
                  zIndex: 2,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </Box>
        );
      })}
    </Flex>
  );
}

export default SegmentedToggle;
