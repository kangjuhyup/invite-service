import {apiClient, BASE_URL} from './client';

export const getImageUrl = (bucket: string, imagePath: string) => {
  return `${BASE_URL}/api/image/${bucket}/${imagePath}`;
};

export const fetchImage = async (
  bucket: string,
  imagePath: string,
): Promise<string> => {
  // 1. 이미지 URL 요청
  const response = await apiClient.get<string>(
    `/api/image/${bucket}/${imagePath}`,
  );
  const url = response.data;
  // 2. 이미지 다운로드
  const imageResponse = await fetch(url);
  if (!imageResponse.ok) {
    throw new Error('이미지 다운로드 실패');
  }
  const blob = await imageResponse.blob();
  return URL.createObjectURL(blob);
};
