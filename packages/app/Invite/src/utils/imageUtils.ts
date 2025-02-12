import RNFS from 'react-native-fs';
import {WHITE_PIXEL} from '../constants/canvas';

/**
 * 로컬 이미지 파일을 Base64 형식으로 변환
 * @param imagePath 로컬 이미지 파일 경로
 * @returns Base64 형식의 이미지 데이터
 */
export const convertImageToBase64 = async (
  imagePath: string,
): Promise<string> => {
  try {
    const base64 = await RNFS.readFile(imagePath, 'base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('이미지 Base64 변환 실패:', error);
    throw error;
  }
};

/**
 * 배경 이미지 가져오기
 * @param backgroundImage 현재 설정된 배경 이미지
 * @returns Base64 형식의 배경 이미지 데이터
 */
export const getBackgroundImage = async (
  backgroundImage?: string,
): Promise<string> => {
  try {
    if (backgroundImage) {
      return backgroundImage;
    }
    return `data:image/png;base64,${WHITE_PIXEL}`;
  } catch (error) {
    console.error('배경 이미지 생성 실패:', error);
    throw error;
  }
};
