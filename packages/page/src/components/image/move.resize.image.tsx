import { FileWithPath } from '@mantine/dropzone';

interface MoveResizeImageProps {
  onMove: (e: React.MouseEvent) => void;
  onResize: (e: React.MouseEvent) => void;
  x: number;
  y: number;
  width: number;
  height: number;
  file: FileWithPath;
}

const MoveResizeImage = ({
  onMove,
  onResize,
  x,
  y,
  width,
  height,
  file,
}: MoveResizeImageProps) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: x,
        width: width,
        height: height,
        cursor: 'move', // 드래그할 때 마우스 커서 변경
      }}
      onMouseDown={onMove} // 마우스 버튼을 눌렀을 때 드래그 시작
    >
      <img
        src={URL.createObjectURL(file)}
        alt={file.name}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
      <div
        className="resize-handle"
        onMouseDown={onResize} // 크기 조정 시작
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
