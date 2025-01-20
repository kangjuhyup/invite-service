import {
  AppShell,
  Grid,
  Group,
  ActionIcon,
  Text,
  NumberInput,
} from '@mantine/core';
import {
  IconCheck,
  IconRotate,
  IconResize,
  IconTrash,
  IconBackground,
} from '@tabler/icons-react';

interface ImageControlFooterProps {
  onSizeChange: (width: number, height: number) => void;
  onRotate: () => void;
  onDelete: () => void;
  onComplete: () => void;
  onRemoveBackground: () => void;
  width: number;
  height: number;
}

const ImageControlFooter = ({
  onSizeChange,
  onRotate,
  onDelete,
  onComplete,
  onRemoveBackground,
  width,
  height,
}: ImageControlFooterProps) => {
  const footerActions = [
    {
      icon: (
        <Group>
          <NumberInput
            value={width}
            onChange={(value) => onSizeChange(Number(value), height)}
            min={50}
            max={400}
            style={{ width: 70 }}
          />
          <Text>x</Text>
          <NumberInput
            value={height}
            onChange={(value) => onSizeChange(width, Number(value))}
            min={50}
            max={400}
            style={{ width: 70 }}
          />
        </Group>
      ),
      label: '크기',
    },
    {
      icon: (
        <ActionIcon variant="light" color="blue" onClick={onRotate}>
          <IconRotate style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      ),
      label: '회전',
    },
    {
      icon: (
        <ActionIcon variant="light" color="blue" onClick={onRemoveBackground}>
          <IconBackground style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      ),
      label: '배경제거',
    },
    {
      icon: (
        <ActionIcon variant="light" color="red" onClick={onDelete}>
          <IconTrash style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      ),
      label: '삭제',
    },
    {
      icon: (
        <ActionIcon variant="light" color="green" onClick={onComplete}>
          <IconCheck style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      ),
      label: '완료',
    },
  ];

  return (
    <AppShell.Footer
      p="md"
      style={{
        borderTop: '1px solid var(--mantine-color-dark-4)',
      }}
    >
      <Grid>
        {footerActions.map((action, index) => (
          <Grid.Col span={footerActions.length === 5 ? 2.4 : 3} key={index}>
            <Group justify="center" gap="xs">
              {action.icon}
              <Text size="sm">{action.label}</Text>
            </Group>
          </Grid.Col>
        ))}
      </Grid>
    </AppShell.Footer>
  );
};

export default ImageControlFooter;
