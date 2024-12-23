'use client';

import { useState } from 'react';
import { AppShell, Button, Container, Grid } from '@mantine/core';
import { DropzoneButton } from '../../components/button/dropzone/dropzone.button';
import { FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import MoveResizeImage from '../../components/image/move/move.resize.image';
import {
  IconDeviceFloppy,
  IconPencil,
  IconSticker,
  IconTextGrammar,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import MoveResizeText from '../../components/text/move/move.resize.text';

const CreatePage = () => {
  const [files, setFiles] = useState<
    {
      file: FileWithPath;
      size: { width: number; height: number };
      position: { x: number; y: number };
    }[]
  >([]);
  const [texts, setTexts] = useState<
    {
      text: string;
      position: { x: number; y: number };
      size: { width: number; height: number };
    }[]
  >([]);
  const [opened, { toggle }] = useDisclosure();
  const handleDrop = (newFiles: FileWithPath[]) => {
    const newer = newFiles.map((f) => ({
      file: f,
      size: { width: 200, height: 200 },
      position: { x: 0, y: 0 },
    }));
    setFiles((prevFiles) => [...prevFiles, ...newer]); // 이전 상태에 새로운 파일 추가
  };
  const handleTextChange = (updatedText: {
    index: number;
    text: string;
    size: { width: number; height: number };
    position: { x: number; y: number };
  }) => {
    setTexts((prevTexts) =>
      prevTexts.map((t, index) =>
        index === updatedText.index ? { ...t, ...updatedText } : t,
      ),
    );
  };

  const handleSave = () => {
    // 이미지 정보와 텍스트 정보를 반환
    const imageData = files.map((file) => ({
      fileName: file.file.name,
      size: file.size,
      position: file.position,
    }));

    const textData = texts.map((text) => ({
      text: text.text,
      size: text.size,
      position: text.position,
    }));

    const result = {
      images: imageData,
      texts: textData,
    };

    console.log(result);
    return result;
  };

  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 50 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Button onClick={handleSave}>
          <IconDeviceFloppy />
        </Button>
      </AppShell.Header>
      <AppShell.Main>
        <Container
          style={{
            backgroundColor: 'blue',
            flex: 1,
            overflow: 'hidden', // 이미지가 Container를 초과하지 않도록 설정
          }}
        >
          {files.map((fileInfo, index) => (
            <MoveResizeImage
              key={fileInfo.file.name}
              fileInfo={fileInfo}
              onUpdate={(data) => {
                setFiles((prevFiles) =>
                  prevFiles.map((f, i) =>
                    i === index ? { ...f, ...data } : f,
                  ),
                );
              }}
            />
          ))}
          {texts.map((text, index) => {
            return <MoveResizeText index={index} onUpdate={handleTextChange} />;
          })}
        </Container>
      </AppShell.Main>
      <AppShell.Footer>
        <Grid flex={1}>
          <Grid.Col h={'100%'} span={3} bg={'red'}>
            <DropzoneButton
              onDrop={handleDrop}
              mimeTypes={[MIME_TYPES.png, MIME_TYPES.gif, MIME_TYPES.jpeg]}
            />
          </Grid.Col>
          <Grid.Col h={'100%'} span={3} bg={'blue'}>
            <Button
              onClick={() =>
                setTexts((prevTexts) => [
                  ...prevTexts,
                  {
                    text: 'Text...',
                    size: { width: 18, height: 18 },
                    position: { x: 100, y: 100 },
                  },
                ])
              }
            >
              <IconTextGrammar />
            </Button>
          </Grid.Col>
          <Grid.Col h={'100%'} span={3} bg={'green'}>
            <IconSticker />
          </Grid.Col>
          <Grid.Col h={'100%'} span={3} bg={'yellow'}>
            <IconPencil />
          </Grid.Col>
        </Grid>
      </AppShell.Footer>
    </AppShell>
  );
};

export default CreatePage;
