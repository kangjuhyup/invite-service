import { useRef } from 'react';
import { IconPhoto } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';

interface DropzoneButtonProps {
  onDrop: (files: FileWithPath[]) => void;
  mimeTypes: string[];
  width?: string;
  height?: string;
}

export function DropzoneButton({ onDrop, mimeTypes }: DropzoneButtonProps) {
  const openRef = useRef<() => void>(null);
  return (
    <>
      <Dropzone p={0} openRef={openRef} onDrop={onDrop} accept={mimeTypes}>
        <ActionIcon variant="light" color="blue">
          <IconPhoto style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      </Dropzone>
    </>
  );
}
