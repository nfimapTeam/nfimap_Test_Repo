import { Box, Text, useBreakpointValue } from "@chakra-ui/react";

const Maintenance = () => {
  const isMobileOrTablet = useBreakpointValue({ base: true, md: true, lg: false });
  return (
    <Box
      h={isMobileOrTablet ? "calc(100svh - 120px)" : "calc(100svh - 70px)"}
      width="100%"
      mx="auto"
      p="16px 16px 70px 16px"
      overflowY="auto"
      css={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
    >
      <Box
        height="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px={4}
      >
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          서비스 점검 중입니다
        </Text>
        <Text fontSize="md" color="gray.500">
          보다 안정적인 서비스를 제공하기 위해 시스템 점검을 진행 중입니다.
          <br />
          잠시 후 다시 이용해 주세요.
        </Text>
      </Box>
    </Box >
  );
};

export default Maintenance;
