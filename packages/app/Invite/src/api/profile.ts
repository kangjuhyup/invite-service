import {getToken} from '../utils/token';

export interface ProfileResponse {
  userId: string;
  email: string;
  nickName: string;
  profileImage?: string;
}

export const getProfile = async (): Promise<ProfileResponse> => {
  const token = await getToken();
  if (!token) {
    throw new Error('로그인이 필요합니다');
  }

  const response = await fetch('http://192.168.0.18:3003/api/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('프로필 조회 실패');
  }

  return (await response.json()).data as ProfileResponse;
};
