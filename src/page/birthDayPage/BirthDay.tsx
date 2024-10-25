import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, ModalOverlay, ModalContent, ModalBody, Image } from '@chakra-ui/react';
import Confetti from 'react-confetti';
import SeungHyub from './components/SeungHyub';

const BirthDay = () => {
  const [isModalOpen, setIsModalOpen] = useState(true); // 모달 초기 상태를 true로 설정
  const [showConfetti, setShowConfetti] = useState(false); // Confetti 상태

  // 선물 상자를 클릭하면 모달을 닫고 confetti 표시
  const handleGiftBoxClick = () => {
    setIsModalOpen(false);
    setShowConfetti(true);

    // Confetti를 일정 시간 동안만 표시
    // setTimeout(() => {
    //   setShowConfetti(false);
    // }, 5000); // 5초 후 Confetti 종료
  };

  return (
    <Box
      h="calc(100vh - 120px)"
      width="100%"
      maxWidth="1200px"
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
      {/* 모달 */}
      <Modal isOpen={isModalOpen} onClose={handleGiftBoxClick} isCentered>
        <ModalOverlay bgColor="rgba(0, 0, 0, 0.85)" />
        <ModalContent w={300} h={300}>
          <ModalBody display="flex" justifyContent="center" alignItems="center">
            <Image src="/image/util/giftBox.svg" alt="Gift Box" width="200px"  onClick={handleGiftBoxClick}/>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Confetti */}
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      {!isModalOpen && (
        <SeungHyub />
      )}
    </Box>
  );
};

export default BirthDay;
