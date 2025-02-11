import {getToken} from '../utils/token';

export const getImageUrl = (bucket: string, imagePath: string) => {
  return `http://192.168.0.18:3003/api/image/${bucket}/${imagePath}`;
};

export const fetchImage = async (
  bucket: string,
  imagePath: string,
): Promise<string> => {
  const token = await getToken();
  if (!token) {
    throw new Error('로그인이 필요합니다');
  }

  // 1. 이미지 URL 요청
  const urlResponse = await fetch(getImageUrl(bucket, imagePath), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!urlResponse.ok) {
    throw new Error('이미지 URL 요청 실패');
  }

  const {data: imageUrl} = await urlResponse.json();

  // 2. 이미지 다운로드
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error('이미지 다운로드 실패');
  }

  return imageUrl;
};
