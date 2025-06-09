import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  useBreakpointValue,
  chakra,
  IconButton,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CloseIcon } from '@chakra-ui/icons';
import { usePwaPrompt } from '../hook/usePwaPropt';
import { useState, useEffect } from 'react';

const MotionBox = chakra(motion.div);

const DownloadPromptPWA = () => {
  const { t } = useTranslation();
  const { isPromptVisible, promptInstall } = usePwaPrompt();
  const [isDismissed, setIsDismissed] = useState(!!sessionStorage.getItem('pwa-install-dismissed'));
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const textSize = useBreakpointValue({ base: 'sm', md: 'md' });

  useEffect(() => {
    // Check sessionStorage on mount
    setIsDismissed(!!sessionStorage.getItem('pwa-install-dismissed'));
  }, []);

  if (!isPromptVisible || isDismissed) return null;

  const handleDismiss = () => {
    const now = new Date().toISOString();
    localStorage.setItem('pwa-install-dismissed', now); // Persistent dismiss
    window.location.reload(); // Reload to hide prompt
  };

  const handleClose = () => {
    sessionStorage.setItem('pwa-install-dismissed', 'true'); // Session-only dismiss
    setIsDismissed(true); // Hide prompt without reloading
  };

  return (
    <MotionBox
      position="fixed"
      bottom="0"
      width="100%"
      bg="purple.400"
      color="white"
      p={{ base: 3, md: 4 }}
      zIndex={1000}
      boxShadow="0 -2px 10px rgba(0,0,0,0.5)"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <Flex
        justify="space-between"
        align="center"
        gap={{ base: 2, md: 4 }}
        maxW="1200px"
        mx="auto"
        position="relative"
      >
        {/* Close Button */}
        <IconButton
          aria-label="팝업 닫기"
          icon={<CloseIcon />}
          size="sm"
          variant="ghost"
          color="purple.200"
          _hover={{ color: 'purple.500', bg: 'purple.600' }}
          position="absolute"
          top={{ base: 2, md: 3 }}
          right={{ base: 2, md: 3 }}
          onClick={handleClose}
        />

        <Flex direction="column" align="center" gap={{ base: 2, md: 3 }} w="full" py={2}>
          {/* Prompt Text and Logo */}
          <Flex align="center" gap={{ base: 2, md: 3 }} flexShrink={0}>
            <Image src="/image/logo/logo.svg" alt={t('pwa_prompt')} boxSize={{ base: '32px', md: '40px' }} />
            <Text fontWeight="bold" fontSize={textSize} color="purple.200">
              {t('pwa_prompt')}
            </Text>
          </Flex>
          {/* Install Button */}
          <Button
            size={buttonSize}
            bg="purple.400"
            color="white"
            border="2px solid"
            borderColor="purple.200"
            _hover={{ bg: 'purple.500', borderColor: 'purple.400', transform: 'scale(1.05)' }}
            _active={{ bg: 'purple.500' }}
            transition="all 0.2s ease"
            onClick={promptInstall}
          >
            {t('install')}
          </Button>

          {/* View Mobile Web Link */}
          <Text
            fontSize={textSize}
            color="purple.200"
            textDecoration="underline"
            _hover={{ color: 'purple.500', cursor: 'pointer' }}
            onClick={handleDismiss}
          >
            {t('view_mobile_web')}
          </Text>
        </Flex>
      </Flex>
    </MotionBox>
  );
};

export default DownloadPromptPWA;