import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Platform} from 'react-native';

// 서버 응답 타입 정의
interface LoginResponse {
  result: boolean;
  data: {
    access: string;
    refresh: string;
  };
}

// 구글 로그인 설정
GoogleSignin.configure({
  webClientId:
    '128433882817-n8iv6m4is2hon4u076lhkkv7b1d1g14k.apps.googleusercontent.com',
  iosClientId:
    '128433882817-n8iv6m4is2hon4u076lhkkv7b1d1g14k.apps.googleusercontent.com',
  offlineAccess: true, // serverAuthCode를 받기 위해 필요
});

// 구글 로그인 함수
export const googleLogin = async (): Promise<LoginResponse> => {
  try {
    // 구글 로그인 진행
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    // 서버에 인증 코드 전송
    // 플랫폼에 따라 다른 주소 사용
    const serverUrl = Platform.select({
      ios: 'http://192.168.0.18:3003',
      android: 'http://10.0.2.2:3000',
    });
    console.log('serverUrl : ', serverUrl);
    const response = await fetch(`${serverUrl}/api/auth/signin/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: userInfo.data?.serverAuthCode,
      }),
      credentials: 'include', // 쿠키를 받기 위해 필요
    });
    console.log('response : ', response);
    if (!response.ok) {
      throw new Error('서버 로그인 실패');
    }

    const data = await response.json();
    console.log('data : ', data);
    return data as LoginResponse;
  } catch (error) {
    console.error('구글 로그인 에러:', error);
    throw error;
  }
};
