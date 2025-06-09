import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { usePwaPrompt } from "../hook/usePwaPropt";

const DownloadPromptPWA = () => {
  const { isPromptVisible, promptInstall } = usePwaPrompt();

  if (!isPromptVisible) return null;

  return (
    <Box position="fixed" bottom="0" width="100%" bg="blue.600" p={4} zIndex={1000}>
      <Flex justify="space-between" align="center" color="white">
        <Text>앱을 설치해서 더 편리하게 이용해보세요!</Text>
        <Button size="sm" colorScheme="teal" onClick={promptInstall}>
          설치하기
        </Button>
      </Flex>
    </Box>
  );
};

export default DownloadPromptPWA;
