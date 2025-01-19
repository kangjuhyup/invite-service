import { ColorPicker, FileInput, Stack, Group, Button } from '@mantine/core';
import { IconPhoto, IconPalette } from '@tabler/icons-react';
import { useState } from 'react';

interface BackgroundSelectProps {
  onColorSelect: (color: string) => void;
  onImageSelect: (image: string) => void;
}

const BackgroundSelect = ({
  onColorSelect,
  onImageSelect,
}: BackgroundSelectProps) => {
  const [isColorMode, setIsColorMode] = useState(true);

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Stack>
      <Group>
        <Button
          variant={isColorMode ? 'filled' : 'light'}
          onClick={() => setIsColorMode(true)}
          leftIcon={<IconPalette size={20} />}
        >
          색상
        </Button>
        <Button
          variant={!isColorMode ? 'filled' : 'light'}
          onClick={() => setIsColorMode(false)}
          leftIcon={<IconPhoto size={20} />}
        >
          이미지
        </Button>
      </Group>

      {isColorMode ? (
        <ColorPicker
          format="rgba"
          swatches={[
            '#25262b',
            '#868e96',
            '#fa5252',
            '#e64980',
            '#be4bdb',
            '#7950f2',
            '#4c6ef5',
            '#228be6',
            '#15aabf',
            '#12b886',
            '#40c057',
            '#82c91e',
            '#fab005',
            '#fd7e14',
          ]}
          onChange={onColorSelect}
        />
      ) : (
        <FileInput
          placeholder="이미지 선택"
          accept="image/*"
          onChange={handleImageChange}
        >
          <IconPhoto size={14} />
        </FileInput>
      )}
    </Stack>
  );
};

export default BackgroundSelect;
