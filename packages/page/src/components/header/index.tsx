import { AppShell, Button, Group, Title, rem } from '@mantine/core';
import { useRouter } from 'next/router';
import useLoginStore from '@/store/login.store';
import useAuthApi from '@/api/auth.api';

const Header = () => {
  const router = useRouter();
  const { isLogin, clearToken } = useLoginStore();
  const { signOut } = useAuthApi();

  const handleAuthClick = async () => {
    if (isLogin) {
      const result = await signOut();
      if (result) {
        clearToken();
        router.replace('/page');
      }
    } else {
      router.replace('/page/login');
    }
  };

  return (
    <Group justify="space-between" h="100%">
      <Group gap={rem(10)}>
        <Button
          variant="subtle"
          color="blue"
          onClick={() => router.replace('/page/me/profile')}
          styles={{
            root: {
              '&:hover': {
                backgroundColor: 'var(--mantine-color-blue-7)',
              },
            },
          }}
        >
          MY PROFILE
        </Button>
        <Button
          variant="subtle"
          color="blue"
          onClick={() => router.replace('/page/letter/create')}
          styles={{
            root: {
              '&:hover': {
                backgroundColor: 'var(--mantine-color-blue-7)',
              },
            },
          }}
        >
          CREATE
        </Button>
        <Button
          variant="subtle"
          color="blue"
          onClick={() => router.replace('/page/create')}
          styles={{
            root: {
              '&:hover': {
                backgroundColor: 'var(--mantine-color-blue-7)',
              },
            },
          }}
        >
          TEMPLATE
        </Button>
      </Group>
      <Button
        variant="subtle"
        color="blue"
        onClick={handleAuthClick}
        styles={{
          root: {
            '&:hover': {
              backgroundColor: 'var(--mantine-color-blue-7)',
            },
          },
        }}
      >
        {isLogin ? 'LOGOUT' : 'LOGIN'}
      </Button>
    </Group>
  );
};

export default Header;
