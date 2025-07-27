import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { i18n, t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<string>(i18n.language);

  const handleConfirm = () => {
    if (selectedLang !== i18n.language) {
      i18n.changeLanguage(selectedLang);
      localStorage.setItem("preferredLanguage", selectedLang);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("setting")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Button
              w="100%"
              colorScheme="purple"
              variant={selectedLang === "ko" ? "solid" : "outline"}
              onClick={() => setSelectedLang("ko")}
            >
              한국어
            </Button>
            <Button
              w="100%"
              colorScheme="purple"
              variant={selectedLang === "en" ? "solid" : "outline"}
              onClick={() => setSelectedLang("en")}
            >
              English
            </Button>
            <Button
              w="100%"
              colorScheme="purple"
              variant={selectedLang === "ja" ? "solid" : "outline"}
              onClick={() => setSelectedLang("ja")}
            >
              日本語
            </Button>
            <Button
              w="100%"
              colorScheme="purple"
              variant={selectedLang === "zh" ? "solid" : "outline"}
              onClick={() => setSelectedLang("zh")}
            >
              中文
            </Button>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="purple" onClick={handleConfirm}>
            {t("confirm") /* "확인" */}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SettingsModal;
