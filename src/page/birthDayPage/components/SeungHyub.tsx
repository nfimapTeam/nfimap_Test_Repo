import React from 'react';
import { Box, Image, Text, VStack, Heading, chakra, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

// Chakra UI의 Box 컴포넌트를 Framer Motion과 함께 사용
const MotionBox = chakra(motion.div);

// 애니메이션 variants
const variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// 큰 이미지 슬라이드 애니메이션
const largeImageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } }
};

const SeungHyub = () => {
  return (
    <VStack spacing={10} py={10} px={5}>
      {/* 생일 축하 헤더 */}
      <MotionBox
        initial="hidden"
        whileInView="visible"
        variants={variants}
        textAlign="center"
        w="100%"
      >
        <Heading fontSize={['3xl', '4xl', '5xl']} color="teal.500">
          생일 축하합니다, 승협님!
        </Heading>
        <Text fontSize={['lg', 'xl', '2xl']} color="gray.500" mt={4}>
          오늘은 당신의 특별한 날입니다! 🎉
        </Text>
      </MotionBox>

      {/* 이미지 섹션 */}
      <MotionBox
        initial="hidden"
        whileInView="visible"
        variants={largeImageVariants}
        w="100%"
        display="flex"
        justifyContent="center"
      >
        <Image
          src="/image/seunghyub/seunghyub1.jpg"
          alt="생일 축하 이미지"
          borderRadius="full"
          boxSize={['200px', '300px', '400px']}
          objectFit="cover"
        />
      </MotionBox>

      {/* 메시지 섹션 */}
      <MotionBox
        initial="hidden"
        whileInView="visible"
        variants={variants}
        textAlign="center"
        w="100%"
      >
        <Text fontSize={['lg', 'xl', '2xl']} color="gray.600">
          승협님과 함께한 모든 순간이 소중합니다. 항상 행복하시길 바래요!
        </Text>
        <Text fontSize={['md', 'lg', 'xl']} color="gray.500" mt={2}>
          가족과 친구들이 사랑과 웃음으로 가득한 날이 되시길 바랍니다. 🎂
        </Text>
      </MotionBox>

      {/* 추가 이미지 섹션 1 */}
      <MotionBox
        initial="hidden"
        whileInView="visible"
        variants={largeImageVariants}
        w="100%"
        display="flex"
        justifyContent="center"
      >
        <Image
          src="/image/seunghyub/seunghyub2.jpg"
          alt="친구들과 함께한 사진"
          borderRadius="md"
          boxSize={['200px', '300px', '400px']}
          objectFit="cover"
        />
      </MotionBox>

      {/* 추가 섹션: 축하 카드 이미지 */}
      <MotionBox
        initial="hidden"
        whileInView="visible"
        variants={variants}
        textAlign="center"
        w="100%"
      >
        <Heading fontSize={['2xl', '3xl', '4xl']} color="purple.500" mt={8}>
          당신을 위해 준비한 특별한 선물 🎁
        </Heading>
        <Image
          src="/image/seunghyub/birthday_card.jpg"
          alt="생일 축하 카드"
          borderRadius="md"
          boxSize={['200px', '400px', '500px']}
          mt={6}
          shadow="lg"
        />
      </MotionBox>

      {/* 추가 메시지 섹션 2 */}
      <MotionBox
        initial="hidden"
        whileInView="visible"
        variants={variants}
        textAlign="center"
        w="100%"
      >
        <Text fontSize={['lg', 'xl', '2xl']} color="gray.600" mt={10}>
          우리 모두는 승협님의 열정과 꿈을 존경합니다.
        </Text>
        <Text fontSize={['md', 'lg', 'xl']} color="gray.500" mt={2}>
          앞으로도 당신의 모든 목표가 이루어지길 응원합니다! 🎯
        </Text>
      </MotionBox>

      {/* 친구들의 축하 메시지 섹션 */}
      <MotionBox
        initial="hidden"
        whileInView="visible"
        variants={variants}
        textAlign="center"
        w="100%"
        mt={12}
      >
        <Heading fontSize={['xl', '2xl', '3xl']} color="pink.400">
          친구들의 축하 메시지 🎉
        </Heading>
        <HStack spacing={6} mt={8} wrap="wrap" justifyContent="center">
          <Box w="250px" h="150px" bg="gray.100" p={4} borderRadius="lg" shadow="md">
            <Text>"승협아, 생일 너무 축하해! 올해도 멋진 일들만 가득하길!"</Text>
            <Text fontWeight="bold" mt={2}>- 민수</Text>
          </Box>
          <Box w="250px" h="150px" bg="gray.100" p={4} borderRadius="lg" shadow="md">
            <Text>"함께한 시간이 벌써 이렇게 됐네. 늘 고마워! 생일 축하해."</Text>
            <Text fontWeight="bold" mt={2}>- 지영</Text>
          </Box>
          <Box w="250px" h="150px" bg="gray.100" p={4} borderRadius="lg" shadow="md">
            <Text>"승협아, 생일 축하해! 너와 함께한 모든 시간이 소중해."</Text>
            <Text fontWeight="bold" mt={2}>- 수현</Text>
          </Box>
        </HStack>
      </MotionBox>

      {/* 추가 이미지 섹션 3 */}
      <MotionBox
        initial="hidden"
        whileInView="visible"
        variants={largeImageVariants}
        w="100%"
        display="flex"
        justifyContent="center"
        mt={16}
      >
        <Image
          src="/image/seunghyub/seunghyub_party.jpg"
          alt="생일 파티 이미지"
          borderRadius="md"
          boxSize={['250px', '350px', '500px']}
          objectFit="cover"
        />
      </MotionBox>

      {/* 마지막 섹션: 감사의 말 */}
      <MotionBox
        initial="hidden"
        whileInView="visible"
        variants={variants}
        textAlign="center"
        w="100%"
        mt={12}
      >
        <Heading fontSize={['2xl', '3xl', '4xl']} color="teal.600">
          승협님의 존재에 감사드립니다! 💖
        </Heading>
        <Text fontSize={['lg', 'xl', '2xl']} color="gray.500" mt={6}>
          당신이 우리에게 얼마나 큰 의미를 주는지 모를 거예요. 항상 곁에 있어줘서 고마워요.
        </Text>
        <Text fontSize={['md', 'lg', 'xl']} color="gray.500" mt={2}>
          앞으로도 행복한 나날이 가득하길 진심으로 기원합니다. 🌟
        </Text>
      </MotionBox>
    </VStack>
  );
};

export default SeungHyub;
