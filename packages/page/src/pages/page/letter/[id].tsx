'use client';

import { Container, Drawer, Image } from '@mantine/core';
import { IconBubbleText } from '@tabler/icons-react';
import useInit from '../../../hooks/init.hook';
import useLetterApi from '../../../api/letter.api';
import { useDisclosure } from '@mantine/hooks';
import FloatingButton from '../../../components/button/floating/floating.button';
import { useRouter } from 'next/router';
import useImageApi from '@/api/image.api';
import { useEffect } from 'react';
import PresignedImage from '@/components/image/presigned/presigned.image';

const LetterPage = () => {
  const { letter, getLetter } = useLetterApi();
  const router = useRouter();
  const { id: letterId } = router.query;
  const [opend, { open, close }] = useDisclosure(false);
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
          opened={opend}
          onClose={close}
          title="댓글"
        >
          <p>abc</p>
        </Drawer>
      </Container>
    </>
  );
};

export default LetterPage;
