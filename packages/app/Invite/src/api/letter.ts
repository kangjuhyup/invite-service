import {getToken} from '../utils/token';

export enum LetterCategoryCode {
  ANNIVERSARY = 'LT001',
  WEDDING = 'LT002',
  BIRTHDAY = 'LT003',
  PARTY = 'LT004',
  ETC = 'LT005',
}

export interface Letter {
  id: number;
  title: string;
  body: string;
  category: LetterCategoryCode;
  thumbnail: string;
  inviteDate: string;
  publicYn: boolean;
  password?: string;
  viewCount: number;
  commentCount: number;
  attendCount: number;
}

export interface GetLetterPageRequest {
  skip?: number;
  limit?: number;
}

export interface GetLetterPageResponse {
  totalCount: number;
  items: Letter[];
}

export interface PrepareMetaDefault {
  width: string;
  height: string;
}

export interface PrepareMetaDetail extends PrepareMetaDefault {
  x?: string;
  y?: string;
  z?: string;
  angle?: string;
}

export interface PrepareMetaText extends PrepareMetaDetail {
  font: string;
  color: string;
  bold: string;
}

export interface PrepareRequest {
  thumbnailMeta: PrepareMetaDefault;
  letterMeta: PrepareMetaDefault;
  backgroundMeta: PrepareMetaDefault;
  componentMetas: PrepareMetaDetail[];
  textMetas?: PrepareMetaText[];
}

export interface PrepareResponse {
  sessionKey: string;
  expires: number;
  thumbnailUrl: string;
  letterUrl: string;
  backgroundUrl: string;
  componentUrls: string[];
  textUrls: string[];
}

export interface AddLetterRequest {
  category: LetterCategoryCode;
  title: string;
  body?: string;
  commentYn?: boolean;
  attendYn?: boolean;
}

export interface AddLetterResponse {
  letterId: number;
}

export interface HttpResponse<T> {
  result: boolean;
  data: T;
}

export const uploadFile = async (
  url: string,
  file: string,
  meta?: Record<string, string>,
) => {
  const token = await getToken();
  if (!token) {
    throw new Error('로그인이 필요합니다');
  }

  const response = await fetch(file).catch(err => {
    console.error(err);
    throw err;
  });
  const blob = await response.blob();
  console.info('meta : ', meta);
  // x-amx- prefix를 x-amz-meta-로 변경
  const convertedMeta = Object.entries(meta || {}).reduce<
    Record<string, string>
  >((acc, [key, value]) => {
    const newKey = key.replace('x-amx-', 'x-amz-meta-');
    return {...acc, [newKey]: value};
  }, {});

  // sessionKey 추가
  const getContentType = (fileUrl: string) => {
    // URL에서 쿼리 파라미터 제거
    const cleanUrl = fileUrl.split('?')[0];
    // 파일명 추출
    const fileName = cleanUrl.split('/').pop() || '';
    // 확장자 추출
    const extension = fileName.split('.').pop()?.toLowerCase();

    console.log('File name:', fileName);
    console.log('Extension:', extension);

    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'txt':
        return 'text/plain';
      case 'webp':
        return 'image/webp';
      default:
        // 확장자가 없거나 인식할 수 없는 경우 이미지로 처리
        return 'image/jpeg';
    }
  };

  console.log('File URL:', file);
  const contentType = getContentType(file);
  console.log('Content-Type:', contentType);

  const headers: Record<string, string> = {
    'Content-Type': contentType,
    Authorization: `Bearer ${token}`,
    ...convertedMeta,
  };

  if (meta?.sessionKey) {
    headers['x-amz-meta-session'] = meta.sessionKey;
  }

  await fetch(url, {
    method: 'PUT',
    headers,
    body: blob,
  });
};

export const addLetter = async (
  data: AddLetterRequest,
): Promise<HttpResponse<AddLetterResponse>> => {
  const token = await getToken();
  if (!token) {
    throw new Error('로그인이 필요합니다');
  }
  console.info('addLetter : ', data);
  const response = await fetch('http://192.168.0.18:3003/api/letter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('초대장 생성 중 오류가 발생했습니다');
  }

  return response.json();
};

export const prepareLetter = async (
  data: PrepareRequest,
): Promise<HttpResponse<PrepareResponse>> => {
  const token = await getToken();
  if (!token) {
    throw new Error('로그인이 필요합니다');
  }
  const response = await fetch(
    'http://192.168.0.18:3003/api/letter/prepare-add',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error('초대장 준비 중 오류가 발생했습니다');
  }
  return response.json();
};

export const getLetters = async (
  params: GetLetterPageRequest = {limit: 5, skip: 0},
): Promise<GetLetterPageResponse> => {
  const token = await getToken();
  if (!token) {
    throw new Error('로그인이 필요합니다');
  }

  const queryParams = new URLSearchParams({
    skip: params.skip?.toString() || '0',
    limit: params.limit?.toString() || '5',
  });

  const response = await fetch(
    `http://192.168.0.18:3003/api/letter?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
  );

  if (!response.ok) {
    throw new Error('초대장 목록 조회 실패');
  }

  const result = (await response.json()) as HttpResponse<GetLetterPageResponse>;
  const data = result.data;
  return {
    totalCount: data.totalCount,
    items: data.items.map(item => ({
      ...item,
      id: item.id,
    })),
  };
};
