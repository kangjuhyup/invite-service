import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Platform} from 'react-native';

// 서버 응답 타입 정의
interface LoginResponse {
  access: string;
  refresh: string;
}

// 토큰 갱신 함수
export const resignToken = async (
  refreshToken: string,
): Promise<LoginResponse> => {
  return await fetch(`${BASE_URL}/api/auth/resign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`,
    },
  }).then(res => {
    if (!res.ok) {
      throw new Error('Token refresh failed');
    }
    return res.json();
  });
};

// 구글 로그인 설정
GoogleSignin.configure({
  webClientId:
    '128433882817-n8iv6m4is2hon4u076lhkkv7b1d1g14k.apps.googleusercontent.com',
  iosClientId:
    '128433882817-n8iv6m4is2hon4u076lhkkv7b1d1g14k.apps.googleusercontent.com',
  offlineAccess: true, // serverAuthCode를 받기 위해 필요
});

import {apiClient, BASE_URL} from './client';
import {HttpResponse} from './letter';

// 구글 로그인 함수
export const googleLogin = async (): Promise<HttpResponse<LoginResponse>> => {
  try {
    // 구글 로그인 진행
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    // 서버에 인증 코드 전송
    const response = await apiClient.post<LoginResponse>(
      '/api/auth/signin/google',
      {
        code: userInfo.data?.serverAuthCode,
      },
      {
        credentials: 'include', // 쿠키를 받기 위해 필요
      },
    );
    console.log('response : ', response);
    if (!response || !response.result || !response.data) {
      throw new Error('서버 로그인 실패');
    }

    return response;
  } catch (error) {
    console.error('구글 로그인 에러:', error);
    throw error;
  }
};

export const login = async (
  email: string,
  password: string,
): Promise<HttpResponse<LoginResponse>> => {
  const response = await apiClient.post<LoginResponse>('/api/auth/signin', {
    email,
    password,
  });
  return response;
};
