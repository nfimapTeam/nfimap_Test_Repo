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
import { RiInstagramLine, RiTwitterLine } from "@remixicon/react";

type Member = { name: string; date: string };

const members: Member[] = [
  { name: "이승협", date: "10-29" },
  { name: "차훈", date: "07-12" },
  { name: "김재현", date: "07-15" },
  { name: "유회승", date: "02-28" },
  { name: "서동성", date: "04-09" },
];

const images: { [key: string]: string[] } = {
  이승협: [
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
        const memberImages = images[member.name];
        setRandomImage(
          memberImages[Math.floor(Math.random() * memberImages.length)]
        );
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
      case "instagram":
        try {
          // 이미지를 Blob으로 가져오기
          const response = await fetch(randomImage);
          const blob = await response.blob();

          // Web Share API를 사용하여 공유
          if (navigator.share) {
            await navigator.share({
              files: [new File([blob], "birthday.jpg", { type: "image/jpeg" })],
              title: `${birthdayMember?.name}님의 생일을 축하합니다!`,
              text: "생일 축하 메시지를 공유해보세요!",
              url: "https://nfimap.co.kr/",
            });
          } else {
            // Web Share API가 지원되지 않는 경우 Instagram 앱/웹사이트로 이동
            window.location.href = "instagram://camera";
            setTimeout(() => {
              window.location.href = "https://www.instagram.com";
            }, 100);
          }
        } catch (error) {
          console.error("Error sharing to Instagram:", error);
          // 공유 실패 시 Instagram으로 이동
          window.location.href = "https://www.instagram.com";
        }
        break;
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
                {birthdayMember.name}님의 생일을 축하합니다! 🎉
              </Text>
              <Image
                src={randomImage}
                alt={`${birthdayMember.name} 생일 이미지`}
                cursor="pointer"
                onClick={handleDownloadImage}
              />
              <Text fontSize="sm" color="gray.500" mt={2}>
                이미지를 클릭하면 저장됩니다.
              </Text>
              <VStack spacing={4} mt={4}>
                <HStack spacing={8} justify="center">
                  <VStack>
                    <Box
                      as="button"
                      w="40px"
                      h="40px"
                      borderRadius="full"
                      bg="purple.500"
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      onClick={() => handleShare("instagram")}
                      _hover={{ bg: "purple.600" }}
                    >
                      <Icon as={RiInstagramLine} boxSize="24px" />
                    </Box>
                    <Text fontSize="sm">인스타그램</Text>
                  </VStack>
                  <VStack>
                    <Box
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
                      _hover={{ bg: "gray.900" }}
                    >
                      <Icon as={RiTwitterLine} boxSize="24px" />
                    </Box>
                    <Text fontSize="sm">X</Text>
                  </VStack>
                </HStack>
              </VStack>
              <Flex justifyContent="flex-end">
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
