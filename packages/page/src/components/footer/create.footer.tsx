import {
  Group,
  Button,
  ActionIcon,
  AppShell,
  Grid,
  Text,
  Tooltip,
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import {
  IconTextGrammar,
  IconDeviceFloppy,
  IconPalette,
  IconPhoto,
  IconRotate3d,
} from '@tabler/icons-react';
import { FileWithPath } from '@mantine/dropzone';

interface CreatePageDefaultFooterProps {
  onImageDrop: (files: FileWithPath[]) => void;
  onTextAdd: () => void;
  onBackgroundSelect: () => void;
  onFlip: () => void;
  isFlipped: boolean;
}

const CreatePageDefaultFooter = ({
  onImageDrop,
  onTextAdd,
  onBackgroundSelect,
  onFlip,
  isFlipped,
}: CreatePageDefaultFooterProps) => {
  const footerActions = [
    {
      icon: (
        <Dropzone
          onDrop={onImageDrop}
          accept={['image/*']}
          style={{ border: 'none', background: 'none', padding: 0 }}
        >
          <Tooltip label="이미지 추가">
            <ActionIcon variant="light" color="blue">
              <IconPhoto style={{ width: '70%', height: '70%' }} />
            </ActionIcon>
          </Tooltip>
        </Dropzone>
      ),
      label: '이미지',
    },
    {
      icon: (
        <Tooltip label="텍스트 추가">
          <ActionIcon variant="light" color="blue" onClick={onTextAdd}>
            <IconTextGrammar style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        </Tooltip>
      ),
      label: '텍스트',
    },
    {
      icon: (
        <Tooltip label="배경 선택">
          <ActionIcon variant="light" color="blue" onClick={onBackgroundSelect}>
            <IconPalette style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        </Tooltip>
      ),
      label: '배경',
    },
    {
      icon: (
        <Tooltip label={isFlipped ? '앞면으로' : '뒷면으로'}>
          <ActionIcon variant="light" color="blue" onClick={onFlip}>
            <IconRotate3d style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        </Tooltip>
      ),
      label: isFlipped ? '앞면으로' : '뒷면으로',
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
          <Grid.Col span={footerActions.length === 4 ? 3 : 2.4} key={index}>
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

export default CreatePageDefaultFooter;
