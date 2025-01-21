import React, { useEffect } from 'react';
import { TextInput } from '@mantine/core';
import useMoveResize from '../../image/move/move.resize.hook';

export interface TextInfo {
  text: string;
  size: { width: number; height: number };
  position: { x: number; y: number };
  font: string;
  color: string;
  bold: boolean;
}

interface MoveResizeTextProps {
  index: number;
  textInfo: TextInfo;
  onUpdate: (text: Partial<TextInfo>) => void;
  onClick: () => void;
}

const MoveText = ({
  index,
  textInfo,
  onUpdate,
  onClick,
}: MoveResizeTextProps) => {
  const { position, handleMouseDown } = useMoveResize();

  useEffect(() => {
    onUpdate({
      position: {
        x: position.x,
        y: position.y,
      },
    });
  }, [position]);

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: 'move',
        userSelect: 'none',
        zIndex: 1000 + index,
        padding: '10px',
      }}
      onClick={onClick}
      onTouchStart={handleMouseDown}
      onMouseDown={handleMouseDown}
    >
      <TextInput
        value={textInfo.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        styles={{
          root: {
            width: 'auto',
          },
          input: {
            fontSize: `${textInfo.size.width}px`,
            fontFamily: textInfo.font,
            fontWeight: textInfo.bold ? 'bold' : 'normal',
            background: 'transparent',
            border: 'none',
            color: textInfo.color,
            padding: 0,
            '&:focus': {
              border: '1px dashed #228be6',
            },
          },
        }}
      />
    </div>
  );
};

export default MoveText;
