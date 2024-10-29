import React, { useEffect, useState } from "react";
import {
  Box,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
  Text,
  Checkbox,
  VStack,
  HStack,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { RiDownloadLine, RiTwitterXLine } from "@remixicon/react";

type Member = { name: string; date: string };

const members: Member[] = [
  { name: "승협", date: "10-29" },
  { name: "차훈", date: "07-12" },
  { name: "김재현", date: "07-15" },
  { name: "유회승", date: "02-28" },
  { name: "서동성", date: "04-09" },
];

const images: { [key: string]: string[] } = {
  승협: [
    "/image/toro/생일축전_01.jpg",
    "/image/toro/생일축전_02.jpg",
    "/image/toro/생일축전_03.jpg",
    "/image/toro/생일축전_03B.jpg",
  ],
  차훈: [""],
  김재현: [""],
  유회승: [""],
  서동성: [""],
};

const getTodayDate = () => {
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${month}-${day}`;
};

const Birthday = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [birthdayMember, setBirthdayMember] = useState<Member | null>(null);
  const [randomImage, setRandomImage] = useState<string>("");
  const [doNotShowToday, setDoNotShowToday] = useState(false);
  const today = getTodayDate();

  useEffect(() => {
    const isBirthdayShown = sessionStorage.getItem("isBirthdayShown");

    if (!isBirthdayShown) {
      const member = members.find((member) => member.date === today);
      if (member) {
        setBirthdayMember(member);
        const memberImages = images[member.name] || []; // Default to empty array if undefined
        if (memberImages.length > 0) {
          setRandomImage(
            memberImages[Math.floor(Math.random() * memberImages.length)]
          );
        }
        onOpen();
      }
    }
  }, [onOpen, today]);

  const handleDownloadImage = () => {
    const link = document.createElement("a");
    link.href = randomImage;
    link.download = `${birthdayMember?.name}_생일사진.jpg`;
    link.click();
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoNotShowToday(e.target.checked);
  };

  const handleModalClose = () => {
    if (doNotShowToday) {
      sessionStorage.setItem("isBirthdayShown", "true");
    }
    onClose();
  };

  const handleShare = async (platform: string) => {
    const url = encodeURIComponent("https://nfimap.co.kr/");
    const text = encodeURIComponent(
      `${birthdayMember?.name}님의 생일을 축하합니다! 🎉`
    );

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
          "_blank",
          "width=600,height=400"
        );
        break;
      default:
        return;
    }
  };

  return (
    <Box>
      {birthdayMember && (
        <Modal isOpen={isOpen} onClose={handleModalClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton _focus={{ boxShadow: "none" }} border="none" />
            <Box p={4} textAlign="center">
              <Text fontSize="lg" fontWeight="bold" mb={4}>
                {birthdayMember.name}이의 생일을 함께 축하해 주세요!🎉
              </Text>
              <Image
                src={randomImage}
                alt={`${birthdayMember.name} 생일 이미지`}
              />
              <Flex justifyContent="center" mt="16px">
                <Flex alignItems="center" gap="12px">
                  <Flex
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    gap={2}
                  >
                    <Flex
                      as="button"
                      w="40px"
                      h="40px"
                      borderRadius="full"
                      bg="gray.800"
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      onClick={() => handleShare("twitter")}
                      _hover={{ bg: "gray.900", transform: "scale(1.1)" }} // Increase size on hover
                      transition="transform 0.2s, bg 0.2s" // Smooth transition for hover effects
                    >
                      <Icon as={RiTwitterXLine} boxSize="24px" />
                    </Flex>
                    <Text fontSize="sm">공유하기</Text>
                  </Flex>
                  <Flex
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    gap={2}
                  >
                    <Flex
                      as="button"
                      w="40px"
                      h="40px"
                      borderRadius="full"
                      bg="blue.500" // Changed background color
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      onClick={handleDownloadImage}
                      _hover={{ bg: "blue.600", transform: "scale(1.1)" }}
                      transition="transform 0.2s, bg 0.2s"
                    >
                      <Icon as={RiDownloadLine} boxSize="24px" />
                    </Flex>
                    <Text fontSize="sm">저장하기</Text>
                  </Flex>
                </Flex>
              </Flex>
              <Flex justifyContent="flex-end" alignItems="center" gap="8px">
                <Checkbox
                  mt={4}
                  isChecked={doNotShowToday}
                  onChange={handleCheckboxChange}
                >
                  오늘 하루 안 보기
                </Checkbox>
              </Flex>
            </Box>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default Birthday;
