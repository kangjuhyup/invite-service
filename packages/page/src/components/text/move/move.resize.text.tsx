import React, { useEffect, useState } from 'react';
import useMoveResize from '../../image/move/move.resize.hook';

interface MoveResizeTextProps {
  index: number;
  onUpdate: (data: {
    index: number;
    text: string;
    size: { width: number; height: number };
    position: { x: number; y: number };
  }) => void;
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
      index,
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
        cursor: 'move', // 드래그할 때 마우스 커서 변경
      }}
      onMouseDown={handleMouseDown} // 마우스 버튼을 눌렀을 때 드래그 시작
    >
      <div
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => setText(e.currentTarget.textContent || '')} // 텍스트 입력 시 상태 변경
        style={{
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          outline: 'none', // 편집 시 기본 외곽선 제거
          caretColor: 'black', // 커서 색상 설정 (깜박이는 선)
          whiteSpace: 'pre-wrap', // 여러 줄 텍스트 처리
          fontSize: currentSize.width / 10,
        }}
      >
        {currentText}
      </div>

      <div
        className="resize-handle"
        onMouseDown={handleMouseDown} // 크기 조정 시작
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 20,
          height: 20,
          backgroundColor: 'gray',
          cursor: 'se-resize', // 크기 조정 커서
        }}
      />
    </div>
  );
};

export default MoveResizeText;
