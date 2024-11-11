import React, { useState } from "react";
import { Box, IconButton, VStack, useOutsideClick, chakra } from "@chakra-ui/react";
import { RiAddLine, RiCloseLine } from "@remixicon/react";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = chakra(motion.div);

const FnbButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const ref = React.useRef(null);
  useOutsideClick({
    ref: ref,
    handler: () => setIsOpen(false),
  });

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
            bg="rgba(0, 0, 0, 0.5)"
            zIndex={2}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* FNB 버튼 및 추가 버튼 그룹 */}
      <Box position="fixed" bottom="60px" right="16px" zIndex={3}>
        <IconButton
          aria-label="FNB 버튼"
          icon={isOpen ? <RiCloseLine size={24} /> : <RiAddLine size={24} />}
          onClick={() => setIsOpen(!isOpen)}
          colorScheme="blue"
          isRound
          width="56px"
          height="56px"
          boxShadow="lg"
          _hover={{ transform: "scale(1.1)" }}
          transition="all 0.2s"
        />

        <AnimatePresence>
          {isOpen && (
            <VStack
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              spacing={4}
              position="absolute"
              bottom="80px"
              right="0"
              zIndex={3}
            >
              <IconButton
                aria-label="추가 버튼 1"
                icon={<RiAddLine size={20} />}
                colorScheme="teal"
                isRound
                width="56px"
                height="56px"
              />
              <IconButton
                aria-label="추가 버튼 2"
                icon={<RiAddLine size={20} />}
                colorScheme="green"
                isRound
                width="56px"
                height="56px"
              />
            </VStack>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default FnbButton;
