import { Group, Button, ActionIcon, AppShell, Grid, Text } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import {
  IconTextGrammar,
  IconDeviceFloppy,
  IconPalette,
  IconPhoto,
} from '@tabler/icons-react';
import { FileWithPath } from '@mantine/dropzone';

interface CreatePageDefaultFooterProps {
  onImageDrop: (files: FileWithPath[]) => void;
  onTextAdd: () => void;
  onSave: () => void;
  onBackgroundSelect: () => void;
}

const CreatePageDefaultFooter = ({
  onImageDrop,
  onTextAdd,
  onSave,
  onBackgroundSelect,
}: CreatePageDefaultFooterProps) => {
  const footerActions = [
    {
      icon: (
        <Dropzone
          onDrop={onImageDrop}
          accept={['image/*']}
          style={{ border: 'none', background: 'none', padding: 0 }}
        >
          <ActionIcon variant="light" color="blue">
            <IconPhoto style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        </Dropzone>
      ),
      label: '이미지',
    },
    {
      icon: (
        <ActionIcon variant="light" color="blue" onClick={onTextAdd}>
          <IconTextGrammar style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      ),
      label: '텍스트',
    },
    {
      icon: (
        <ActionIcon variant="light" color="blue" onClick={onBackgroundSelect}>
          <IconPalette style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      ),
      label: '배경',
    },
    {
      icon: (
        <ActionIcon variant="light" color="green" onClick={onSave}>
          <IconDeviceFloppy style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      ),
      label: '저장',
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
