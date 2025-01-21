import {
  AppShell,
  Grid,
  Group,
  ActionIcon,
  Text,
  ColorPicker,
  Modal,
  Popover,
  Stack,
  Button,
} from '@mantine/core';
import {
  IconBold,
  IconCheck,
  IconColorPicker,
  IconMinus,
  IconPlus,
  IconTextGrammar,
} from '@tabler/icons-react';
import { useState } from 'react';

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
  const [openFontSelect, setOpenFontSelect] = useState(false);

  const fontOptions = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Tahoma', label: 'Tahoma' },
    { value: 'Impact', label: 'Impact' },
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
    },
    {
      icon: (
        <ActionIcon
          variant="light"
          color="blue"
          onClick={() => setOpenPicker(true)}
        >
          <IconColorPicker style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      ),
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
    },
    {
      icon: (
        <Popover
          opened={openFontSelect}
          onChange={setOpenFontSelect}
          width={150}
          position="top"
          withArrow
          shadow="md"
        >
          <Popover.Target>
            <ActionIcon
              variant="light"
              color="blue"
              onClick={() => setOpenFontSelect((o) => !o)}
            >
              <IconTextGrammar style={{ width: '70%', height: '70%' }} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown style={{ maxHeight: '300px', overflow: 'auto' }}>
            <Stack>
              {fontOptions.map((font) => (
                <Button
                  key={font.value}
                  variant={currentFont === font.value ? 'filled' : 'light'}
                  onClick={() => {
                    onFontChange(font.value);
                    setOpenFontSelect(false);
                  }}
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                </Button>
              ))}
            </Stack>
          </Popover.Dropdown>
        </Popover>
      ),
    },
    {
      icon: (
        <ActionIcon variant="light" color="green" onClick={onComplete}>
          <IconCheck style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      ),
    },
  ];

  return (
    <>
      <AppShell.Footer
        p="md"
        style={{
          borderTop: '1px solid var(--mantine-color-dark-4)',
        }}
      >
        <Grid justify="center" align="center">
          {footerActions.map((action, index) => (
            <Grid.Col span={2} key={index}>
              <Group justify="center" align="center" gap="xs" style={{ height: '100%' }}>
                {action.icon}
              </Group>
            </Grid.Col>
          ))}
        </Grid>
      </AppShell.Footer>
      <Modal
        opened={openPicker}
        onClose={() => setOpenPicker(false)}
        title="색상 선택"
        centered
        size="sm"
      >
        <ColorPicker
          format="rgba"
          fullWidth
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
          onChange={(color) => {
            onColorSelect(color);
            setOpenPicker(false);
          }}
        />
      </Modal>
    </>
  );
};

export default TextControlFooter;
