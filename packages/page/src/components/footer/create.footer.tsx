import { Group, Button } from '@mantine/core';
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
  return (
    <Group
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '20px',
        background: 'white',
        borderTop: '1px solid #ddd',
      }}
    >
      <Dropzone
        onDrop={onImageDrop}
        accept={['image/*']}
        style={{ border: 'none', background: 'none', padding: 0 }}
      >
        <Button>
          <IconPhoto size={20} style={{ marginRight: 10 }} />
          이미지
        </Button>
      </Dropzone>
      <Button onClick={onTextAdd}>
        <IconTextGrammar size={20} style={{ marginRight: 10 }} />
        텍스트
      </Button>
      <Button onClick={onBackgroundSelect}>
        <IconPalette size={20} style={{ marginRight: 10 }} />
        배경
      </Button>
      <Button onClick={onSave}>
        <IconDeviceFloppy size={20} style={{ marginRight: 10 }} />
        저장
      </Button>
    </Group>
  );
};

export default CreatePageDefaultFooter;
