'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container, Button, Group, Text, rem } from '@mantine/core';
import { IconBrandGoogle } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useLoginStore from '@/store/login.store';

const LogInPage = () => {
  const router = useRouter();
  const { isLogin } = useLoginStore();

  useEffect(() => {
    if (isLogin) {
      router.replace('/page');
    }
  }, [isLogin]);

  const googleLogin = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&scope=openid%20email%20profile&access_type=offline`;
    window.location.href = authUrl;
  };

  return (
    <Container
      size="xs"
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Button
        onClick={() => googleLogin()}
        variant="default"
        size="xl"
        leftSection={
          <IconBrandGoogle
            style={{ width: rem(24), height: rem(24) }}
            color="#DB4437"
          />
        }
        styles={{
          root: {
            padding: '20px 32px',
            border: '1px solid #ddd',
            '&:hover': {
              backgroundColor: '#f8f9fa',
            },
          },
          inner: {
            fontSize: rem(18),
          },
        }}
      >
        Google 계정으로 로그인
      </Button>
    </Container>
  );
};

export default LogInPage;
