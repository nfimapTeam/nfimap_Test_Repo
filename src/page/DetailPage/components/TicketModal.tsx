import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Icon,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Ticket } from "lucide-react";
import { getTicketSiteName } from "../../../util/getTicketSiteName";

interface TicketModalProps {
  links: string[];
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  t: any;
}

export const TicketModal = ({ links, isOpen, onClose, lang, t }: TicketModalProps) => {
  const contentBg = useColorModeValue("white", "gray.950");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const dividerColor = useColorModeValue("purple.50", "whiteAlpha.100");
  const buttonBorderColor = useColorModeValue("purple.150", "whiteAlpha.200");
  const closeBtnBg = useColorModeValue("gray.100", "whiteAlpha.100");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.600" />
      <ModalContent 
        borderRadius="3xl" 
        p={6} 
        bg={contentBg}
        borderWidth="1px"
        borderColor={dividerColor}
      >
        <ModalHeader 
          fontWeight="black" 
          fontSize="xl" 
          color={textColor}
          pb={4}
          mb={4}
          borderBottom="1px solid"
          borderColor={dividerColor}
          px={0}
        >
          {t("selectTicketProvider")}
        </ModalHeader>
        <ModalCloseButton 
          borderRadius="full" 
          top="6" 
          right="6"
          _hover={{ bg: closeBtnBg }}
        />

        <ModalBody px={0} pb={2}>
          <VStack spacing={3.5} align="stretch">
            {links.map((link, index) => (
              <Button
                as="a"
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                leftIcon={<Icon as={Ticket} w="16px" h="16px" />}
                justifyContent="flex-start"
                variant="outline"
                borderRadius="full"
                h="48px"
                fontSize="md"
                fontWeight="extrabold"
                borderColor={buttonBorderColor}
                color="brand.main"
                _hover={{
                  bg: "brand.purpleSoft",
                  borderColor: "brand.main",
                  transform: "translateY(-1px)",
                }}
                _active={{
                  bg: "brand.purpleSoft",
                  transform: "translateY(0)",
                }}
                transition="all 0.2s"
              >
                {getTicketSiteName(link, lang)}
              </Button>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
