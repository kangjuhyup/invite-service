import {getToken} from '../utils/token';

export enum LetterCategoryCode {
  ANNIVERSARY = 'ANNIVERSARY',
  WEDDING = 'WEDDING',
  PARTY = 'PARTY',
  ETC = 'ETC',
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

export interface HttpResponse<T> {
  result: boolean;
  data: T;
}

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
