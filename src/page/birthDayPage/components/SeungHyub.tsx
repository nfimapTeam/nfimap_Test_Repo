import React from 'react';
import { Box, Image, Text, VStack, Heading, chakra, HStack, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = chakra(motion.div);

const variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const largeImageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } }
};

const SeungHyub = () => {
  // Mocked list of songs SeungHyub wrote or composed
  const songs = [
    { title: 'Awesome Song 1', year: 2019 },
    { title: 'Amazing Melody', year: 2020 },
    { title: 'Best Lyrics Ever', year: 2021 },
  ];

  return (
    <VStack spacing={10} py={10} px={5}>
      {/* Birthday Header */}
      <MotionBox
        initial="hidden"
        whileInView="visible"
        variants={variants}
        textAlign="center"
        w="100%"
      >
        <Heading fontSize={['3xl', '4xl', '5xl']} color="teal.500">
          승협님, 생일 축하합니다! 💫
        </Heading>
        <Text fontSize={['lg', 'xl', '2xl']} color="gray.500" mt={4}>
          오늘은 우리에게 너무나 소중한 승협님의 특별한 날입니다! 🎉
        </Text>
      </MotionBox>

      {/* Image Section */}
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

      {/* Message Section */}
      <MotionBox
        initial="hidden"
        whileInView="visible"
        variants={variants}
        textAlign="center"
        w="100%"
      >
        <Text fontSize={['lg', 'xl', '2xl']} color="gray.600">
          언제나 팬들의 곁에서 환한 미소와 따뜻한 마음을 나눠주시는 승협님, 정말 감사합니다.
        </Text>
        <Text fontSize={['md', 'lg', 'xl']} color="gray.500" mt={2}>
          오늘 하루는 팬들이 보내는 사랑과 응원으로 가득하시길 바랍니다! 💖
        </Text>
      </MotionBox>

      {/* Additional Image Section */}
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
          alt="무대 위의 승협님"
          borderRadius="md"
          boxSize={['200px', '300px', '400px']}
          objectFit="cover"
        />
      </MotionBox>

      {/* Song List Section */}
      <MotionBox
        initial="hidden"
        whileInView="visible"
        variants={variants}
        textAlign="center"
        w="100%"
      >
        <Heading fontSize={['2xl', '3xl', '4xl']} color="purple.500" mt={8}>
          작사 작곡한 노래들 🎶
        </Heading>
        <VStack mt={4} spacing={3}>
          {songs.map((song, index) => (
            <Text key={index} fontSize={['lg', 'xl', '2xl']} color="gray.600">
              {song.title} - {song.year}
            </Text>
          ))}
        </VStack>
      </MotionBox>

      {/* Birthday Surprise Event */}
      <MotionBox
        initial="hidden"
        whileInView="visible"
        variants={variants}
        textAlign="center"
        w="100%"
      >
        <Heading fontSize={['2xl', '3xl', '4xl']} color="pink.400" mt={10}>
          생일 특별 이벤트 🎈
        </Heading>
        <Button
          as={motion.button}
          colorScheme="pink"
          mt={6}
          px={8}
          py={6}
          fontSize="lg"
          whileHover={{ scale: 1.1 }}
          onClick={() => alert('생일 축하해요, 승협님! 🎉')}
        >
          클릭하면 깜짝 축하가! 🎉
        </Button>
      </MotionBox>

      {/* Final Message Section */}
      <MotionBox
        initial="hidden"
        whileInView="visible"
        variants={variants}
        textAlign="center"
        w="100%"
        mt={12}
      >
        <Heading fontSize={['2xl', '3xl', '4xl']} color="teal.600">
          우리 모두에게 빛이 되어주는 승협님께 감사합니다! 🌟
        </Heading>
        <Text fontSize={['lg', 'xl', '2xl']} color="gray.500" mt={6}>
          팬들과 함께 걸어가주셔서 고마워요. 항상 응원할게요!
        </Text>
        <Text fontSize={['md', 'lg', 'xl']} color="gray.500" mt={2}>
          더 많은 추억을 함께 만들어가요! 🎶
        </Text>
      </MotionBox>
    </VStack>
  );
};

export default SeungHyub;
