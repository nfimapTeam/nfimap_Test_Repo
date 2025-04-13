import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    useDisclosure,
    Button,
    Icon,
    VStack,
  } from "@chakra-ui/react";
  import { Ticket } from "lucide-react";
  import { useRef } from "react";
import { getTicketSiteName } from "../../../util/getTicketSiteName";
import { TFunction } from "i18next";
  
  interface TicketDrawerProps {
    links: string[];
    isOpen: boolean;
    onClose: () => void;
    lang: string;
  }
  
  export const TicketDrawer = ({ links, isOpen, onClose, lang }: TicketDrawerProps) => {
    const btnRef = useRef<HTMLButtonElement>(null);
  
    return (
      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent borderTopRadius="2xl" p={4}>
          <DrawerHeader fontWeight="bold" fontSize="lg">
            예매처 선택
          </DrawerHeader>
  
          <DrawerBody>
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
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  };
  