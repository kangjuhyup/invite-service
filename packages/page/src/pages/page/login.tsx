'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container, Button, Input } from '@mantine/core';
// import { useGoogleLogin } from '@react-oauth/google';
import { useEffect, useState } from 'react';
import apiClient from '../../common/http.client';

const LogInPage = () => {
  const [signupStep, setSignupStep] = useState(0);
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [pwd, setPwd] = useState<string | null>(null);

  useEffect(() => {}, [user]);

  // const googleLogin = useGoogleLogin({
  //   onSuccess: async (tokenResponse: any) => {
  //     try {
  //       const userInfo = await apiClient.get<any>(
  //         'https://www.googleapis.com/oauth2/v3/userinfo',
  //         {
  //           headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
  //         },
  //       );
  //       setUser(userInfo.data); // 사용자 정보 상태에 저장
  //     } catch (error) {
  //       console.error('Failed to fetch user info', error);
  //     }
  //   },
  //   onError: () => {
  //     console.log('Login Failed');
  //   },
  // });

  const prepare = async () => {
    const res = await apiClient.get<any>(`/auth/signup/${phone}`);
    setSignupStep(1);
    setSession(res.data);
  };

  const signup = async () => {
    const res = await apiClient.post<any>(`/auth/signup`, {
      phone,
      password: pwd,
    });
    return res;
  };

  return (
    <Container>
      <Input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPhone(e.currentTarget.value)
        }
      />
      <Input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPwd(e.currentTarget.value)
        }
      />
      {signupStep === 0 ? (
        <Button onClick={() => prepare()}>인증문자열 얻기</Button>
      ) : signupStep === 1 ? (
        <a
          href={`sms:fog0510@gmail.com?body=${session}`}
          onClick={() => setSignupStep(2)}
        >
          인증 문자 보내기
        </a>
      ) : signupStep === 2 ? (
        <Button onClick={() => signup()}>회원가입</Button>
      ) : (
        <></>
      )}
      {/* <Button onClick={() => googleLogin()} variant="outline">
        Log in with Google
      </Button> */}
    </Container>
  );
};

export default LogInPage;
