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
  Flex,
  Button,
} from "@chakra-ui/react";
import { RiTwitterXLine } from "@remixicon/react";

type Member = { name: string; date: string };

const getTodayDate = () => {
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${month}-${day}`;
};

const Birthday = () => {
  // 모든 멤버별 생일 메시지 객체
  const allMemberMessages: { [key: string]: string[] } = {
    이승협: [
      `엔플라잉의 멋진 리더 승협아,
팬들에게 항상 힘이 되어줘서 고마워!
생일 축하해 💜

#NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축`,
      `승협아, 생일 축하해!
무대 위 너의 열정과 노력에 늘 감동이야.
올 한해도 더 빛나는 순간들로 가득하길! 💜

#NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축`,
      `이승협, 너의 생일을 진심으로 축하해!
팬들의 자랑이 되어줘서 고마워! 💜

#NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축`,
      `승협아, 생일 축하해!🎂
너의 음악과 따뜻한 마음 덕분에 힘을 얻고 있어,
네게도 항상 행복하고 멋진 일만 가득하길! 💜

#NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축`,
      `생일 축하해, 승협아!
너의 노력과 열정이 팬들에게 큰 힘이 돼.
최고의 리더가 되어줘서 정말 고마워! 🎂💜

#NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축`,
      `자랑스러운 승협아, 생일 축하해!
언제나 팬들에게 큰 힘이 되어줘서 고마워,
올 한해도 더 빛나는 순간들로 가득하길! 💜

#NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축`,
      `승협아, 생일 축하해!
너의 음악은 팬들에게 언제나 큰 힘이 돼.
오늘은 너의 날이야! 💜

#NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축`,
      `승협아, 생일 축하해!
언제나 너를 응원해.
멋진 하루가 되길! 💜

#NFlying #엔플라잉 #이승협 #승짱 #제이던 #생축`,
    ],
    차훈: [
      `먐미😸 생일 축하해!🎉
훈이의 기타 선율 덕분에 우리의 매일이 더 특별해져!
오늘이 훈이에게도 특별한 하루가 되길 바랄게🫶

#NFlying #엔플라잉 #차훈 #먐미 #생일축하해
#한여름의_로망_훈이데이 #HAPPY_HUN_DAY`,

      `훈아, 생일 축하해! 🎂
섬세한 톤으로 엔플라잉을 이끌어주는 네가 있어 늘 든든해.
오늘도 우리 함께 가장 행복한 무대를 만들어가자😻

#NFlying #엔플라잉 #차훈 #먐미 #생일축하해
#한여름의_로망_훈이데이 #HAPPY_HUN_DAY`,

      `생일 축하해, 훈아! 😻
훈이의 다정함은 늘 우리에게 깊은 감동을 줘.
오늘은 우리가 훈이에게 더 많은 감동을 전할게!💙

#NFlying #엔플라잉 #차훈 #먐미 #생일축하해
#한여름의_로망_훈이데이 #HAPPY_HUN_DAY`,

      `먐미의 생일을 진심으로 축하해! 🎂
가장 멋진 리프로 무대를 채우는 기타 천재😸🎸
엔플라잉을 더욱 반짝이게 해주는 네가 자랑스러워!
80살까지 오래오래 엔플라잉의 감성을 부탁해🫶

#NFlying #엔플라잉 #차훈 #먐미 #생일축하해
#한여름의_로망_훈이데이 #HAPPY_HUN_DAY`,

      `우리 훈이 생일 축하해! 🎉
항상 아프지 말고 건강하게 오래도록 함께하자.
앞으로도 변함없이 훈이 곁에서 응원할게!
80살까지 웃음 가득한 날들로 채워가자😻

#NFlying #엔플라잉 #차훈 #먐미 #생일축하해
#한여름의_로망_훈이데이 #HAPPY_HUN_DAY`,
    ],
    김재현: [
      `째혀나🐶 생일 축하해!🎉

재현이의 드럼 비트 덕분에 엔피아들 심장도 둥둥🥁
오늘은 재현이 심장도 두근거릴 만큼 행복한 하루가 되길!

#NFlying #엔플라잉 #김재현 #짼 #생일축하해

#HAPPY_JAEHYUN_DAY
#꺼지지_않는_밝은_재현의_날`,

      `드럼맛집 재현이의 생일을 진심으로 축하해🥳

묵묵히 엔플라잉의 리듬을 이끌어줘서 고마워🥁
앞으로도 함께 잊지 못할 무대를 만들어가자🐶

#NFlying #엔플라잉 #김재현 #짼 #생일축하해

#HAPPY_JAEHYUN_DAY
#꺼지지_않는_밝은_재현의_날`,

      `엔피아 담당 비타민! 재현아 생일 축하해🐶

재현이의 밝은 에너지는 언제나 엔피아들에게 힘이 돼!
오늘은 우리가 재현이 에너지를 가득 충전해 줄게☀️

#NFlying #엔플라잉 #김재현 #짼 #생일축하해

#HAPPY_JAEHYUN_DAY
#꺼지지_않는_밝은_재현의_날`,

      `북치는 재현이의 생일을 축하합니다!🥁🎉

무대를 꽉 채우는 재현이의 리듬 덕분에 엔플라잉이 더 빛나✨
앞으로도 건강하고 행복하게 오래도록 함께하자💜

#NFlying #엔플라잉 #김재현 #짼 #생일축하해

#HAPPY_JAEHYUN_DAY
#꺼지지_않는_밝은_재현의_날`,

      `재현아, 생일을 진심으로 축하해! 🎂

언제나 엔피아만 생각하는 멋진 드러머, 재현이!
앞으로도 변함없이 곁에서 응원할게💜
80살까지 웃음 가득한 날들로 함께하자🐶
 
#NFlying #엔플라잉 #김재현 #짼 #생일축하해

#HAPPY_JAEHYUN_DAY
#꺼지지_않는_밝은_재현의_날`,
    ],
    유회승: [
      `회승아, 생일 축하해! 🎉
네 목소리를 들을 때마다 내 하루가 더 빛나.
오늘도 행복한 순간들로 가득하길! 💙

#NFlying #엔플라잉 #유회승 #승구 #생일축하 #엔피아`,

      `우리 승구 생일 축하해! 🎂
언제나 최선을 다하는 너에게 고마워!
그 빛이 더욱 찬란하게 퍼지길 늘 응원할게! 💙

#NFlying #엔플라잉 #유회승 #승구 #생일축하 #엔피아`,

      `승구야, 너의 생일을 진심으로 축하해! 🎉
오늘도 행복한 순간들이 가득하길,
앞으로도 멋진 날들만 가득하길! 💙

#NFlying #엔플라잉 #유회승 #승구 #생일축하 #엔피아`,

      `생일 축하해, 회승아! 🎈
네 긍정적인 에너지가 항상 내게 힘이 돼.
오늘도 즐겁고 행복한 일들이 가득하길! 💙

#NFlying #엔플라잉 #유회승 #승구 #생일축하 #엔피아`,

      `우리 승구 생일 축하해! 🎉
너의 열정이 늘 주변을 따뜻하게 밝혀줘.
앞으로도 계속 응원할게! 행복한 하루 보내! 💙

#NFlying #엔플라잉 #유회승 #승구 #생일축하 #엔피아`,
    ],
    서동성: [
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
    ],
  };

  const members: Member[] = [
    { name: "이승협", date: "10-31" },
    { name: "차훈", date: "07-12" },
    { name: "김재현", date: "07-15" },
    { name: "유회승", date: "02-26" },
    { name: "서동성", date: "04-09" },
  ];

  const images: { [key: string]: string[] } = {
    이승협: [
      // "/image/toro/seunghyub_01.webp",
      // "/image/toro/seunghyub_02.webp",
      // "/image/toro/seunghyub_03.webp",
      "/image/toro/seunghyub_04.webp",
    ],
    차훈: ["/image/toro/chahun.webp"],
    김재현: ["/image/toro/jaehyun.webp"],
    유회승: ["/image/toro/hs.webp"],
    서동성: ["/image/toro/ds.webp"],
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [birthdayMember, setBirthdayMember] = useState<Member | null>(null);
  const [randomImage, setRandomImage] = useState<string>("");
  const [randomMessage, setRandomMessage] = useState<string>("");
  const [doNotShowToday, setDoNotShowToday] = useState(false);
  const today = getTodayDate();

  useEffect(() => {
    const isBirthdayShown = sessionStorage.getItem("isBirthdayShown");

    if (!isBirthdayShown) {
      const member = members.find((member) => member.date === today);
      if (member) {
        setBirthdayMember(member);

        // 랜덤 이미지 선택
        const memberImages = images[member.name] || [];
        if (memberImages.length > 0) {
          setRandomImage(
            memberImages[Math.floor(Math.random() * memberImages.length)]
          );
        }

        // ✅ 변수명 변경: allMemberMessages 사용!
        const messages = allMemberMessages[member.name] || [];
        if (messages.length > 0) {
          setRandomMessage(
            messages[Math.floor(Math.random() * messages.length)]
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
                objectFit="contain"
                width="100%"
                maxH="400px"
                mx="auto"
                fallbackSrc="https://via.placeholder.com/300x400?text=Loading..."
                loading="lazy"
                srcSet={`
                  ${randomImage}?w=300 300w,
                  ${randomImage}?w=600 600w,
                  ${randomImage}?w=900 900w
                `}
                sizes="(max-width: 600px) 300px, (max-width: 900px) 600px, 900px"
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