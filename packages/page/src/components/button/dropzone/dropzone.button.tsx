import { useRef } from 'react';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { Button, Group, Text } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';

interface DropzoneButtonProps {
  onDrop: (files: FileWithPath[]) => void;
  mimeTypes: string[];
  width?: string;
  height?: string;
}

export function DropzoneButton({
  onDrop,
  mimeTypes,
  width = '100%',
  height = 'auto',
}: DropzoneButtonProps) {
  const openRef = useRef<() => void>(null);
  return (
    <>
      <Dropzone
        w={width}
        h={height}
        openRef={openRef}
        onDrop={onDrop}
        accept={mimeTypes}
      >
        <Group justify="center" gap="xl" style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="xs" inline>
              Drag images here or click to select files
            </Text>
          </div>
          <Button onClick={() => openRef.current?.()}>Select files</Button>
        </Group>
      </Dropzone>
    </>
  );
}