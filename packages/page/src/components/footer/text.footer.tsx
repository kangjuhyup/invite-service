import {
  AppShell,
  Grid,
  Group,
  ActionIcon,
  Text,
  Select,
  NumberInput,
  ColorPicker,
} from '@mantine/core';
import {
  IconBold,
  IconCheck,
  IconColorPicker,
  IconMinus,
  IconPlus,
} from '@tabler/icons-react';
import { useState, useRef } from 'react';

interface TextControlFooterProps {
  onFontSizeChange: (size: number) => void;
  onColorSelect: (color: string) => void;
  onBoldToggle: () => void;
  onFontChange: (font: string) => void;
  onComplete: () => void;
  fontSize: number;
  isBold: boolean;
  currentFont: string;
}

const TextControlFooter = ({
  onFontSizeChange,
  onBoldToggle,
  onFontChange,
  onComplete,
  onColorSelect,
  fontSize,
  isBold,
  currentFont,
}: TextControlFooterProps) => {
  const [openPicker, setOpenPicker] = useState(false);
  const colorButtonRef = useRef<HTMLButtonElement | null>(null);

  const fontOptions = [
    { value: 'Noto Sans KR', label: 'Noto Sans' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
  ];

  const footerActions = [
    {
      icon: (
        <Group>
          <ActionIcon
            variant="light"
            color="blue"
            onClick={() => onFontSizeChange(fontSize - 1)}
            disabled={fontSize <= 8}
          >
            <IconMinus style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
          <Text size="sm">{fontSize}px</Text>
          <ActionIcon
            variant="light"
            color="blue"
            onClick={() => onFontSizeChange(fontSize + 1)}
            disabled={fontSize >= 72}
          >
            <IconPlus style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        </Group>
      ),
      label: '크기',
    },
    {
      icon: (
        <ActionIcon
          variant="light"
          color="blue"
          onClick={() => setOpenPicker((prev) => !prev)}
          ref={colorButtonRef}
        >
          <IconColorPicker style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      ),
      label: '색상',
    },
    {
      icon: (
        <ActionIcon
          variant={isBold ? 'filled' : 'light'}
          color="blue"
          onClick={onBoldToggle}
        >
          <IconBold style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      ),
      label: '굵게',
    },
    {
      icon: (
        <Select
          value={currentFont}
          onChange={(value) => onFontChange(value || 'Noto Sans KR')}
          data={fontOptions}
        />
      ),
      label: '글꼴',
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
        position: 'relative',
      }}
    >
      <Grid>
        {footerActions.map((action, index) => (
          <Grid.Col span={3} key={index}>
            <Group justify="center" gap="xs">
              {action.icon}
              <Text size="sm">{action.label}</Text>
            </Group>
          </Grid.Col>
        ))}
      </Grid>
      {openPicker && (
        <div
          style={{
            position: 'absolute',
            top: colorButtonRef.current
              ? colorButtonRef.current.getBoundingClientRect().top - 200
              : 0,
            left: colorButtonRef.current
              ? colorButtonRef.current.getBoundingClientRect().left
              : 0,
            zIndex: 10,
            background: 'white',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '10px',
            borderRadius: '8px',
          }}
        >
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
        </div>
      )}
    </AppShell.Footer>
  );
};

export default TextControlFooter;
