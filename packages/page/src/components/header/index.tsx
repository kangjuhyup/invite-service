import { AppShell, Button, Group, Title, rem } from '@mantine/core';
import { useRouter } from 'next/router';

const Header = () => {
  const router = useRouter();
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
          onClick={() => router.replace('/page/create')}
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
      </Group>
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
  );
};

export default Header;
