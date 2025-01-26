import { useState } from "react";
import { FileWithPath } from "@mantine/dropzone";
import { FileInfo } from "@/components/image/move/move.resize.image";
import { TextInfo } from "@/components/text/move/move.text";
import useLetterApi from "@/api/letter.api";
import useImageApi from "@/api/image.api";
import { useRouter } from "next/router";
import useGenerateLetter from "./generate.letter.hook";
import { BACKGROUND_HEIGHT, BACKGROUND_WIDTH } from "@/const";

export const useLetterCreate = (
  backgroundRef: React.RefObject<HTMLDivElement>
) => {
  const {
    prepareUrls,
    getPrepareUrls,
    addLetter,
    postAddLetter,
    generatePassword,
  } = useLetterApi();
  const { removeBackground, putImageToPresignedUrl } = useImageApi();

  const [files, setFiles] = useState<FileInfo[]>([]);
  const [texts, setTexts] = useState<TextInfo[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>("white");
  const [footerType, setFooterType] = useState(0);
  const [selectedTextIndex, setSelectedTextIndex] = useState<number>(-1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const [letterTitle, setLetterTitle] = useState("");
  const [letterDescription, setLetterDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const { generateLetter, resizeToThumbnail, dataURLToFile } =
    useGenerateLetter(backgroundRef, files, texts);

  const handleDrop = (newFiles: FileWithPath[]) => {
    const newer = newFiles.map((f) => ({
      file: f,
      size: { width: 200, height: 200 },
      position: { x: 0, y: 0 },
    }));
    setFiles((prevFiles) => [...prevFiles, ...newer]);
  };

  const handleSave = async () => {
    if (!prepareUrls) return;
    const letterResult = await generateLetter();
    if (letterResult === undefined || letterResult === null) throw new Error();
    const letterFile = dataURLToFile(letterResult.letter, "letter");
    const bgFile = dataURLToFile(letterResult.background, "bg");
    const thumbnail = await resizeToThumbnail(letterResult.letter);
    const thumbnailFile = dataURLToFile(thumbnail, "thumbnail");

    await putImageToPresignedUrl(prepareUrls.letterUrl, letterFile, {
      type: "image",
      width: BACKGROUND_WIDTH.replace("px", ""),
      height: BACKGROUND_HEIGHT.replace("px", ""),
      session: prepareUrls.sessionKey,
    });

    await putImageToPresignedUrl(prepareUrls.thumbnailUrl, thumbnailFile, {
      type: "image",
      width: "100",
      height: "150",
      session: prepareUrls.sessionKey,
    });

    await putImageToPresignedUrl(prepareUrls.backgroundUrl, bgFile, {
      type: "image",
      width: BACKGROUND_WIDTH.replace("px", ""),
      height: BACKGROUND_HEIGHT.replace("px", ""),
      session: prepareUrls.sessionKey,
    });

    await Promise.all(
      prepareUrls.componentUrls.map(async (componentUrl, idx) => {
        await putImageToPresignedUrl(componentUrl, files[idx].file, {
          type: "image",
          width: files[idx].size.width.toString(),
          height: files[idx].size.height.toString(),
          session: prepareUrls.sessionKey,
          x: files[idx].position.x.toString(),
          y: files[idx].position.y.toString(),
          z: idx.toString(),
          angle: "0",
        });
      })
    );

    await Promise.all(
      prepareUrls.textUrls.map(async (textUrl, idx) => {
        await putImageToPresignedUrl(textUrl, texts[idx].text, {
          type: "text",
          width: texts[idx].size.width.toString(),
          height: texts[idx].size.height.toString(),
          session: prepareUrls.sessionKey,
          x: texts[idx].position.x.toString(),
          y: texts[idx].position.y.toString(),
          z: idx.toString(),
          angle: "0",
        });
      })
    );
    postAddLetter({
      category: "LT001",
      title: letterTitle,
      body: letterDescription,
    });
  };

  const handlePrepare = async () => {
    const imageData = files.map((file) => ({
      fileName:
        typeof file.file === "string" ? file.file : file.file.name || "unknown",
      size: file.size,
      position: file.position,
    }));

    const textData = texts.map((text) => ({
      text: text.text,
      size: text.size,
      position: text.position,
    }));

    getPrepareUrls({
      thumbnailMeta: {
        width: "100",
        height: "150",
      },
      letterMeta: {
        width: BACKGROUND_WIDTH.replace("px", ""),
        height: BACKGROUND_HEIGHT.replace("px", ""),
      },
      backgroundMeta: {
        width: BACKGROUND_WIDTH.replace("px", ""),
        height: BACKGROUND_HEIGHT.replace("px", ""),
      },
      componentMetas: imageData.map((image, idx) => ({
        width: image.size.width.toString(),
        height: image.size.height.toString(),
        x: image.position.x.toString(),
        y: image.position.y.toString(),
        z: idx.toString(),
        angle: "0",
      })),
      textMetas: textData.map((text, idx) => ({
        width: text.size.width.toString(),
        height: text.size.height.toString(),
        font: "Noto Sans KR",
        x: text.position.x.toString(),
        y: text.position.y.toString(),
        z: idx.toString(),
        angle: "0",
      })),
    });
  };

  const handleTextAdd = () => {
    const newIndex = texts.length;
    setTexts((prevTexts) => [
      ...prevTexts,
      {
        text: "Text...",
        size: { width: 18, height: 18 },
        position: { x: 100, y: 100 },
        font: "Noto Sans KR",
        bold: false,
        color: "black",
      },
    ]);
    setSelectedTextIndex(newIndex);
    setFooterType(1);
  };

  const handleBackgroundRemove = async () => {
    if (selectedImageIndex === -1) return;
    const file = files[selectedImageIndex].file;
    if (file && typeof file !== "string") {
      const response = await removeBackground(file);
      if (!response) return;
      const blob = new Blob([response], { type: "image/png" });
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setFiles((prevFiles) =>
          prevFiles.map((f, index) =>
            index === selectedImageIndex
              ? {
                  ...f,
                  file: new File([blob], "removed.png", { type: "image/png" }),
                  dataUrl,
                }
              : f
          )
        );
      };
      reader.readAsDataURL(blob);
    }
  };

  const handleImageChange = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          setFiles((prevFiles) =>
            prevFiles.map((f, index) =>
              index === selectedImageIndex
                ? {
                    ...f,
                    file,
                    dataUrl,
                  }
                : f
            )
          );
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return {
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
    handleImageChange,
    generatePassword,
  };
};
