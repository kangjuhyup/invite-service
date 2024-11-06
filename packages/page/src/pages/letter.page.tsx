import { Container, Drawer, Image } from '@mantine/core';
import FloatingButton from '../components/floating.button';
import { IconBubbleText } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';
import useInit from '../hooks/init.hook';
import useLetterApi from '../api/letter.api';
import { useDisclosure } from '@mantine/hooks';

const LetterPage = () => {
    const { letter, getLetterMock:getLetter } = useLetterApi();
    const { letterId } = useParams<{ letterId: string }>();
    const [opend, {open,close}] = useDisclosure(false);
    useInit({ apis: [() => letterId && getLetter(Number(letterId))] });

    return (
    <>
        <Container>
            <Image
                src={letter?.img || ''}
            />
            <FloatingButton onClick={open} icon={<IconBubbleText/>}/>
        <Drawer size='xl' offset={8} radius='md' position='bottom' opened={opend} onClose={close} title="댓글">
            <p>abc</p> 
        </Drawer>
        </Container>
    </> 
    )
}

export default LetterPage;