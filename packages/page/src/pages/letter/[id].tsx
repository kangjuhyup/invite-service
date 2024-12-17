import { Container, Drawer, Image } from '@mantine/core';
import { IconBubbleText } from '@tabler/icons-react';
import useInit from '../../hooks/init.hook';
import useLetterApi from '../../api/letter.api';
import { useDisclosure } from '@mantine/hooks';
import FloatingButton from '../../components/button/floating/floating.button';
import { useRouter } from 'next/router';

const LetterPage = () => {
  const { letter, getLetterMock: getLetter } = useLetterApi();
  const router = useRouter();
  const { id: letterId } = router.query;
  const [opend, { open, close }] = useDisclosure(false);
  useInit({ apis: [() => letterId && getLetter(Number(letterId))] });

  return (
    <>
      <Container w="100%" h="100%">
        <Image src={letter?.img || ''} />
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
