import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  Icon,
  VStack,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { Ticket } from "lucide-react";
import { useRef } from "react";
import { getTicketSiteName } from "../../../util/getTicketSiteName";

interface TicketDrawerProps {
  links: string[];
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  t: any;
}

export const TicketDrawer = ({ links, isOpen, onClose, lang, t }: TicketDrawerProps) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  
  const contentBg = useColorModeValue("white", "gray.950");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const dividerColor = useColorModeValue("purple.50", "whiteAlpha.100");
  const buttonBorderColor = useColorModeValue("purple.150", "whiteAlpha.200");

  return (
    <Drawer
      isOpen={isOpen}
      placement="bottom"
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay backdropFilter="blur(8px)" bg="blackAlpha.600" />
      <DrawerContent 
        borderTopRadius="3xl" 
        p={6} 
        bg={contentBg}
        borderTop="1px solid"
        borderColor={dividerColor}
      >
        <DrawerHeader 
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
        </DrawerHeader>

        <DrawerBody px={0} pb={2}>
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
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
