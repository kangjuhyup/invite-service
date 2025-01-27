import { FileInfo } from "@/components/image/move/move.resize.image";
import { TextInfo } from "@/components/text/move/move.text";
import useLetterApi from "@/api/letter.api";
import useImageApi from "@/api/image.api";
import { BACKGROUND_HEIGHT, BACKGROUND_WIDTH } from "@/const";

/**
 * 레터 준비 및 업로드를 담당하는 훅
 * @param files - 이미지 파일 정보 배열
 * @param texts - 텍스트 정보 배열
 */
export const usePrepareLetter = (files: FileInfo[], texts: TextInfo[]) => {
  const { prepareUrls, getPrepareUrls, getModifyPrepareUrls } = useLetterApi();
  const { putImageToPresignedUrl } = useImageApi();

  const getImageDatas = () => {
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
      color: text.color,
      bold: text.bold,
      font: text.font,
    }));
    return { imageData, textData };
  };

  /**
   * 레터 생성을 위한 prepare URL을 요청합니다.
   */
  const handlePrepare = async () => {
    const { imageData, textData } = getImageDatas();

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
        font: encodeURIComponent(text.font),
        color: text.color,
        bold: text.bold,
        x: text.position.x.toString(),
        y: text.position.y.toString(),
        z: idx.toString(),
        angle: "0",
      })),
    });
  };

  const handleModifyPrepare = async (letterId: number) => {
    const { imageData, textData } = getImageDatas();

    getModifyPrepareUrls(letterId, {
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
        font: encodeURIComponent(text.font),
        color: text.color,
        bold: text.bold,
        x: text.position.x.toString(),
        y: text.position.y.toString(),
        z: idx.toString(),
        angle: "0",
      })),
    });
  };

  /**
   * 준비된 URL에 파일들을 업로드합니다.
   * @param letterFile - 레터 이미지 파일
   * @param backgroundFile - 배경 이미지 파일
   * @param thumbnailFile - 썸네일 이미지 파일
   */
  const handleUpload = async (
    letterFile: File,
    backgroundFile: File,
    thumbnailFile: File
  ) => {
    console.log("handleUpload");
    if (!prepareUrls) return;
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

    await putImageToPresignedUrl(prepareUrls.backgroundUrl, backgroundFile, {
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
          font: encodeURIComponent(texts[idx].font),
          color: texts[idx].color,
          bold: texts[idx].bold ? "true" : "false",
        });
      })
    );
  };

  return {
    prepareUrls,
    handlePrepare,
    handleModifyPrepare,
    handleUpload,
  };
};
