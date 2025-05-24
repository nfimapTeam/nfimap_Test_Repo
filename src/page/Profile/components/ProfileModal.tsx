import React from "react";
import {
  Box,
  Image,
  Flex,
  Stack,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tag,
  TagLeftIcon,
  TagLabel,
  useColorModeValue,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { User, Instagram } from "lucide-react";

const MotionBox = chakra(motion.div);

interface Member {
  name: string;
  imageUrl: string;
  position: string[];
  aka: string[] | null;
  birthdate: string;
  mbti: string;
  instagram: string;
  military?: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMember: Member | null;
}

const ProfileModal = ({ isOpen, onClose, selectedMember }: ProfileModalProps) => {
  const bgGradient = useColorModeValue(
    "linear(to-b, white, gray.50)",
    "linear(to-b, gray.800, gray.900)"
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent
        maxW={{ base: "90%", sm: "400px" }}
        borderRadius="lg"
        boxShadow="2xl"
        bgGradient={bgGradient}
      >
        <ModalHeader textAlign="center" fontSize={{ base: "lg", sm: "xl" }} fontWeight="bold">
          {selectedMember?.name || "Member Profile"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {selectedMember && (
            <Stack spacing={4} align="center">
              <MotionBox
                whileHover={{ scale: 1.05, rotate: 3 }}
                whileTap={{ scale: 0.95, rotate: -3 }}
              >
                <Image
                  src={selectedMember.imageUrl}
                  alt={selectedMember.name}
                  borderRadius="full"
                  boxSize={{ base: "200px", sm: "200px" }}
                  objectFit="cover"
                  boxShadow="md"
                />
              </MotionBox>

              <Flex justifyContent="center" wrap="wrap" gap={2}>
                {selectedMember.position.map((pos, index) => (
                  <Tag
                    key={index}
                    colorScheme="teal"
                    variant="solid"
                    fontSize="sm"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    <TagLeftIcon as={User} boxSize="14px" />
                    <TagLabel>{pos}</TagLabel>
                  </Tag>
                ))}
              </Flex>

              <Flex justifyContent="center" wrap="wrap" gap={2}>
                {selectedMember?.aka?.map((akaName, index) => (
                  <Tag
                    key={index}
                    colorScheme="blue"
                    variant="solid"
                    fontSize="sm"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {akaName}
                  </Tag>
                ))}
              </Flex>

              <Box fontSize="sm" color="purple.600">
                {selectedMember.birthdate}
              </Box>

              <Box fontSize="sm" color="yellow.600">
                MBTI: {selectedMember.mbti}
              </Box>

              <Link href={selectedMember.instagram} isExternal>
                <Instagram size={24} color="pink" />
              </Link>
            </Stack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProfileModal;
