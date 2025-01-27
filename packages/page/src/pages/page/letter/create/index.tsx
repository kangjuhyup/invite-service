"use client";

import { useRef, useState } from "react";
import {
  Container,
  Modal,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
} from "@mantine/core";
import MoveResizeImage from "@/components/image/move/move.resize.image";
import MoveText from "@/components/text/move/move.text";
import CreatePageDefaultFooter from "@/components/footer/create.footer";
import TextControlFooter from "@/components/footer/text.footer";
import ImageControlFooter from "@/components/footer/image.footer";
import { BACKGROUND_HEIGHT, BACKGROUND_WIDTH } from "@/const";
import { useDisclosure } from "@mantine/hooks";
import BackgroundSelect from "@/components/background/background.select";
import { useDisablePullToRefresh } from "@/hooks/disable.refresh.hook";
import { useLetterCreate } from "@/hooks/letter.create.hook";
import { useEffect } from "react";
import { useRouter } from "next/router";

const CreatePage = () => {
  useDisablePullToRefresh();
  const router = useRouter();
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const {
    files,
    texts,
    backgroundImage,
    backgroundColor,
    footerType,
    selectedTextIndex,
    selectedImageIndex,
    letterTitle,
    letterDescription,
    isPublic,
    setFiles,
    setTexts,
    setBackgroundImage,
    setBackgroundColor,
    setFooterType,
    setSelectedTextIndex,
    setSelectedImageIndex,
    setLetterTitle,
    setLetterDescription,
    setIsPublic,
    handleDrop,
    handlePrepare,
    handleTextAdd,
    handleBackgroundRemove,
    handleImageChange,
    generatePassword,
    addLetter,
  } = useLetterCreate(backgroundRef);

  const containerStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: BACKGROUND_WIDTH,
    height: BACKGROUND_HEIGHT,
    perspective: "1000px",
  };

  const cardStyle = {
    position: "relative" as const,
    width: "100%",
    height: "100%",
    transformStyle: "preserve-3d" as const,
    transition: "transform 0.8s",
    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
  };

  const frontStyle = {
    position: "absolute" as const,
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden" as const,
  };

  const backStyle = {
    position: "absolute" as const,
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden" as const,
    transform: "rotateY(180deg)",
    backgroundColor: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
  };

  const getBackgroundStyle = () => ({
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: BACKGROUND_WIDTH,
    height: BACKGROUND_HEIGHT,
    border: "1px solid gray",
    ...(backgroundImage
      ? {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "100% 100%",
        }
      : {
          backgroundColor,
        }),
  });

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
                      i === index ? { ...f, ...data } : f
                    )
                  );
                }}
                onClick={() => {
                  setSelectedImageIndex(index);
                  setFooterType(2);
                }}
              />
            ))}
            {texts.map((text, index) => (
              <MoveText
                key={index}
                index={index}
                textInfo={text}
                onUpdate={(text) => {
                  setTexts((prevTexts) =>
                    prevTexts.map((t, i) =>
                      i === index ? { ...t, ...text } : t
                    )
                  );
                }}
                onClick={() => {
                  setSelectedTextIndex(index);
                  setFooterType(1);
                }}
              />
            ))}
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
                    await handlePrepare();
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
          onTextAdd={handleTextAdd}
          onFlip={() => setIsFlipped(!isFlipped)}
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
                  : text
              )
            );
          }}
          onBoldToggle={() => {
            setTexts((prevTexts) =>
              prevTexts.map((text, index) =>
                index === selectedTextIndex
                  ? { ...text, bold: !text.bold }
                  : text
              )
            );
          }}
          onFontChange={(font: string) => {
            setTexts((prevTexts) =>
              prevTexts.map((text, index) =>
                index === selectedTextIndex ? { ...text, font } : text
              )
            );
          }}
          onColorSelect={(color: string) => {
            setTexts((prevTexts) =>
              prevTexts.map((text, index) =>
                index === selectedTextIndex ? { ...text, color } : text
              )
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
                  : file
              )
            );
          }}
          onChangeImage={handleImageChange}
          onRotate={() => {
            // 회전 기능은 추후 구현
          }}
          onRemoveBackground={handleBackgroundRemove}
          onDelete={() => {
            setFiles((prevFiles) =>
              prevFiles.filter((_, index) => index !== selectedImageIndex)
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
