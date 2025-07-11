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
  { name: "차훈", date: "07-11" },
  { name: "김재현", date: "07-15" },
  { name: "유회승", date: "02-26" },
  { name: "서동성", date: "04-09" },
];

const images: { [key: string]: string[] } = {
  이승협: [
    "/image/toro/seunghyub_01.jpg",
    "/image/toro/seunghyub_02.jpg",
    "/image/toro/seunghyub_03.jpg",
  ],
  차훈: ["/image/toro/chahun.png"],
  김재현: [""],
  유회승: ["/image/toro/hs.jpeg"],
  서동성: ["/image/toro/ds.png"],
};

// 생일 축하 메시지 배열
// const shareMessages: string[] = [
//   `엔플라잉의 멋진 리더 승협아,
// 팬들에게 항상 힘이 되어줘서 고마워!
// 생일 축하해 💜

// #NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축

// `,
//   `승협아, 생일 축하해!
// 무대 위 너의 열정과 노력에 늘 감동이야.
// 올 한해도 더 빛나는 순간들로 가득하길! 💜

// #NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축

// `,

//   `이승협, 너의 생일을 진심으로 축하해!
// 팬들의 자랑이 되어줘서 고마워! 💜

// #NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축

// `,

//   `승협아, 생일 축하해!🎂
// 너의 음악과 따뜻한 마음 덕분에 힘을 얻고 있어,
// 네게도 항상 행복하고 멋진 일만 가득하길! 💜

// #NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축

// `,

//   `생일 축하해, 승협아!
// 너의 노력과 열정이 팬들에게 큰 힘이 돼.
// 최고의 리더가 되어줘서 정말 고마워! 🎂💜

// #NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축

// `,

//   `자랑스러운 승협아, 생일 축하해!
// 언제나 팬들에게 큰 힘이 되어줘서 고마워,
// 올 한해도 더 빛나는 순간들로 가득하길! 💜

// #NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축

// `,

//   `승협아, 생일 축하해!
// 너의 음악은 팬들에게 언제나 큰 힘이 돼.
// 오늘은 너의 날이야! 💜

// #NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축

// `,

//   `승협아, 생일 축하해!
// 언제나 너를 응원해.
// 멋진 하루가 되길! 💜

// #NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축

// `
// ];
// const shareMessages: string[] = [
//   `회승아, 생일 축하해! 🎉
// 네 목소리를 들을 때마다 내 하루가 더 빛나.
// 오늘도 행복한 순간들로 가득하길! 💙

// #NFlying #엔플라잉 #유회승 #승구 #생일축하 #엔피아`,

//   `우리 승구 생일 축하해! 🎂
// 언제나 최선을 다하는 너에게 고마워!
// 그 빛이 더욱 찬란하게 퍼지길 늘 응원할게! 💙

// #NFlying #엔플라잉 #유회승 #승구 #생일축하 #엔피아`,

//   `승구야, 너의 생일을 진심으로 축하해! 🎉
// 오늘도 행복한 순간들이 가득하길,
// 앞으로도 멋진 날들만 가득하길! 💙

// #NFlying #엔플라잉 #유회승 #승구 #생일축하 #엔피아`,

//   `생일 축하해, 회승아! 🎈
// 네 긍정적인 에너지가 항상 내게 힘이 돼.
// 오늘도 즐겁고 행복한 일들이 가득하길! 💙

// #NFlying #엔플라잉 #유회승 #승구 #생일축하 #엔피아`,

//   `우리 승구 생일 축하해! 🎉
// 너의 열정이 늘 주변을 따뜻하게 밝혀줘.
// 앞으로도 계속 응원할게! 행복한 하루 보내! 💙

// #NFlying #엔플라잉 #유회승 #승구 #생일축하 #엔피아`
// ];
const shareMessages: string[] = [
  `동성아, 생일 축하해! 🎉
네가 들려주는 베이스 연주 덕분에,
우리의 하루는 어느새 파란 배경처럼 아름다워졌어.
오늘은 네가 가장 예쁜 색으로 물드는 날이 되길💙

#NFlying #엔플라잉 #서동성 #막멩이 #생일축하해`,

  `동성아, 너의 생일을 진심으로 축하해! 🎉
저음으로 엔플라잉을 단단히 채워주는 네가 있어 든든해.
오늘 하루는 온전히 너만을 위한 무대 같기를💙

#NFlying #엔플라잉 #서동성 #막멩이 #생일축하해`,

  `생일 축하해, 동성아! 🎂
동성이의 미소는 늘 주변까지 기분 좋게 만들어줘☺️
오늘은 그 웃음이 더 많이 피어나기를💙

#NFlying #엔플라잉 #서동성 #막멩이 #생일축하해`,

  `막멩이 생일 축하해! 🎂 
가장 낮은 음에서 묵묵히 박동을 이어가는,
엔플라잉의 심장 같은 네가 있어서 늘 든든해.
너만의 리듬으로 마음껏 빛나는 하루가 되길 바랄게💙

#NFlying #엔플라잉 #서동성 #막멩이 #생일축하해`,

  `우리 막멩이 생일 축하해! 🎉 
동성이가 예쁘게 웃을 때마다,
내 하루도 함께 반짝이는 것 같아☺️
앞으로도 그 미소처럼 따뜻한 날들로 가득하길! 💙
 
#NFlying #엔플라잉 #서동성 #막멩이 #생일축하해`,
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
    const randomMessage =
      shareMessages[Math.floor(Math.random() * shareMessages.length)];
    const url = encodeURIComponent("https://nfimap.co.kr/");
    const text = encodeURIComponent(randomMessage);

    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank"
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
