import { AppShell, Grid, Group, ActionIcon, Text } from '@mantine/core';
import { MIME_TYPES } from '@mantine/dropzone';
import {
  IconTextGrammar,
  IconSticker,
  IconDeviceFloppy,
} from '@tabler/icons-react';
import { DropzoneButton } from '../button/dropzone/dropzone.button';
import { FileWithPath } from '@mantine/dropzone';

interface CreateFooterProps {
  onImageDrop: (files: FileWithPath[]) => void;
  onTextAdd: () => void;
  onSave: () => void;
  onStickerAdd?: () => void;
}

const CreatePageDefaultFooter = ({
  onImageDrop,
  onTextAdd,
  onSave,
  onStickerAdd,
}: CreateFooterProps) => {
  const footerActions = [
    {
      icon: (
        <DropzoneButton
          onDrop={onImageDrop}
          mimeTypes={[MIME_TYPES.png, MIME_TYPES.gif, MIME_TYPES.jpeg]}
        />
      ),
      label: 'Drop Image',
    },
    {
      icon: <IconTextGrammar style={{ width: '70%', height: '70%' }} />,
      label: 'Input Text',
      onClick: onTextAdd,
      variant: 'light' as const,
      color: 'blue' as const,
    },
    {
      icon: <IconSticker style={{ width: '70%', height: '70%' }} />,
      label: 'Use Sticker',
      onClick: onStickerAdd,
      variant: 'light' as const,
      color: 'blue' as const,
      size: 'lg' as const,
    },
    {
      icon: <IconDeviceFloppy style={{ width: '70%', height: '70%' }} />,
      label: 'Save',
      onClick: onSave,
      variant: 'light' as const,
      color: 'blue' as const,
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
          <Grid.Col span={3} key={action.label}>
            <Group justify="center">
              {action.icon instanceof DropzoneButton ? (
                action.icon
              ) : (
                <ActionIcon
                  variant={action.variant}
                  color={action.color}
                  size={action.size}
                  onClick={action.onClick}
                >
                  {action.icon}
                </ActionIcon>
              )}
              <Text>{action.label}</Text>
            </Group>
          </Grid.Col>
        ))}
      </Grid>
    </AppShell.Footer>
  );
};

export default CreatePageDefaultFooter;
