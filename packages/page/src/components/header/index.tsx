import {
  Group,
  Button,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
  Container,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/router';
import useLoginStore from '@/store/login.store';
import useAuthApi from '@/api/auth.api';
import classes from './header.module.css';

const Header = () => {
  const router = useRouter();
  const { isLogin, clearToken } = useLoginStore();
  const { signOut } = useAuthApi();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

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
    closeDrawer();
  };

  return (
    <Box>
      <Container size="lg">
        <Group h="56px" justify="space-between">
          <Title order={3} onClick={() => router.replace('/page')} style={{ cursor: 'pointer' }}>
            Invite Service
          </Title>

          <Group h="100%" gap={0} visibleFrom="sm">
            <Button
              variant="subtle"
              onClick={() => router.replace('/page/me/profile')}
              className={classes.link}
            >
              MY PROFILE
            </Button>
            <Button
              variant="subtle"
              onClick={() => router.replace('/page/letter/create')}
              className={classes.link}
            >
              CREATE
            </Button>
            <Button
              variant="subtle"
              onClick={() => router.replace('/page/create')}
              className={classes.link}
            >
              TEMPLATE
            </Button>
            <Button
              variant="subtle"
              onClick={handleAuthClick}
              className={classes.link}
            >
              {isLogin ? 'LOGOUT' : 'LOGIN'}
            </Button>
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </Container>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="메뉴"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <Button
            variant="subtle"
            onClick={() => {
              router.replace('/page/me/profile');
              closeDrawer();
            }}
            className={classes.link}
            fullWidth
          >
            MY PROFILE
          </Button>
          <Button
            variant="subtle"
            onClick={() => {
              router.replace('/page/letter/create');
              closeDrawer();
            }}
            className={classes.link}
            fullWidth
          >
            CREATE
          </Button>
          <Button
            variant="subtle"
            onClick={() => {
              router.replace('/page/create');
              closeDrawer();
            }}
            className={classes.link}
            fullWidth
          >
            TEMPLATE
          </Button>

          <Divider my="sm" />

          <Button
            variant="subtle"
            onClick={handleAuthClick}
            className={classes.link}
            fullWidth
          >
            {isLogin ? 'LOGOUT' : 'LOGIN'}
          </Button>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};

export default Header;
