import {apiClient} from './client';

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
  file: string | Blob,
  meta?: Record<string, string>,
) => {
  // file이 string인 경우 (파일 경로 또는 base64) blob으로 변환
  let blob: Blob;
  if (typeof file === 'string') {
    const response = await fetch(file);
    blob = await response.blob();
  } else {
    blob = file;
  }

  // x-amx- prefix를 x-amz-meta-로 변경
  const convertedMeta = Object.entries(meta || {}).reduce<
    Record<string, string>
  >((acc, [key, value]) => {
    const newKey = key.replace('x-amx-', 'x-amz-meta-');
    return {...acc, [newKey]: value};
  }, {});

  const getContentType = (fileUrl: string) => {
    if (typeof file !== 'string') return 'image/png';
    const cleanUrl = fileUrl.split('?')[0];
    const fileName = cleanUrl.split('/').pop() || '';
    const extension = fileName.split('.').pop()?.toLowerCase();

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
        return 'image/png';
    }
  };

  const contentType = getContentType(typeof file === 'string' ? file : '');
  const headers: Record<string, string> = {
    'Content-Type': contentType,
    ...convertedMeta,
  };

  if (meta?.sessionKey) {
    headers['x-amz-meta-session'] = meta.sessionKey;
  }

  // apiClient 대신 fetch 사용 (파일 업로드는 별도 처리)
  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body: blob,
  });

  if (!response.ok) {
    throw new Error('파일 업로드 실패');
  }

  return response;
};

export const addLetter = async (
  data: AddLetterRequest,
): Promise<HttpResponse<AddLetterResponse>> => {
  return await apiClient.post<AddLetterResponse>('/api/letter', data);
};

export const prepareLetter = async (
  data: PrepareRequest,
): Promise<HttpResponse<PrepareResponse>> => {
  return await apiClient.post<PrepareResponse>('/api/letter/prepare-add', data);
};

export const getLetters = async (
  params: GetLetterPageRequest = {limit: 5, skip: 0},
): Promise<GetLetterPageResponse> => {
  const queryParams = new URLSearchParams({
    skip: params.skip?.toString() || '0',
    limit: params.limit?.toString() || '5',
  });

  const result = await apiClient.get<GetLetterPageResponse>(
    `/api/letter?${queryParams.toString()}`,
  );
  return {
    totalCount: result.data.totalCount,
    items: result.data.items.map(item => ({
      ...item,
      id: item.id,
    })),
  };
};
