import { Container, Button, Text } from '@mantine/core';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

const LogInPage = () => {
  const [user, setUser] = useState(null);

  // Google Login Handler
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // 사용자 정보 가져오기
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );
        setUser(userInfo.data); // 사용자 정보 상태에 저장
      } catch (error) {
        console.error('Failed to fetch user info', error);
      }
    },
    onError: () => {
      console.log('Login Failed');
    },
  });

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Container>
        <Text size="xl" mb="md">
          Google OAuth Login
        </Text>
        {user ? (
          <div>
            <Text>Welcome, {user.name}!</Text>
            <img src={user.picture} alt="Profile" />
          </div>
        ) : (
          <Button onClick={(e) => login()} variant="outline">
            Log in with Google
          </Button>
        )}
      </Container>
    </GoogleOAuthProvider>
  );
};

export default LogInPage;
