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
  Button,
} from "@chakra-ui/react";
import { RiTwitterXLine } from "@remixicon/react";

type Member = { name: string; date: string };

const members: Member[] = [
  { name: "이승협", date: "10-31" },
  { name: "차훈", date: "07-12" },
  { name: "김재현", date: "07-15" },
  { name: "유회승", date: "02-28" },
  { name: "서동성", date: "04-09" },
];

const images: { [key: string]: string[] } = {
  이승협: [
    "/image/toro/seunghyub_01.jpg",
    "/image/toro/seunghyub_02.jpg",
    "/image/toro/seunghyub_03.jpg"
  ],
  차훈: [""],
  김재현: [""],
  유회승: [""],
  서동성: [""],
};

// 생일 축하 메시지 배열
const shareMessages: string[] = [
  `엔플라잉의 멋진 리더 승협아,  
팬들에게 항상 힘이 되어줘서 고마워!  
생일 축하해 💜 
  
#NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축

`,
  `승협아, 생일 축하해!  
무대 위 너의 열정과 노력에 늘 감동이야.
올 한해도 더 빛나는 순간들로 가득하길! 💜
  
#NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축

`,

  `이승협, 너의 생일을 진심으로 축하해!  
팬들의 자랑이 되어줘서 고마워! 💜
  
#NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축

`,

  `승협아, 생일 축하해!🎂
너의 음악과 따뜻한 마음 덕분에 힘을 얻고 있어,
네게도 항상 행복하고 멋진 일만 가득하길! 💜 
  
#NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축

`,

  `생일 축하해, 승협아!  
너의 노력과 열정이 팬들에게 큰 힘이 돼.  
최고의 리더가 되어줘서 정말 고마워! 🎂💜
  
#NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축

`,

  `자랑스러운 승협아, 생일 축하해!  
언제나 팬들에게 큰 힘이 되어줘서 고마워,
올 한해도 더 빛나는 순간들로 가득하길! 💜

#NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축

`,

  `승협아, 생일 축하해!  
너의 음악은 팬들에게 언제나 큰 힘이 돼.
오늘은 너의 날이야! 💜 
  
#NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축

`,

  `승협아, 생일 축하해!  
언제나 너를 응원해.
멋진 하루가 되길! 💜
  
#NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축

`
];


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
        const memberImages = images[member.name] || [];
        if (memberImages.length > 0) {
          setRandomImage(
              memberImages[Math.floor(Math.random() * memberImages.length)]
          );
        }
        onOpen();
      }
    }
  }, [onOpen, today]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoNotShowToday(e.target.checked);
  };

  const handleDownloadImage = () => {
    const link = document.createElement("a");
    link.href = randomImage;
    link.download = `${birthdayMember?.name}_생일사진.jpg`;
    link.click();
  };

  const handleModalClose = () => {
    if (doNotShowToday) {
      sessionStorage.setItem("isBirthdayShown", "true");
    }
    onClose();
  };

  const handleShare = () => {
    // 랜덤으로 멘트를 선택
    const randomMessage = shareMessages[Math.floor(Math.random() * shareMessages.length)];
    const url = encodeURIComponent("https://nfimap.co.kr/");
    const text = encodeURIComponent(randomMessage);

    window.open(
        `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        "_blank",
    );
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
                    {birthdayMember.name}의 생일을 함께 축하해 주세요!🎉
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
                  <Flex justifyContent="center" alignItems="center" mt={4}>
                    <Button
                        onClick={handleShare}
                        leftIcon={<RiTwitterXLine />}
                        bg="black"
                        color="white"
                        _hover={{ bg: "gray.800" }}
                        _active={{ bg: "black" }}
                        _focus={{ boxShadow: "none" }}
                        borderRadius="8px"
                        size="md"
                        px={6}
                        fontWeight="bold"
                    >
                      공유하기
                    </Button>
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
