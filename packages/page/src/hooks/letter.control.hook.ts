import { useState } from "react";
import { FileWithPath } from "@mantine/dropzone";
import { FileInfo } from "@/components/image/move/move.resize.image";
import { TextInfo } from "@/components/text/move/move.text";
import useImageApi from "@/api/image.api";

export const useLetterControl = () => {
  const { removeBackground } = useImageApi();
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [texts, setTexts] = useState<TextInfo[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>("white");
  const [footerType, setFooterType] = useState(0);
  const [selectedTextIndex, setSelectedTextIndex] = useState<number>(-1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);

  const handleDrop = (newFiles: FileWithPath[]) => {
    const newer = newFiles.map((f) => ({
      file: f,
      size: { width: 200, height: 200 },
      position: { x: 0, y: 0 },
    }));
    setFiles((prevFiles) => [...prevFiles, ...newer]);
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
    setFiles,
    setTexts,
    setBackgroundImage,
    setBackgroundColor,
    setFooterType,
    setSelectedTextIndex,
    setSelectedImageIndex,
    handleDrop,
    handleTextAdd,
    handleBackgroundRemove,
    handleImageChange,
  };
};
