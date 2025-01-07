'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ActionIcon,
  AppShell,
  Container,
  Grid,
  Group,
  Text,
} from '@mantine/core';
import { DropzoneButton } from '../../components/button/dropzone/dropzone.button';
import { FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import MoveResizeImage, {
  FileInfo,
} from '../../components/image/move/move.resize.image';
import {
  IconDeviceFloppy,
  IconSticker,
  IconTextGrammar,
} from '@tabler/icons-react';
import MoveResizeText, {
  TextInfo,
} from '../../components/text/move/move.resize.text';
import useLetterApi from '@/api/letter.api';
import useGenerateLetter from '@/hooks/generate.letter.hook';
import { useRouter } from 'next/router';

const CreatePage = () => {
  const router = useRouter();
  const backgroundRef = useRef<HTMLDivElement>(null);
  const { prepareUrls, getPrepareUrls, addLetter, postAddLetter } =
    useLetterApi();
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [texts, setTexts] = useState<TextInfo[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const handleDrop = (newFiles: FileWithPath[]) => {
    const newer = newFiles.map((f) => ({
      file: f,
      size: { width: 200, height: 200 },
      position: { x: 0, y: 0 },
    }));
    setFiles((prevFiles) => [...prevFiles, ...newer]); // 이전 상태에 새로운 파일 추가
  };

  const { generateLetter, resizeToThumbnail, dataURLToFile } =
    useGenerateLetter(backgroundRef, files, texts);

  const handleSave = async () => {
    if (!prepareUrls) return;
    const letterResult = await generateLetter();
    if (letterResult === undefined || letterResult === null) throw new Error();
    const letterFile = dataURLToFile(letterResult.letter, 'letter');
    const bgFile = dataURLToFile(letterResult.background, 'bg');
    const thumbnail = await resizeToThumbnail(letterResult.letter);
    const thumbnailFile = dataURLToFile(thumbnail, 'thumbnail');
    await fetch(prepareUrls.letterUrl, {
      method: 'PUT',
      body: letterFile,
      headers: {
        'Content-Type': 'image/png', // 이미지 MIME 타입
        'x-amz-meta-session': prepareUrls.sessionKey,
        'x-amz-meta-height': '600',
        'x-amz-meta-width': '400',
      },
    });
    await fetch(prepareUrls.thumbnailUrl, {
      method: 'PUT',
      body: thumbnailFile,
      headers: {
        'Content-Type': 'image/png', // 이미지 MIME 타입
        'x-amz-meta-session': prepareUrls.sessionKey,
        'x-amz-meta-height': '150',
        'x-amz-meta-width': '100',
      },
    });
    await fetch(prepareUrls.backgroundUrl, {
      method: 'PUT',
      body: bgFile,
      headers: {
        'Content-Type': 'image/png', // 이미지 MIME 타입
        'x-amz-meta-session': prepareUrls.sessionKey,
        'x-amz-meta-height': '600',
        'x-amz-meta-width': '400',
      },
    });
    await Promise.all(
      prepareUrls.componentUrls.map(async (componentUrl, idx) => {
        await fetch(componentUrl, {
          method: 'PUT',
          body: files[idx].file,
          headers: {
            'Content-Type': 'image/png', // 이미지 MIME 타입
            'x-amz-meta-session': prepareUrls.sessionKey,
            'x-amz-meta-height': `${files[idx].size.height}`,
            'x-amz-meta-width': `${files[idx].size.width}`,
            'x-amz-meta-angle': '0',
            'x-amz-meta-z': '0',
            'x-amz-meta-x': `${files[idx].position.x}`,
            'x-amz-meta-y': `${files[idx].position.y}`,
          },
        });
      }),
    );
    postAddLetter({
      category: 'LT001',
      title: '테스트',
      body: '테스트',
    });
  };

  const handlePrepare = async () => {
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

    getPrepareUrls({
      thumbnailMeta: {
        width: '100',
        height: '150',
      },
      letterMeta: {
        width: '400',
        height: '600',
      },
      backgroundMeta: {
        width: '400',
        height: '600',
      },
      componentMetas: imageData.map((image, idx) => {
        return {
          width: image.size.width.toString(),
          height: image.size.height.toString(),
          x: image.position.x.toString(),
          y: image.position.y.toString(),
          z: idx.toString(),
          angle: '0',
        };
      }),
    });
    return result;
  };

  const handleBackgroundChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    handleSave();
  }, [prepareUrls]);

  useEffect(() => {
    if (addLetter) router.replace(`/page/letter/${addLetter.letterId}`);
  }, [addLetter]);

  return (
    <>
      <Container
        style={{
          position: 'absolute', // 부모 기준 위치 설정
          top: '50%', // 화면의 50% 아래
          left: '50%', // 화면의 50% 오른쪽
          transform: 'translate(-50%, -50%)',

          width: '400px',
          height: '600px',
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleBackgroundChange}
          style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}
        />
        <div
          ref={backgroundRef}
          style={{
            position: 'absolute', // 부모 기준 위치 설정
            top: '50%', // 화면의 50% 아래
            left: '50%', // 화면의 50% 오른쪽
            transform: 'translate(-50%, -50%)',
            background: backgroundImage ? `url(${backgroundImage})` : 'blue',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            width: '400px',
            height: '600px',
          }}
        />
        {files.map((fileInfo, index) => (
          <MoveResizeImage
            key={fileInfo.file.name}
            fileInfo={fileInfo}
            onUpdate={(data) => {
              setFiles((prevFiles) =>
                prevFiles.map((f, i) => (i === index ? { ...f, ...data } : f)),
              );
            }}
          />
        ))}
        {texts.map((text, index) => {
          return (
            <MoveResizeText
              index={index}
              onUpdate={(text) => {
                setTexts((prevTexts) =>
                  prevTexts.map((t, i) =>
                    i === index ? { ...t, ...text } : t,
                  ),
                );
              }}
            />
          );
        })}
      </Container>
      <AppShell.Footer
        p="md"
        style={{
          // background: 'var(--mantine-color-dark-6)',
          borderTop: '1px solid var(--mantine-color-dark-4)',
        }}
      >
        <Grid>
          <Grid.Col span={3}>
            <Group justify="center">
              <DropzoneButton
                onDrop={handleDrop}
                mimeTypes={[MIME_TYPES.png, MIME_TYPES.gif, MIME_TYPES.jpeg]}
              />
              <Text>Drop Image</Text>
            </Group>
          </Grid.Col>

          <Grid.Col span={3}>
            <Group justify="center">
              <ActionIcon
                variant="light"
                color="blue"
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
                <IconTextGrammar style={{ width: '70%', height: '70%' }} />
              </ActionIcon>
              <Text>Input Text</Text>
            </Group>
          </Grid.Col>

          <Grid.Col span={3}>
            <Group justify="center">
              <ActionIcon variant="light" size="lg" color="blue">
                <IconSticker style={{ width: '70%', height: '70%' }} />
              </ActionIcon>
              <Text>Use Sticker</Text>
            </Group>
          </Grid.Col>

          <Grid.Col span={3}>
            <Group justify="center">
              <ActionIcon
                variant="light"
                color="blue"
                onClick={() => handlePrepare()}
              >
                <IconDeviceFloppy style={{ width: '70%', height: '70%' }} />
              </ActionIcon>
              <Text>Save</Text>
            </Group>
          </Grid.Col>
        </Grid>
      </AppShell.Footer>
    </>
  );
};

export default CreatePage;
