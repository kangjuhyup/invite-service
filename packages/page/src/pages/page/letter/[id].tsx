'use client';

import {
  Container,
  Drawer,
  List,
  Text,
  TextInput,
  Button,
  Box,
  Grid,
  PasswordInput,
  Stack,
  rem,
  Group,
  ActionIcon,
  Modal,
} from '@mantine/core';
import {
  IconBubbleText,
  IconShare,
  IconMessageCircle,
  IconTrash,
} from '@tabler/icons-react';
import useLetterApi from '../../../api/letter.api';
import { useDisclosure } from '@mantine/hooks';
import FloatingButton from '../../../components/button/floating/floating.button';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import PresignedImage from '@/components/image/presigned/presigned.image';
import { useShare } from '@/hooks/share.hook';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH
  ? `/${process.env.NEXT_PUBLIC_BASE_PATH}`
  : '';

declare global {
  interface Window {
    Kakao: any;
  }
}

const LetterPage = () => {
  const {
    letter,
    getLetter,
    addComment,
    comments,
    getLetterComments,
    deleteComment,
  } = useLetterApi();
  const router = useRouter();
  const { id: letterId, token } = router.query;
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(
    null,
  );
  const [commentForm, setCommentForm] = useState({
    content: '',
    editor: '',
    password: '',
  });
  const { handleKakaoShare } = useShare();

  useEffect(() => {
    if (!letterId) return;
    getLetter(Number(letterId), token as string);
    getLetterComments(Number(letterId));
  }, [letterId]);

  useEffect(() => {
    const initKakao = async () => {
      try {
        const response = await fetch(`${basePath}/api/kakao/key`);
        const data = await response.json();
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(data.key);
        }
      } catch (error) {
        console.error('Failed to initialize Kakao SDK:', error);
      }
    };
    initKakao();
  }, []);

  const handleShare = () => {
    if (!letter?.letter) return;
    handleKakaoShare({
      title: '초대장이 도착했습니다!',
      description: letter.letter.title,
      imageUrl: letter.letter.path,
      url:
        window.location.href +
        (letter.publicYn === false && letter.password
          ? `?token=${letter.password}&isView=true`
          : 'isView=true'),
    });
  };

  const handleSubmit = async () => {
    if (!letterId) return;
    await addComment(Number(letterId), {
      content: commentForm.content,
      editor: commentForm.editor,
      password: commentForm.password,
    });
    setCommentForm({
      content: '',
      editor: '',
      password: '',
    });
    getLetterComments(Number(letterId));
  };

  const handleDelete = async () => {
    if (!selectedCommentId) return;

    await deleteComment(selectedCommentId, deletePassword);
    await getLetterComments(Number(letterId));
    setDeleteModalOpened(false);
    setDeletePassword('');
    setSelectedCommentId(null);
  };

  const openDeleteModal = (commentId: number) => {
    setSelectedCommentId(commentId);
    setDeleteModalOpened(true);
  };

  return (
    <>
      <Container
        w="100vw"
        h="100vh"
        p={0}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {letter?.letter?.path && (
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <PresignedImage
              width={`${letter?.letter?.width}px`}
              height={`${letter?.letter?.height}px`}
              path={letter?.letter?.path}
              style={{
                objectFit: 'contain',
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />
          </Box>
        )}
        <FloatingButton
          onClick={handleShare}
          icon={<IconShare />}
          bottom={20}
          right={100}
        />

        <FloatingButton
          onClick={open}
          icon={<IconBubbleText />}
          bottom={20}
          right={20}
        />
        <Drawer
          size="xl"
          offset={8}
          radius="md"
          position="bottom"
          opened={opened}
          onClose={close}
          title="댓글"
        >
          <Box display={'flex'} flexDirection={'column'} h={'100%'}>
            <List
              style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '80px' }}
              spacing="xs"
              icon={
                <IconMessageCircle
                  style={{ width: rem(16), height: rem(16) }}
                  color="var(--mantine-color-blue-filled)"
                />
              }
            >
              {comments
                ? comments.comments.map((comment, idx) => (
                    <List.Item key={idx} style={{ padding: '10px' }}>
                      <Box
                        style={{
                          padding: '15px',
                          backgroundColor: 'var(--mantine-color-gray-0)',
                          borderRadius: 'var(--mantine-radius-sm)',
                        }}
                      >
                        <Group justify="space-between" align="flex-start">
                          <div>
                            <Text size="sm" fw={700} c="blue" mb={5}>
                              {comment.editor}
                            </Text>
                            <Text size="sm">{comment.body}</Text>
                          </div>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => openDeleteModal(comment.id)}
                          >
                            <IconTrash
                              style={{ width: rem(16), height: rem(16) }}
                            />
                          </ActionIcon>
                        </Group>
                      </Box>
                    </List.Item>
                  ))
                : null}
            </List>
            <Box
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '10px',
                background: 'var(--mantine-color-body)',
                borderTop: '1px solid var(--mantine-color-gray-3)',
              }}
            >
              <Grid gutter="xs">
                <Grid.Col span={6}>
                  <TextInput
                    placeholder="닉네임"
                    value={commentForm.editor}
                    onChange={(e) =>
                      setCommentForm({ ...commentForm, editor: e.target.value })
                    }
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <PasswordInput
                    placeholder="비밀번호"
                    value={commentForm.password}
                    onChange={(e) =>
                      setCommentForm({
                        ...commentForm,
                        password: e.target.value,
                      })
                    }
                  />
                </Grid.Col>
                <Grid.Col span={9}>
                  <TextInput
                    placeholder="댓글을 입력하세요..."
                    value={commentForm.content}
                    onChange={(e) =>
                      setCommentForm({
                        ...commentForm,
                        content: e.target.value,
                      })
                    }
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <Button onClick={handleSubmit} fullWidth h="100%">
                    작성
                  </Button>
                </Grid.Col>
              </Grid>
            </Box>
          </Box>
        </Drawer>
        <Modal
          opened={deleteModalOpened}
          onClose={() => {
            setDeleteModalOpened(false);
            setDeletePassword('');
            setSelectedCommentId(null);
          }}
          title="댓글 삭제"
          centered
        >
          <Stack>
            <Text size="sm">댓글을 삭제하려면 비밀번호를 입력하세요.</Text>
            <PasswordInput
              placeholder="비밀번호"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            <Group justify="flex-end">
              <Button
                variant="outline"
                onClick={() => setDeleteModalOpened(false)}
              >
                취소
              </Button>
              <Button color="red" onClick={handleDelete}>
                삭제
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Container>
    </>
  );
};

export default LetterPage;
