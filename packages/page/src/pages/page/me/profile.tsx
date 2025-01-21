import useLetterApi from '@/api/letter.api';
import useUserApi from '@/api/user.api';
import PresignedImage from '@/components/image/presigned/presigned.image';
import {
  Container,
  Grid,
  Card,
  Text,
  AspectRatio,
  Avatar,
  Group,
  Paper,
  Stack,
  Button,
  Collapse,
  Title,
  Transition,
  Menu,
  ActionIcon,
} from '@mantine/core';
import {
  IconChevronDown,
  IconChevronUp,
  IconDotsVertical,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ProfilePage = () => {
  const router = useRouter();
  const { profile, getProfile } = useUserApi();
  const { letterPage, getLetterPage, deleteLetter } = useLetterApi();

  useEffect(() => {
    getProfile();
    getLetterPage(100, 0);
  }, []);

  const [gridOpened, setGridOpened] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (letterPage?.items) {
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [letterPage?.items]);

  const refreshLetters = async () => {
    await getLetterPage(100, 0);
  };

  const handleDelete = async (letterId: number) => {
    await deleteLetter(letterId);
    await refreshLetters();
  };

  return (
    <Container size="lg" py="xl">
      <Paper shadow="sm" p="md" withBorder mb="xl">
        <Group>
          <Avatar size="xl" radius="xl" src={null} color="blue">
            {profile?.nickName?.charAt(0)}
          </Avatar>
          <Stack gap="xs">
            <Text size="xl" fw={700}>
              {profile?.nickName}
            </Text>
            <Text size="sm" c="dimmed">
              {profile?.email}
            </Text>
          </Stack>
        </Group>
      </Paper>
      <Group justify="space-between" align="center">
        <Title>내 초대장</Title>
        <Button
          variant="subtle"
          onClick={() => setGridOpened((o) => !o)}
          leftSection={
            gridOpened ? (
              <IconChevronUp size={16} />
            ) : (
              <IconChevronDown size={16} />
            )
          }
        >
          {gridOpened ? '접기' : '펼치기'}
        </Button>
      </Group>

      <Collapse
        in={gridOpened}
        transitionDuration={400}
        transitionTimingFunction="ease"
      >
        <Grid pt="md" gutter="md">
          {letterPage?.items.map((letter, index) => (
            <Grid.Col key={letter.id} span={{ base: 12, sm: 6, md: 4 }}>
              <Transition
                mounted={isVisible}
                transition="fade"
                duration={400}
                timingFunction="ease"
              >
                {(styles) => (
                  <Card
                    style={styles}
                    shadow="sm"
                    padding="md"
                    radius="md"
                    withBorder
                  >
                    <Card.Section
                      onClick={() =>
                        router.push({
                          pathname: '/page/letter/[id]',
                          query: { id: letter.id },
                        })
                      }
                    >
                      <AspectRatio ratio={16 / 9}>
                        <PresignedImage path={letter.thumbnail} />
                      </AspectRatio>
                    </Card.Section>

                    <Group justify="space-between" mt="md">
                      <Text fw={500} size="lg">
                        {letter.title || 'Untitled Letter'}
                      </Text>
                      <Menu shadow="md" width={200} position="bottom-end">
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <IconDotsVertical
                              style={{ width: '70%', height: '70%' }}
                              stroke={1.5}
                            />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={
                              <IconEdit
                                style={{ width: '14px', height: '14px' }}
                              />
                            }
                            onClick={() =>
                              router.replace(`/page/letter/modify/${letter.id}`)
                            }
                          >
                            수정하기
                          </Menu.Item>
                          <Menu.Item
                            color="red"
                            leftSection={
                              <IconTrash
                                style={{ width: '14px', height: '14px' }}
                              />
                            }
                            onClick={() => {
                              handleDelete(letter.id);
                            }}
                          >
                            삭제하기
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Card>
                )}
              </Transition>
            </Grid.Col>
          ))}
        </Grid>
      </Collapse>
    </Container>
  );
};

export default ProfilePage;
