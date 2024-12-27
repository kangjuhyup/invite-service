'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container, Button, Input } from '@mantine/core';

const LogInPage = () => {
  const googleLogin = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&scope=openid%20email%20profile&access_type=offline`;
    window.location.href = authUrl;
  };

  return (
    <Container>
      <Button onClick={() => googleLogin()} variant="outline">
        Log in with Google
      </Button>
    </Container>
  );
};

export default LogInPage;
