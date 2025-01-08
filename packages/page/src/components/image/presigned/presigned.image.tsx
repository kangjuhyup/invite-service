import useImageApi from '@/api/image.api';
import { Container, Image, Text } from '@mantine/core';
import useMoveResize from '../move/move.resize.hook';
import { useEffect, useState } from 'react';

interface PresignedImageProps {
  path: string;
  width?: string | number;
  height?: string | number;
  position?: 'relative' | 'absolute' | 'fixed';
  x?: string | number;
  y?: string | number;
  movable?: boolean;
  onUpdate?: (data: {
    size: { width: number; height: number };
    position: { x: number; y: number };
  }) => void;
}

const PresignedImage = ({
  path,
  width = '100%',
  height = '100%',
  position = 'relative',
  x = 0,
  y = 0,
  movable = false,
  onUpdate,
}: PresignedImageProps) => {
  const { presignedUrl, getPresignedUrl } = useImageApi();
  const { size, position: pos, handleMouseDown, init } = useMoveResize();
  const [contentType, setContentType] = useState<string>('');
  const [textContent, setTextContent] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (path) {
        const url = await getPresignedUrl(path);
        if (!url) return;
        const response = await fetch(url, {
          method: 'GET',
        });
        const type = response.headers.get('Content-Type') || '';
        setContentType(type);
        if (type === 'text/plain') {
          const text = await response.text();
          setTextContent(text);
        }
      }
    };
    fetchData();
  }, [path]);

  const extractNumber = (value: string | number) => {
    if (typeof value === 'string') {
      const match = value.match(/(\d+)/);
      return match ? parseInt(match[0], 10) : 0;
    }
    return value;
  };

  const initialX = extractNumber(x);
  const initialY = extractNumber(y);

  useEffect(() => {
    if (movable) {
      const initialWidth = typeof width === 'string' ? 200 : (width as number);
      const initialHeight =
        typeof height === 'string' ? 200 : (height as number);
      const initialX = extractNumber(x);
      const initialY = extractNumber(y);
      init(
        { width: initialWidth, height: initialHeight },
        { x: initialX, y: initialY },
      );
    }
  }, [movable]);

  useEffect(() => {
    if (movable && onUpdate) {
      onUpdate({ size, position: pos });
    }
  }, [size, pos]);

  const renderContent = () => {
    if (contentType === 'text/plain') {
      return (
        <Text
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
          }}
        >
          {textContent}
        </Text>
      );
    }

    return (
      <Image
        src={presignedUrl}
        alt={path}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'fill',
        }}
      />
    );
  };

  if (!movable) {
    if (contentType === 'text/plain') {
      return (
        <Text pos={position} top={y} left={x}>
          {textContent}
        </Text>
      );
    }

    return (
      <Image
        fit={'fill'}
        w={width}
        h={height}
        src={presignedUrl}
        pos={position}
        top={y}
        left={x}
      />
    );
  }

  return (
    <Container
      style={{
        position: position,
        top: pos.y,
        left: pos.x,
        width: size.width,
        height: size.height,
        cursor: 'move',
      }}
      onTouchStart={handleMouseDown}
      onMouseDown={handleMouseDown}
    >
      {renderContent()}
      <div
        className="resize-handle"
        onTouchStart={handleMouseDown}
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 20,
          height: 20,
          backgroundColor: 'gray',
          cursor: 'se-resize',
        }}
      />
    </Container>
  );
};

export default PresignedImage;
