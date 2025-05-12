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
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent borderRadius="2xl" p={4}>
        <ModalHeader fontWeight="bold" fontSize="lg">
        {t("selectTicketProvider")}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={3} align="stretch">
            {links.map((link, index) => (
              <Button
                as="a"
                key={index}
                href={link}
                leftIcon={<Icon as={Ticket} />}
                justifyContent="flex-start"
                variant="outline"
                borderRadius="lg"
                colorScheme="purple"
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
