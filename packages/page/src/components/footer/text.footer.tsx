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
  Box,
  NumberInput,
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
        <NumberInput
          value={fontSize}
          onChange={(value) => onFontSizeChange(value || 8)}
          min={8}
          max={72}
          style={{ width: 70 }}
          size="xs"
          rightSection={<Text size="xs">px</Text>}
        />
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
        p={0}
        style={{
          borderTop: '1px solid var(--mantine-color-dark-4)',
          position: 'fixed',
          bottom: 0,
          width: '100%'
        }}
      >
        <Box
          style={{
            overflowX: 'scroll',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }}
        >
          <Box style={{ padding: '8px 16px', width: '100%' }}>
            <Group 
              justify="space-between" 
              wrap="nowrap" 
              style={{ 
                width: '100%',
                gap: '16px'
              }}
            >
              {footerActions.map((action, index) => (
                <Box key={index} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  {action.icon}
                </Box>
              ))}
            </Group>
          </Box>
        </Box>
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
