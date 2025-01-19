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
} from '@mantine/core';
import { IconBubbleText, IconShare } from '@tabler/icons-react';
import useInit from '../../../hooks/init.hook';
import useLetterApi from '../../../api/letter.api';
import { useDisclosure } from '@mantine/hooks';
import FloatingButton from '../../../components/button/floating/floating.button';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import PresignedImage from '@/components/image/presigned/presigned.image';

declare global {
  interface Window {
    Kakao: any;
  }
}

const LetterPage = () => {
  const { letter, getLetter, addComment, comments, getLetterComments } =
    useLetterApi();
  const router = useRouter();
  const { id: letterId } = router.query;
  const [opened, { open, close }] = useDisclosure(false);
  const [commentForm, setCommentForm] = useState({
    content: '',
    editor: '',
    password: '',
  });

  useEffect(() => {
    if (!letterId) return;
    getLetter(Number(letterId));
    getLetterComments(Number(letterId));
  }, [letterId]);

  useEffect(() => {
    // 카카오 SDK 초기화
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);
    }
  }, []);

  const handleKakaoShare = () => {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '초대장이 도착했습니다!',
        description: letter?.letter.title,
        imageUrl: letter?.letter?.path,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: '초대장 보기',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
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
    // getLetter(Number(letterId));
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
          onClick={handleKakaoShare}
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
            <List style={{ flexGrow: 1, overflowY: 'auto' }}>
              {comments
                ? comments.comments.map((comment, idx) => (
                    <List.Item key={idx}>
                      <Text weight={500}>{comment.editor}</Text>
                      <Text>{comment.body}</Text>
                    </List.Item>
                  ))
                : null}
            </List>
            <Stack p={10}>
              <TextInput
                placeholder="닉네임"
                value={commentForm.editor}
                onChange={(e) =>
                  setCommentForm({ ...commentForm, editor: e.target.value })
                }
              />
              <PasswordInput
                placeholder="비밀번호"
                value={commentForm.password}
                onChange={(e) =>
                  setCommentForm({ ...commentForm, password: e.target.value })
                }
              />
              <TextInput
                placeholder="댓글을 입력하세요..."
                value={commentForm.content}
                onChange={(e) =>
                  setCommentForm({ ...commentForm, content: e.target.value })
                }
              />
              <Button onClick={handleSubmit} fullWidth>
                댓글 작성
              </Button>
            </Stack>
          </Box>
        </Drawer>
      </Container>
    </>
  );
};

export default LetterPage;
