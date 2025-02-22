import {apiClient} from './client';
import {Comment} from './comment';

export enum LetterCategoryCode {
  ANNIVERSARY = 'LT001',
  WEDDING = 'LT002',
  BIRTHDAY = 'LT003',
  PARTY = 'LT004',
  ETC = 'LT005',
}

export interface LetterInfo {
  path: string;
  width: number;
  height: number;
}

export interface LetterPageItem {
  id: number;
  thumbnail: string;
  title: string;
  body: string;
  inviteDate?: string;
  category: LetterCategoryCode;
  viewCount: number;
  commentCount: number;
  attendCount: number;
}

export interface Letter {
  userId: string;
  title: string;
  body: string;
  letterId: number;
  publicYn: boolean;
  password?: string;
  letter: LetterInfo;
  inviteDate?: string;
  category: LetterCategoryCode;
  viewCount: number;
  commentCount: number;
  attendCount: number;
  comments: Array<Comment>;
}

export interface GetLetterPageRequest {
  skip?: number;
  limit?: number;
}

export interface GetLetterPageResponse {
  totalCount: number;
  items: LetterPageItem[];
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

export interface ModifyLetterRequest {
  category?: LetterCategoryCode;
  title?: string;
  body?: string;
  inviteDate?: string;
  commentYn?: boolean;
  attendYn?: boolean;
  publicYn?: boolean;
}

export interface AddLetterRequest {
  category: LetterCategoryCode;
  title: string;
  body?: string;
  inviteDate: string;
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

export interface Background {
  path: string;
  width: number;
  height: number;
}

export interface Component {
  path: string;
  width: number;
  height: number;
  x: string;
  y: string;
  z: number;
  ang: string;
  font?: string;
  color?: string;
  bold?: boolean;
}

export interface GetLetterDetailResponse {
  title: string;
  body?: string;
  background: Background;
  components?: Component[];
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
): Promise<HttpResponse<GetLetterPageResponse>> => {
  console.info(
    `REQUEST TO /api/letter?skip=${params.skip}&limit=${params.limit}`,
  );
  const queryParams = new URLSearchParams({
    skip: params.skip?.toString() || '0',
    limit: params.limit?.toString() || '5',
  });

  return await apiClient.get<GetLetterPageResponse>(
    `/api/letter?${queryParams.toString()}`,
  );
};

export const getLetterDetail = async (
  id: string | number,
): Promise<HttpResponse<GetLetterDetailResponse>> => {
  return await apiClient.get<GetLetterDetailResponse>(
    `/api/letter/detail/${id}`,
  );
};

export const getLetter = async (
  id: string | number,
  token?: string,
): Promise<HttpResponse<Letter>> => {
  const url = token ? `/api/letter/${id}?token=${token}` : `/api/letter/${id}`;
  console.log(url);
  return await apiClient.get<Letter>(url);
};

/**
 * 초대장을 삭제합니다.
 * @param id 삭제할 초대장 ID
 * @returns 삭제 결과
 */
export const deleteLetter = async (
  id: string | number,
): Promise<HttpResponse<void>> => {
  return await apiClient.delete<void>(`/api/letter/${id}`);
};

/**
 * 초대장 수정 전 처리를 수행합니다.
 * @param id 수정할 초대장 ID
 * @param data 수정할 초대장 데이터
 * @returns 수정 준비 결과
 */
export const prepareModifyLetter = async (
  id: string | number,
  data: PrepareRequest,
): Promise<HttpResponse<PrepareResponse>> => {
  return await apiClient.post<PrepareResponse>(
    `/api/letter/prepare-modify/${id}`,
    data,
  );
};

/**
 * 초대장을 수정합니다.
 * @param id 수정할 초대장 ID
 * @param data 수정할 초대장 데이터
 * @returns 수정 결과
 */
export const modifyLetter = async (
  id: string | number,
  data: ModifyLetterRequest,
): Promise<HttpResponse<AddLetterResponse>> => {
  return await apiClient.patch<AddLetterResponse>(`/api/letter/${id}`, data);
};
