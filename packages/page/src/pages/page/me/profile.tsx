import useImageApi from '@/api/image.api';
import useLetterApi from '@/api/letter.api';
import useUserApi from '@/api/user.api';
import PresignedImage from '@/components/image/presigned/presigned.image';
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
import {
  IconChevronDown,
  IconChevronUp,
  IconStatusChange,
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ProfilePage = () => {
  const router = useRouter();
  const { getPresignedUrl } = useImageApi();
  const { profile, getProfile } = useUserApi();
  const { letterPage, getLetterPage } = useLetterApi();

  useEffect(() => {
    getProfile();
    getLetterPage(10, 0);
  }, []);

  const [gridOpened, setGridOpened] = useState(true);

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
                      <Button
                        variant="light"
                        onClick={() =>
                          router.replace(`/page/letter/modify/${letter.id}`)
                        }
                      >
                        수정하기
                      </Button>
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
