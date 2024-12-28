import { RefObject } from 'react';
import { toPng } from 'html-to-image';
import { FileInfo } from '@/components/image/move/move.resize.image';
import { TextInfo } from '@/components/text/move/move.resize.text';

const useGenerateLetter = (
  backgroundRef: RefObject<HTMLDivElement>,
  files: FileInfo[],
  texts: TextInfo[],
) => {
  // Letter 이미지 생성
  const generateLetter = async (): Promise<{
    letter: any;
    background: any;
  }> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    if (!backgroundRef.current) throw new Error('BackgroundRef not available');

    const backgroundImage = await toPng(backgroundRef.current);
    const { offsetHeight: bgHeight, offsetWidth: bgWidth } =
      backgroundRef.current;
    canvas.width = bgWidth;
    canvas.height = bgHeight;

    const bg = new Image();
    bg.src = backgroundImage;

    return new Promise<{ letter: any; background: any }>((resolve, reject) => {
      bg.onload = async () => {
        // 배경 이미지 그리기
        ctx.drawImage(bg, 0, 0, bgWidth, bgHeight);

        // 이미지 파일 그리기
        const imagePromises = files.map(({ file, size, position }) => {
          return new Promise<void>((resolve) => {
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
              resolve();
            };
          });
        });

        // 텍스트 그리기
        const textPromises = texts.map(({ text, position, size }) => {
          return new Promise<void>((resolve) => {
            ctx.font = `${size.width / 10}px Arial`;
            ctx.fillStyle = 'black';
            ctx.fillText(text, position.x, position.y);
            resolve();
          });
        });

        await Promise.all([...imagePromises, ...textPromises]);

        const finalImage = canvas.toDataURL('image/png');
        resolve({
          letter: finalImage,
          background: backgroundImage,
        });
      };

      bg.onerror = () => reject('초대장 생성 실패.');
    });
  };

  // 썸네일 생성
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
      img.onerror = () => reject('썸네일 생성 실패');
    });
  };

  // DataURL을 File로 변환
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

  return { generateLetter, resizeToThumbnail, dataURLToFile };
};

export default useGenerateLetter;
