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
} from '@mantine/core';
import { IconBubbleText } from '@tabler/icons-react';
import useInit from '../../../hooks/init.hook';
import useLetterApi from '../../../api/letter.api';
import { useDisclosure } from '@mantine/hooks';
import FloatingButton from '../../../components/button/floating/floating.button';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PresignedImage from '@/components/image/presigned/presigned.image';

const LetterPage = () => {
  const { letter, getLetter } = useLetterApi();
  const router = useRouter();
  const { id: letterId } = router.query;
  const [opened, { open, close }] = useDisclosure(false);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {};

  useInit({
    apis: [() => letterId && getLetter(Number(letterId))],
  });

  return (
    <>
      <Container
        w="100%"
        h="100%"
        display="flex"
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        {letter?.letter?.path && (
          <PresignedImage
            width={`${letter?.letter?.width}px`}
            height={`${letter?.letter?.height}px`}
            path={letter?.letter?.path}
          />
        )}
        <FloatingButton onClick={open} icon={<IconBubbleText />} />
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
              {letter?.comments?.map((comment, idx) => (
                <List.Item key={idx}>
                  <Text weight={500}>{comment.name}</Text>
                  <Text>{comment.body}</Text>
                </List.Item>
              ))}
            </List>
            <Grid pos="absolute" bottom={0} left={0} right={0} p={10}>
              <TextInput
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button onClick={handleSubmit}>Submit</Button>
            </Grid>
          </Box>
        </Drawer>
      </Container>
    </>
  );
};

export default LetterPage;
