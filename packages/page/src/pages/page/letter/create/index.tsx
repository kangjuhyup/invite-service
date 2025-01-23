'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Container,
  Modal,
  TextInput,
  Textarea,
  Button,
  Stack,
  Box,
  Group,
} from '@mantine/core';
import { FileWithPath } from '@mantine/dropzone';
import MoveResizeImage, {
  FileInfo,
} from '@/components/image/move/move.resize.image';
import MoveText, { TextInfo } from '@/components/text/move/move.text';
import useLetterApi from '@/api/letter.api';
import useGenerateLetter from '@/hooks/generate.letter.hook';
import { useRouter } from 'next/router';
import CreatePageDefaultFooter from '@/components/footer/create.footer';
import TextControlFooter from '@/components/footer/text.footer';
import ImageControlFooter from '@/components/footer/image.footer';
import { BACKGROUND_HEIGHT, BACKGROUND_WIDTH } from '@/const';
import { useDisclosure } from '@mantine/hooks';
import BackgroundSelect from '@/components/background/background.select';
import useImageApi from '@/api/image.api';
import { useDisablePullToRefresh } from '@/hooks/disable.refresh.hook';

const CreatePage = () => {
  useDisablePullToRefresh();
  const router = useRouter();
  const backgroundRef = useRef<HTMLDivElement>(null);
  const {
    prepareUrls,
    getPrepareUrls,
    addLetter,
    postAddLetter,
    generatePassword,
  } = useLetterApi();
  const { removeBackground } = useImageApi();
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [texts, setTexts] = useState<TextInfo[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>('white');
  const [footerType, setFooterType] = useState(0);
  const [selectedTextIndex, setSelectedTextIndex] = useState<number>(-1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const [opened, { open, close }] = useDisclosure(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [letterTitle, setLetterTitle] = useState('');
  const [letterDescription, setLetterDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const containerStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: BACKGROUND_WIDTH,
    height: BACKGROUND_HEIGHT,
    perspective: '1000px',
  };

  const cardStyle = {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    transformStyle: 'preserve-3d' as const,
    transition: 'transform 0.8s',
    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
  };

  const frontStyle = {
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden' as const,
  };

  const backStyle = {
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden' as const,
    transform: 'rotateY(180deg)',
    backgroundColor: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
  };

  const getBackgroundStyle = () => ({
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: BACKGROUND_WIDTH,
    height: BACKGROUND_HEIGHT,
    border: '1px solid gray',
    ...(backgroundImage
      ? {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: '100% 100%',
        }
      : {
          backgroundColor,
        }),
  });

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
            'x-amz-meta-z': `${idx}`,
            'x-amz-meta-x': `${files[idx].position.x}`,
            'x-amz-meta-y': `${files[idx].position.y}`,
          },
        });
      }),
    );

    await Promise.all(
      prepareUrls.textUrls.map(async (textUrl, idx) => {
        await fetch(textUrl, {
          method: 'PUT',
          body: texts[idx].text,
          headers: {
            'Content-Type': 'text/plain',
            'x-amz-meta-session': prepareUrls.sessionKey,
            'x-amz-meta-height': `${texts[idx].size.height}`,
            'x-amz-meta-width': `${texts[idx].size.width}`,
            'x-amz-meta-angle': '0',
            'x-amz-meta-z': `${idx}`,
            'x-amz-meta-x': `${texts[idx].position.x}`,
            'x-amz-meta-y': `${texts[idx].position.y}`,
          },
        });
      }),
    );
    postAddLetter({
      category: 'LT001',
      title: letterTitle,
      body: letterDescription,
    });
  };

  const handlePrepare = async () => {
    // 이미지 정보와 텍스트 정보를 반환
    const imageData = files.map((file) => ({
      fileName:
        typeof file.file === 'string' ? file.file : file.file.name || 'unknown',
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
      textMetas: textData.map((text, idx) => {
        return {
          width: text.size.width.toString(),
          height: text.size.height.toString(),
          font: 'Noto Sans KR',
          x: text.position.x.toString(),
          y: text.position.y.toString(),
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

  useEffect(() => {
    if (addLetter) router.replace(`/page/letter/${addLetter.letterId}`);
  }, [addLetter]);

  return (
    <>
      <Container style={containerStyle}>
        <div style={cardStyle}>
          <div style={frontStyle}>
            <Modal opened={opened} onClose={close} title="배경 선택">
              <BackgroundSelect
                onColorSelect={(color) => {
                  setBackgroundColor(color);
                  setBackgroundImage(null);
                  close();
                }}
                onImageSelect={(image) => {
                  setBackgroundImage(image);
                  close();
                }}
              />
            </Modal>
            <div ref={backgroundRef} style={getBackgroundStyle()} />
            {files.map((fileInfo, index) => (
              <MoveResizeImage
                key={index}
                fileInfo={fileInfo}
                onUpdate={(data) => {
                  setFiles((prevFiles) =>
                    prevFiles.map((f, i) =>
                      i === index ? { ...f, ...data } : f,
                    ),
                  );
                }}
                onClick={() => {
                  setSelectedImageIndex(index);
                  setFooterType(2);
                }}
              />
            ))}
            {texts.map((text, index) => {
              return (
                <MoveText
                  key={index}
                  index={index}
                  textInfo={text}
                  onUpdate={(text) => {
                    setTexts((prevTexts) =>
                      prevTexts.map((t, i) =>
                        i === index ? { ...t, ...text } : t,
                      ),
                    );
                  }}
                  onClick={() => {
                    setSelectedTextIndex(index);
                    setFooterType(1);
                  }}
                />
              );
            })}
          </div>
          <div style={backStyle}>
            <Stack>
              <TextInput
                label="초대장 제목"
                value={letterTitle}
                onChange={(e) => setLetterTitle(e.target.value)}
                placeholder="초대장의 제목을 입력해주세요"
                size="lg"
              />
              <Textarea
                label="초대장 설명"
                value={letterDescription}
                onChange={(e) => setLetterDescription(e.target.value)}
                placeholder="초대장에 대한 설명을 입력해주세요"
                minRows={4}
                size="lg"
              />
              <Group>
                <Button
                  variant={isPublic ? "filled" : "light"}
                  color="blue"
                  onClick={() => setIsPublic(true)}
                >
                  전체공개
                </Button>
                <Button
                  variant={!isPublic ? "filled" : "light"}
                  color="blue"
                  onClick={() => setIsPublic(false)}
                >
                  링크공개
                </Button>
              </Group>
              <Group justify="space-between">
                <Button
                  onClick={() => setIsFlipped(false)}
                  variant="light"
                  color="gray"
                >
                  수정하기
                </Button>
                <Button
                  onClick={async () => {
                    handlePrepare();
                    handleSave();
                    if (!isPublic && addLetter) {
                      await generatePassword(addLetter.letterId);
                    }
                  }}
                  variant="filled"
                  color="blue"
                >
                  생성하기
                </Button>
              </Group>
            </Stack>
          </div>
        </div>
      </Container>
      {footerType === 0 ? (
        <CreatePageDefaultFooter
          onImageDrop={handleDrop}
          onTextAdd={() => {
            const newIndex = texts.length;
            setTexts((prevTexts) => [
              ...prevTexts,
              {
                text: 'Text...',
                size: { width: 18, height: 18 },
                position: { x: 100, y: 100 },
                font: 'Noto Sans KR',
                bold: false,
                color: 'black',
              },
            ]);
            setSelectedTextIndex(newIndex);
            setFooterType(1);
          }}
          onFlip={() => {
            if (isFlipped) {
              setIsFlipped(false);
            } else {
              setIsFlipped(true);
            }
          }}
          isFlipped={isFlipped}
          onBackgroundSelect={open}
        />
      ) : footerType === 1 && selectedTextIndex !== -1 ? (
        <TextControlFooter
          fontSize={Math.round(texts[selectedTextIndex].size.width)}
          isBold={texts[selectedTextIndex].bold}
          currentFont={texts[selectedTextIndex].font}
          onFontSizeChange={(size: number) => {
            setTexts((prevTexts) =>
              prevTexts.map((text, index) =>
                index === selectedTextIndex
                  ? {
                      ...text,
                      size: { width: size, height: size },
                    }
                  : text,
              ),
            );
          }}
          onBoldToggle={() => {
            setTexts((prevTexts) =>
              prevTexts.map((text, index) =>
                index === selectedTextIndex
                  ? { ...text, bold: !text.bold }
                  : text,
              ),
            );
          }}
          onFontChange={(font: string) => {
            setTexts((prevTexts) =>
              prevTexts.map((text, index) =>
                index === selectedTextIndex ? { ...text, font } : text,
              ),
            );
          }}
          onColorSelect={(color: string) => {
            setTexts((prevTexts) =>
              prevTexts.map((text, index) =>
                index === selectedTextIndex ? { ...text, color } : text,
              ),
            );
          }}
          onComplete={() => {
            setSelectedTextIndex(-1);
            setFooterType(0);
          }}
        />
      ) : footerType === 2 && selectedImageIndex !== -1 ? (
        <ImageControlFooter
          width={files[selectedImageIndex].size.width}
          height={files[selectedImageIndex].size.height}
          onSizeChange={(width: number, height: number) => {
            setFiles((prevFiles) =>
              prevFiles.map((file, index) =>
                index === selectedImageIndex
                  ? {
                      ...file,
                      size: { width, height },
                    }
                  : file,
              ),
            );
          }}
          onRotate={() => {
            // 회전 기능은 추후 구현
          }}
          onRemoveBackground={async () => {
            const currentFile = files[selectedImageIndex].file;
            if (!(currentFile instanceof File)) return;
            try {
              console.log('배경 제거 시작 : ', currentFile);
              const arrayBuffer = await removeBackground(currentFile);
              if (arrayBuffer) {
                const newFile = new File([arrayBuffer], currentFile.name, {
                  type: 'image/png',
                });
                setFiles((prevFiles) =>
                  prevFiles.map((file, index) =>
                    index === selectedImageIndex
                      ? {
                          ...file,
                          file: newFile,
                        }
                      : file,
                  ),
                );
              }
            } catch (error) {
              console.error('배경 제거 중 오류 발생:', error);
            }
          }}
          onDelete={() => {
            setFiles((prevFiles) =>
              prevFiles.filter((_, index) => index !== selectedImageIndex),
            );
            setSelectedImageIndex(-1);
            setFooterType(0);
          }}
          onComplete={() => {
            setSelectedImageIndex(-1);
            setFooterType(0);
          }}
        />
      ) : null}
    </>
  );
};

export default CreatePage;
