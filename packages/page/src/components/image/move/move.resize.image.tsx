import { FileWithPath } from '@mantine/dropzone';
import useMoveResize from './move.resize.hook';
import { useEffect } from 'react';

export interface FileInfo {
  file: FileWithPath;
  size: { width: number; height: number };
  position: { x: number; y: number };
}

interface MoveResizeImageProps {
  fileInfo: FileInfo;
  onUpdate: (data: FileInfo) => void;
}

const MoveResizeImage = ({ fileInfo, onUpdate }: MoveResizeImageProps) => {
  const { size, position, handleMouseDown, init } = useMoveResize();

  useEffect(() => {
    init(fileInfo.size, fileInfo.position);
  }, []);
  useEffect(() => {
    if (fileInfo) onUpdate({ file: fileInfo.file, size, position });
  }, [size, position]);
  return (
    <div
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        cursor: 'move', // 드래그할 때 마우스 커서 변경
      }}
      onTouchStart={handleMouseDown}
      onMouseDown={handleMouseDown} // 마우스 버튼을 눌렀을 때 드래그 시작
    >
      <img
        src={URL.createObjectURL(fileInfo.file)}
        alt={fileInfo.file.name}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
      <div
        className="resize-handle"
        onTouchStart={handleMouseDown}
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

export default MoveResizeImage;
