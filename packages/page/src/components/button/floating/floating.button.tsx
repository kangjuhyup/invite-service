import { ActionIcon, Button } from '@mantine/core';
import { ReactNode } from 'react';

interface FloatingButtonProps {
  onClick: () => void;
  icon: ReactNode;
  color?: string;
  bottom?: number;
  right?: number;
}

const FloatingButton = ({
  onClick,
  icon,
  bottom = 20,
  right = 20,
  color = 'blue',
}: FloatingButtonProps) => {
  return (
    <ActionIcon
      style={{
        position: 'fixed',
        bottom: bottom,
        right: right,
        borderRadius: '50%',
        width: 50,
        height: 50,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClick}
      variant="filled"
      color={color}
    >
      {icon}
    </ActionIcon>
  );
};

export default FloatingButton;
