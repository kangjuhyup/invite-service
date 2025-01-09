import {
  AppShell,
  Grid,
  Group,
  ActionIcon,
  Text,
  Select,
  NumberInput,
} from '@mantine/core';
import { IconBold, IconCheck, IconMinus, IconPlus } from '@tabler/icons-react';

interface TextControlFooterProps {
  onFontSizeChange: (size: number) => void;
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
  fontSize,
  isBold,
  currentFont,
}: TextControlFooterProps) => {
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
      label: '글자 크기',
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
          style={{ width: 150 }}
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
    </AppShell.Footer>
  );
};

export default TextControlFooter;
