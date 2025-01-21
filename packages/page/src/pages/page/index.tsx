'use client';

import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Card,
  SimpleGrid,
  rem,
} from '@mantine/core';
import {
  IconTemplate,
  IconPencil,
  IconShare,
  IconDeviceMobile,
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import useLoginStore from '@/store/login.store';

const features = [
  {
    icon: IconTemplate,
    title: '다양한 템플릿',
    description: '아름다운 디자인의 템플릿을 제공합니다. 원하는 스타일을 선택하여 시작하세요.',
  },
  {
    icon: IconPencil,
    title: '쉬운 편집',
    description: '드래그 앤 드롭으로 이미지와 텍스트를 자유롭게 배치하고 편집할 수 있습니다.',
  },
  {
    icon: IconShare,
    title: '간편한 공유',
    description: '완성된 초대장을 링크로 공유하거나 SNS에 게시할 수 있습니다.',
  },
  {
    icon: IconDeviceMobile,
    title: '모바일 최적화',
    description: '모바일에서도 완벽하게 작동하는 반응형 디자인을 제공합니다.',
  },
];

const HomePage = () => {
  const router = useRouter();
  const { isLogin } = useLoginStore();

  return (
    <Container size="lg" py="xl">
      <Group justify="center" mb={50}>
        <div style={{ maxWidth: rem(600), textAlign: 'center' }}>
          <Title order={1} size="h1" fw={900} mb="md">
            특별한 순간을 위한
            <br />
            <Text
              component="span"
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
              inherit
            >
              디지털 초대장
            </Text>
          </Title>
          <Text size="lg" c="dimmed" mb={30}>
            결혼식, 생일, 모임 등 소중한 순간을 위한 초대장을 쉽고 빠르게 만들어보세요.
            아름다운 디자인과 직관적인 편집 기능을 제공합니다.
          </Text>
          <Button
            size="lg"
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            onClick={() => {
              if (!isLogin) {
                router.push('/page/login');
              } else {
                router.push('/page/letter/create');
              }
            }}
          >
            초대장 만들기
          </Button>
        </div>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={50} mt={100}>
        {features.map((feature) => (
          <Card key={feature.title} shadow="md" radius="md" padding="xl">
            <feature.icon
              style={{ width: rem(50), height: rem(50) }}
              stroke={2}
              color="var(--mantine-color-blue-filled)"
            />
            <Text mt="md" mb={7} fw={700} size="lg">
              {feature.title}
            </Text>
            <Text size="sm" c="dimmed" lh={1.6}>
              {feature.description}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default HomePage;
