import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Textarea,
  Input,
  Button,
  Text,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useToast
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { FaRegPaperPlane } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface Comment {
  id: string;
  text: string;
  createdAt: Date;
  password: string;
}

const Comments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentPassword, setCommentPassword] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleAddComment = () => {
    if (!newComment.trim() || !commentPassword.trim()) {
      toast({
        title: "입력 오류",
        description: "댓글과 비밀번호를 입력해주세요",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (commentPassword.length < 4 || commentPassword.length > 6) {
      toast({
        title: "비밀번호 오류",
        description: "비밀번호는 4~6자리로 입력해주세요",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const newCommentObj: Comment = {
      id: `comment_${Date.now()}`,
      text: newComment,
      createdAt: new Date(),
      password: commentPassword,
    };

    setComments([...comments, newCommentObj]);
    setNewComment('');
    setCommentPassword('');
  };

  const handleDeleteComment = () => {
    const commentToDelete = comments.find(c => c.id === selectedCommentId);

    if (commentToDelete && commentToDelete.password === deletePassword) {
      setComments(comments.filter(c => c.id !== selectedCommentId));
      onClose();
      setDeletePassword('');
      toast({
        title: "삭제 완료",
        description: "댓글이 삭제되었습니다",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "삭제 실패",
        description: "비밀번호가 일치하지 않습니다",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const openDeleteModal = (commentId: string) => {
    setSelectedCommentId(commentId);
    onOpen();
  };

  return (
    <>
      <VStack spacing={6} mt={10}>
        {/* Input Section */}
        <Flex
          w="full"
          bg="white"
          p={5}
          borderRadius="lg"
          borderWidth={1}
          borderColor="gray.200"
        >
          <VStack w="full" spacing={4}>
            <Flex w="100%" gap={2} justifyContent="space-between" alignItems="center">
              <Text fontSize="lg" fontWeight="bold">댓글</Text>
              <Flex alignItems="center" w="260px" gap={2}>
                <Input
                  type="password"
                  value={commentPassword}
                  onChange={(e) => setCommentPassword(e.target.value)}
                  placeholder="비밀번호 (4~6자리)"
                  maxLength={6} // 최대 6자리
                  flex={1}
                  borderColor="gray.300"
                  _focus={{ borderColor: "blue.300", boxShadow: "outline" }}
                  h="36px"
                />
                <Button
                  bg="brand.sub2"
                  _hover={{ bg: "brand.main" }}
                  color="white"
                  onClick={handleAddComment}
                  rightIcon={<FaRegPaperPlane />}
                >
                  등록
                </Button>
              </Flex>
            </Flex>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요"
              size="md"
              borderRadius="lg"
              resize="none"
              rows={4}
              borderColor="gray.300"
              _focus={{ borderColor: "blue.300", boxShadow: "outline" }}
            />
          </VStack>
        </Flex>

        {/* Comments List */}
        <VStack w="full" spacing={4}>
          {comments.length === 0 ? (
            <Box
              w="full"
              textAlign="center"
              py={10}
              bg="white"
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
            >
              <Text color="gray.500">아직 댓글이 없습니다</Text>
            </Box>
          ) : (
            comments.map((comment, index) => (
              <Flex
                key={comment.id}
                w="full"
                bg="white"
                p={4}
                borderRadius="lg"
                alignItems="center"
                justifyContent="space-between"
                border="1px solid"
                borderColor="gray.200"
              >
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontSize="sm" color="gray.500">엔피아 {index + 1}</Text>
                  <Text>{comment.text}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {dayjs(comment.createdAt).fromNow()}
                  </Text>
                </VStack>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => openDeleteModal(comment.id)}
                >
                  <FaRegTrashCan />
                </Button>
              </Flex>
            ))
          )}
        </VStack>
      </VStack>

      {/* Delete Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>댓글 삭제</ModalHeader>
          <ModalBody>
            <Input
              type="password"
              placeholder="비밀번호 입력"
              maxLength={6} // 최대 6자리 제한
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              취소
            </Button>
            <Button colorScheme="red" onClick={handleDeleteComment}>
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Comments;
