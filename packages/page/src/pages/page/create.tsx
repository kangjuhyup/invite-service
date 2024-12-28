'use client';

import { useEffect, useRef, useState } from 'react';
import { ActionIcon, AppShell, Container, Flex, Grid } from '@mantine/core';
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
import { toPng } from 'html-to-image';

const CreatePage = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const { prepareUrls, getPrepareUrls, addLetter, postAddLetter } =
    useLetterApi();
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [texts, setTexts] = useState<TextInfo[]>([]);
  const handleDrop = (newFiles: FileWithPath[]) => {
    const newer = newFiles.map((f) => ({
      file: f,
      size: { width: 200, height: 200 },
      position: { x: 0, y: 0 },
    }));
    setFiles((prevFiles) => [...prevFiles, ...newer]); // 이전 상태에 새로운 파일 추가
  };

  const generateLetter = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context not available');
    }
    if (!backgroundRef.current) return;
    const backgroundImage = await toPng(backgroundRef.current);
    const { offsetHeight: bgHeight, offsetWidth: bgWidth } =
      backgroundRef.current;
    canvas.width = bgWidth;
    canvas.height = bgHeight;
    const bg = new Image();
    bg.src = backgroundImage;
    return new Promise<Record<string, any> | null>((resolve, reject) => {
      bg.onload = async () => {
        // 배경 이미지 그리기
        ctx.drawImage(bg, 0, 0, bgWidth, bgHeight);

        // 이미지 로드 및 그리기
        const imagePromises = files.map(({ file, size, position }) => {
          return new Promise<void>((imageResolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
              ctx.drawImage(
                img,
                position.x,
                position.y,
                size.width,
                size.height,
              );
              imageResolve();
            };
          });
        });

        // 텍스트 그리기
        const textPromises = texts.map(({ text, position, size }) => {
          return new Promise<void>((textResolve) => {
            ctx.font = `${size.width / 10}px Arial`;
            ctx.fillStyle = 'black';
            ctx.fillText(text, position.x, position.y);
            textResolve();
          });
        });

        // 모든 작업이 끝난 후 finalImage 생성
        await Promise.all([...imagePromises, ...textPromises]);
        const finalImage = canvas.toDataURL('image/png');
        resolve({
          letter: finalImage,
          background: imageToDataURL(bg),
        });
      };

      bg.onerror = () => reject('초대장 생성 실패.');
    });
  };

  const imageToDataURL = (image: HTMLImageElement): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    // Canvas 크기 설정
    canvas.width = image.width;
    canvas.height = image.height;

    // Canvas에 이미지 그리기
    ctx.drawImage(image, 0, 0);

    // Base64 데이터 반환
    return canvas.toDataURL('image/png');
  };

  const resizeToThumbnail = async (base64Image: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64Image;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('Canvas context not available');
          return;
        }
        canvas.width = 100;
        canvas.height = 150;
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 100, 150);
        const thumbnailBase64 = canvas.toDataURL('image/png');
        resolve(thumbnailBase64);
      };
      img.onerror = () => {
        reject('썸네일 생성 실패');
      };
    });
  };

  const dataURLToFile = (dataURL: string, fileName: string): File => {
    const [metadata, base64Data] = dataURL.split(',');
    const mime = metadata.match(/:(.*?);/)?.[1] || 'image/png';

    const binary = atob(base64Data);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }

    return new File([array], fileName, { type: mime });
  };

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

  useEffect(() => {
    handleSave();
  }, [prepareUrls]);

  return (
    <>
      <Container w={'100vw'} h={'100vh'}>
        <div
          ref={backgroundRef}
          style={{
            position: 'absolute', // 부모 기준 위치 설정
            top: '50%', // 화면의 50% 아래
            left: '50%', // 화면의 50% 오른쪽
            transform: 'translate(-50%, -50%)',
            background: 'blue',
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
      <AppShell.Footer>
        <Grid flex={1}>
          <Grid.Col h={'100%'} span={3} bg={'red'}>
            <DropzoneButton
              onDrop={handleDrop}
              mimeTypes={[MIME_TYPES.png, MIME_TYPES.gif, MIME_TYPES.jpeg]}
            />
          </Grid.Col>
          <Grid.Col h={'100%'} span={3} bg={'blue'}>
            <ActionIcon
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
            </ActionIcon>
          </Grid.Col>
          <Grid.Col h={'100%'} span={3} bg={'green'}>
            <IconSticker />
          </Grid.Col>
          <Grid.Col h={'100%'} span={3} bg={'yellow'}>
            <ActionIcon onClick={() => handlePrepare()}>
              <IconDeviceFloppy></IconDeviceFloppy>
            </ActionIcon>
          </Grid.Col>
        </Grid>
      </AppShell.Footer>
    </>
  );
};

export default CreatePage;
