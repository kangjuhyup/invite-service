import { useEffect, useState } from "react";
import useLetterApi from "@/api/letter.api";
import useGenerateLetter from "./generate.letter.hook";
import { useLetterControl } from "./letter.control.hook";
import { usePrepareLetter } from "./prepare.letter.hook";

/**
 * 레터 변경을 총괄하는 훅
 * @param backgroundRef - 배경 이미지 참조
 */
export const useLetterModify = (
  letterId: number,
  backgroundRef: React.RefObject<HTMLDivElement>
) => {
  const { modifyLetter, patchmModifyLetter, generatePassword } = useLetterApi();

  // 레터 정보 상태
  const [letterTitle, setLetterTitle] = useState("");
  const [letterDescription, setLetterDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  // 컨트롤 훅
  const {
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
  } = useLetterControl();

  // 준비 훅
  const { prepareUrls, handleModifyPrepare, handleUpload } = usePrepareLetter(
    files,
    texts
  );

  // 레터 생성 유틸리티
  const { generateLetter, resizeToThumbnail, dataURLToFile } =
    useGenerateLetter(backgroundRef, files, texts);

  /**
   * 레터를 저장하고 서버에 생성 요청을 보냅니다.
   */
  const handleSave = async () => {
    await handleModifyPrepare(letterId);
  };

  const upload = async () => {
    const letterResult = await generateLetter();
    if (!letterResult) throw new Error("레터 생성 실패");

    const letterFile = dataURLToFile(letterResult.letter, "letter");
    const bgFile = dataURLToFile(letterResult.background, "bg");
    const thumbnail = await resizeToThumbnail(letterResult.letter);
    const thumbnailFile = dataURLToFile(thumbnail, "thumbnail");
    await handleUpload(letterFile, bgFile, thumbnailFile);
    // 레터 생성 요청
    await patchmModifyLetter(letterId, {
      title: letterTitle,
      body: letterDescription,
    });
  };

  useEffect(() => {
    if (!prepareUrls) return;
    upload();
  }, [prepareUrls]);

  return {
    // 상태
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

    // 상태 변경 함수
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

    // 핸들러
    handleDrop,
    handleSave,
    handleTextAdd,
    handleBackgroundRemove,
    handleImageChange,
    generatePassword,

    // 응답값
    modifyLetter,
  };
};
