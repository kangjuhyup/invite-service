import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Platform} from 'react-native';
import {GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID} from '@env';

// 서버 응답 타입 정의
interface LoginResponse {
  access: string;
  refresh: string;
}

// 토큰 갱신 함수
export const resignToken = async (
  refreshToken: string,
): Promise<HttpResponse<LoginResponse>> => {
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

// 구글 로그인 설정 - 플랫폼별 설정 추가
console.log('현재 플랫폼:', Platform.OS);
console.log('Google 클라이언트 ID 설정:', {
  웹: GOOGLE_WEB_CLIENT_ID,
  iOS: GOOGLE_IOS_CLIENT_ID,
  안드로이드: GOOGLE_ANDROID_CLIENT_ID,
});

// 구글 로그인 설정
GoogleSignin.configure({
  // 안드로이드와 iOS 모두 웹 클라이언트 ID가 필요함
  webClientId: GOOGLE_WEB_CLIENT_ID,
  // iOS에서만 iOS 클라이언트 ID 사용
  ...(Platform.OS === 'ios' ? { iosClientId: GOOGLE_IOS_CLIENT_ID } : {}),
  offlineAccess: true, // serverAuthCode를 받기 위해 필요
});

import {apiClient, BASE_URL} from './client';
import {HttpResponse} from './letter';

// 구글 로그인 함수
export const googleLogin = async (): Promise<HttpResponse<LoginResponse>> => {
  try {
    // 구글 로그인 진행
    try {
      // Google Play 서비스 확인 (더 자세한 오류 메시지 표시)
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      console.log('Google Play 서비스 사용 가능');
    } catch (err) {
      console.error('Google Play 서비스 오류:', err);
      throw new Error(`Google Play 서비스 오류: ${JSON.stringify(err)}`);
    }

    // 현재 구성 정보 로깅
    console.log('Google 로그인 구성:', {
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId: GOOGLE_IOS_CLIENT_ID,
    });

    // 구글 로그인 시도
    console.log('Google 로그인 시도...');
    const userInfo = await GoogleSignin.signIn();
    console.log('Google 로그인 성공:', userInfo);

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
    console.log('서버 응답:', response);
    if (!response || !response.result || !response.data) {
      throw new Error('서버 로그인 실패');
    }

    return response;
  } catch (error) {
    console.error('구글 로그인 에러:', error);
    // 더 자세한 오류 정보 로깅
    if (error instanceof Error) {
      console.error('오류 메시지:', error.message);
      console.error('오류 스택:', error.stack);
    } else {
      console.error('알 수 없는 오류 형식:', typeof error);
    }
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
