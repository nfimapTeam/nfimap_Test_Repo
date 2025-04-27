import React, { useState } from "react";
import { Box, IconButton, VStack, useOutsideClick, chakra, Image } from "@chakra-ui/react";
import { RiAddLine, RiCloseLine } from "@remixicon/react";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = chakra(motion.div);

interface FnbButtonProps {
  isMobileOrTablet: boolean | undefined;
}

const FnbButton = ({isMobileOrTablet} : FnbButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const ref = React.useRef(null);
  useOutsideClick({
    ref: ref,
    handler: () => setIsOpen(false),
  });

  const handleButtonClick = () => {
    window.open('https://nfimap-plus.co.kr/', '_blank');
    setIsOpen(false);
  };

  return (
    <Box ref={ref}>
      <AnimatePresence>
        {isOpen && (
          <MotionBox
            position="fixed"
            top="0"
            left="0"
            width="100vw"
            height="100vh"
            bg="rgba(0, 0, 0, 0.3)"
            backdropFilter="blur(3px)"
            zIndex={2}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* FNB 버튼 및 추가 버튼 그룹 */}
      <Box 
        position="fixed" 
        bottom={isMobileOrTablet ? "80px" : "30px"} 
        right={isMobileOrTablet ? "16px" : "30px"} 
        zIndex={3}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <IconButton
          aria-label="FNB 버튼"
          icon={isOpen ? <RiCloseLine size={24} /> : <RiAddLine size={24} />}
          onClick={() => setIsOpen(!isOpen)}
          bg={isOpen ? "white" : "#9F7AEA"}
          color={isOpen ? "#9F7AEA" : "white"}
          isRound
          width="56px"
          height="56px"
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.15)"
          _hover={{ 
            transform: "scale(1.05)",
            boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)"
          }}
          _active={{
            transform: "scale(0.95)"
          }}
          transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
        />

        <AnimatePresence>
          {isOpen && (
            <VStack
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              spacing={3}
              position="absolute"
              bottom="70px"
              alignItems="center"
              zIndex={3}
            >
              <IconButton
                onClick={handleButtonClick}
                aria-label="추가 버튼 1"
                icon={<Image src="/image/logo/logo_nfi.svg" />}
                bg="white"
                color="teal.500"
                isRound
                width="56px"
                height="56px"
                padding="4px"
                boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
                _hover={{ 
                  transform: "scale(1.05)",
                  boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.15)"
                }}
                _active={{
                  transform: "scale(0.95)"
                }}
                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
              />
            </VStack>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default FnbButton;