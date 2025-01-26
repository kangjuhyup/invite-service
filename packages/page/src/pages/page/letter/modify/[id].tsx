"use client";

import { useRef, useState, useEffect } from "react";
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
import { useRouter } from "next/router";
import useLetterApi from "@/api/letter.api";
import useImageApi from "@/api/image.api";

interface ComponentContent {
  type: string;
  text?: string;
  url?: string;
  path: string;
}

const ModifyLetterPage = () => {
  useDisablePullToRefresh();
  const router = useRouter();
  const { id: letterId } = router.query;
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const { letterDetail, getLetterDetail } = useLetterApi();
  const { getPresignedUrl } = useImageApi();
  const [componentContents, setComponentContents] = useState<
    ComponentContent[]
  >([]);

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
    prepareUrls,
    addLetter,
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
    handleSave,
    handlePrepare,
    handleTextAdd,
    handleBackgroundRemove,
    generatePassword,
    handleImageChange,
  } = useLetterCreate(backgroundRef);

  useEffect(() => {
    if (!letterId) return;
    getLetterDetail(Number(letterId));
  }, [letterId]);

  useEffect(() => {
    fetchComponentContents();
  }, [letterDetail]);

  useEffect(() => {
    setLetter();
  }, [componentContents]);

  const fetchComponentContents = async () => {
    if (!letterDetail || !letterDetail.components) return;
    const contents = await Promise.all(
      letterDetail!.components!.map(async (component) => {
        const presignedUrl = await getPresignedUrl(component.path);
        if (!presignedUrl) return { type: "", path: component.path };
        return await fetchContentData(presignedUrl, component.path);
      })
    );
    setComponentContents(
      contents.filter(
        (content): content is ComponentContent => content !== undefined
      )
    );
  };

  const setLetter = async () => {
    // 배경 이미지 설정
    if (!letterDetail || !letterDetail.background) return;
    const backgroundUrl = await getPresignedUrl(letterDetail.background.path);
    if (backgroundUrl) {
      setBackgroundImage(backgroundUrl);
    }

    // 제목과 설명 설정
    setLetterTitle(letterDetail.title);
    setLetterDescription(letterDetail.body || "");

    // 컴포넌트 설정
    const newFiles: any[] = [];
    const newTexts: any[] = [];

    componentContents.forEach((content, index) => {
      const detailComponent = letterDetail.components!.find(
        (comp) => comp.path === content.path
      );
      if (!detailComponent) return;

      if (content.type === "text/plain") {
        newTexts.push({
          text: content.text!,
          size: {
            width: detailComponent.width,
            height: detailComponent.height,
          },
          position: { x: detailComponent.x, y: detailComponent.y },
          font: "Noto Sans KR",
          bold: false,
          color: "black",
        });
      } else {
        newFiles.push({
          file: content.url!,
          size: {
            width: detailComponent.width,
            height: detailComponent.height,
          },
          position: { x: detailComponent.x, y: detailComponent.y },
        });
      }
    });
    console.log(newFiles, newTexts);
    setFiles(newFiles);
    setTexts(newTexts);
  };

  const fetchContentData = async (
    url: string,
    path: string
  ): Promise<ComponentContent> => {
    try {
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const type = response.headers.get("Content-Type") || "";
      if (type === "text/plain") {
        const text = await response.text();
        console.log(text);
        return { type, text, url, path };
      }
      return { type, url, path };
    } catch (error) {
      console.error("Error fetching content:", error);
      return { type: "", path };
    }
  };

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
                    handlePrepare();
                    handleSave();
                    if (!isPublic && addLetter) {
                      await generatePassword(addLetter.letterId);
                    }
                  }}
                  variant="filled"
                  color="blue"
                >
                  수정완료
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
          onChangeImage={handleImageChange}
        />
      ) : null}
    </>
  );
};

export default ModifyLetterPage;
