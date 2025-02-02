import { FileWithPath } from "@mantine/dropzone";
import useMoveResize from "./move.resize.hook";
import { useEffect } from "react";
import { IconResize, IconRotate } from "@tabler/icons-react";

export interface FileInfo {
  file: FileWithPath | string;
  size: { width: number; height: number };
  position: { x: number; y: number };
  angle?: number;
}

interface MoveResizeImageProps {
  fileInfo: FileInfo;
  isSelected?: boolean;
  onUpdate: (data: FileInfo) => void;
  onClick: () => void;
}

const MoveResizeImage = ({
  fileInfo,
  isSelected,
  onUpdate,
  onClick,
}: MoveResizeImageProps) => {
  const { size, position, angle, handleMouseDown, init } = useMoveResize();
  
  useEffect(() => {
    if (!fileInfo) return;
    init(fileInfo.position, fileInfo.size, fileInfo.angle);
  }, []);

  useEffect(() => {
    if (fileInfo) onUpdate({ file: fileInfo.file, size, position, angle });
  }, [size, position, angle]);
  
  return (
    <div
      className="image-container"
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        cursor: "move",
        border: isSelected ? "2px dashed #228be6" : "none",
        transform: `rotate(${angle}deg)`,
      }}
      onClick={onClick}
      onTouchStart={handleMouseDown}
      onMouseDown={handleMouseDown}
    >
      <img
        src={
          fileInfo.file instanceof File
            ? URL.createObjectURL(fileInfo.file)
            : fileInfo.file
        }
        style={{
          width: "100%",
          height: "100%",
        }}
      />
      {isSelected && (
        <>
          {/* 리사이즈 핸들 */}
          <div
            className="resize-handle"
            onTouchStart={handleMouseDown}
            onMouseDown={handleMouseDown}
            style={{
              position: "absolute",
              bottom: -10,
              right: -10,
              width: 20,
              height: 20,
              backgroundColor: "white",
              cursor: "se-resize",
              borderRadius: "50%",
              border: "2px solid #228be6",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            <IconResize
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) rotate(45deg)",
                width: 10,
                height: 10,
                color: "#228be6",
              }}
            />
          </div>
          {/* 회전 핸들 */}
          <div
            className="rotate-handle"
            onTouchStart={handleMouseDown}
            onMouseDown={handleMouseDown}
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              width: 20,
              height: 20,
              backgroundColor: "white",
              cursor: "grab",
              borderRadius: "50%",
              border: "2px solid #228be6",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            <IconRotate
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 12,
                height: 12,
                color: "#228be6",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MoveResizeImage;
