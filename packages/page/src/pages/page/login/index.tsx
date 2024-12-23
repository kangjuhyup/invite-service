'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container, Button, Input } from '@mantine/core';
import { useState } from 'react';
import apiClient from '../../../common/http.client';

const LogInPage = () => {
  const [signupStep, setSignupStep] = useState(0);
  const [phone, setPhone] = useState<string | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [pwd, setPwd] = useState<string | null>(null);

  const googleLogin = () => {
    console.log('googleLogin');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&scope=openid%20email%20profile&access_type=offline`;
    window.location.href = authUrl;
  };

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
      <Button onClick={() => googleLogin()} variant="outline">
        Log in with Google
      </Button>
    </Container>
  );
};

export default LogInPage;
