import React, { useEffect, useState } from 'react';
import useMoveResize from '../../image/move/move.resize.hook';
import { Input, Textarea } from '@mantine/core';

export interface TextInfo {
  text: string;
  size: { width: number; height: number };
  position: { x: number; y: number };
}

interface MoveResizeTextProps {
  index: number;
  onUpdate: (text: TextInfo) => void;
}

const MoveResizeText = ({ index, onUpdate }: MoveResizeTextProps) => {
  const [currentText, setText] = useState('');
  const {
    size: currentSize,
    position: currentPosition,
    handleMouseDown,
  } = useMoveResize();

  useEffect(() => {
    onUpdate({
      text: currentText || '',
      size: currentSize,
      position: currentPosition,
    });
  }, [currentText, currentSize, currentPosition]);

  return (
    <div
      style={{
        position: 'absolute',
        top: currentPosition.y,
        left: currentPosition.x,
        width: currentSize.width,
        height: currentSize.height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseDown={handleMouseDown} // 드래그 시작
    >
      <Textarea
        value={currentText}
        onChange={(e) => setText(e.target.value)}
        w={currentSize.width}
        styles={{
          input: {
            fontSize: currentSize.width / 10,
            height: currentSize.height,
            backgroundColor: 'transparent',
            color: 'red',
          },
        }}
      />
      {/* 모서리 핸들 */}
      <div
        className="resize-handle"
        onTouchStart={handleMouseDown}
        onMouseDown={handleMouseDown} // 크기 조정 시작
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 10,
          height: 10,
          backgroundColor: 'gray',
          cursor: 'se-resize', // 크기 조정 커서
        }}
      />
    </div>
  );
};

export default MoveResizeText;
