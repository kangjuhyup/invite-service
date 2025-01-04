import useLetterApi from '@/api/letter.api';
import useUserApi from '@/api/user.api';
import {
  Container,
  Image,
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
} from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ProfilePage = () => {
  const router = useRouter();
  const { profile, getProfile } = useUserApi();
  const { letterPage, getLetterPage } = useLetterApi();

  useEffect(() => {
    getProfile();
    getLetterPage(10, 0);
  }, []);

  const [gridOpened, setGridOpened] = useState(true);
  const [openedStates, setOpenedStates] = useState(
    new Array(letterPage?.items.length).fill(false),
  );

  const toggleCard = (index: number) => {
    setOpenedStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
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
        <Title>My Letters</Title>
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
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
              <Transition
                mounted={true}
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
                    onClick={() =>
                      router.push({
                        pathname: '/page/letter/[id]',
                        query: { id: letter.id },
                      })
                    }
                  >
                    <Card.Section>
                      <AspectRatio ratio={16 / 9}>
                        <Image
                          src={
                            process.env.NEXT_PUBLIC_WASABI_ENDPOINT +
                            '/' +
                            letter.thumbnail
                          }
                          alt={letter.title || 'Letter thumbnail'}
                          fit="cover"
                        />
                      </AspectRatio>
                    </Card.Section>

                    <Group justify="space-between" mt="md">
                      <Text fw={500} size="lg">
                        {letter.title || 'Untitled Letter'}
                      </Text>
                      <Button
                        variant="light"
                        onClick={() => toggleCard(index)}
                        leftSection={
                          openedStates[index] ? (
                            <IconChevronUp size={16} />
                          ) : (
                            <IconChevronDown size={16} />
                          )
                        }
                      >
                        {openedStates[index] ? '접기' : '더보기'}
                      </Button>
                    </Group>

                    <Collapse
                      in={openedStates[index]}
                      transitionDuration={400}
                      transitionTimingFunction="ease"
                    >
                      <Text size="sm" c="dimmed" mt="md">
                        편지 내용이 여기에 표시됩니다. 이 부분은 접었다 폈다 할
                        수 있습니다. 필요한 경우 추가 정보나 상세 내용을 이곳에
                        표시할 수 있습니다.
                      </Text>
                    </Collapse>
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
