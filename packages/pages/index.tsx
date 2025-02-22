import { useState } from 'react';
import { useRouter } from 'next/router';
import { TextInput, Button, Text, Box, Stack } from '@mantine/core';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: 로그인 로직 구현
    router.push('/home');
  };

  const handleGuestLogin = () => {
    // TODO: 비로그인 사용자 처리 로직 구현
    router.push('/home');
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Stack w={400} spacing="lg" p="xl">
        <Text size="xl" weight={700} align="center">로그인</Text>
        
        <TextInput
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="md"
        />
        
        <TextInput
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="md"
        />
        
        <Button size="md" onClick={handleLogin}>
          로그인
        </Button>
        
        <Text 
          align="center" 
          sx={(theme) => ({
            color: theme.colors.blue[6],
            textDecoration: 'underline',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          })}
          onClick={handleGuestLogin}
        >
          비로그인으로 사용하기
        </Text>
      </Stack>
    </Box>
  );
}
