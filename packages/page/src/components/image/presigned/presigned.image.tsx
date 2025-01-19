import useImageApi from '@/api/image.api';
import { Container, Image, Text } from '@mantine/core';
import useMoveResize from '../move/move.resize.hook';
import { useEffect, useState, useCallback, CSSProperties } from 'react';

interface ContentData {
  type: string;
  text?: string;
  url?: string;
}

interface PresignedImageProps {
  path: string;
  width?: string | number;
  height?: string | number;
  position?: 'relative' | 'absolute' | 'fixed';
  x?: string | number;
  y?: string | number;
  movable?: boolean;
  style?: CSSProperties;
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
  style,
  onUpdate,
}: PresignedImageProps) => {
  const { presignedUrl, getPresignedUrl } = useImageApi();
  const { size, position: pos, handleMouseDown, init } = useMoveResize();
  const [contentData, setContentData] = useState<ContentData>({ type: '' });

  const fetchContentData = useCallback(
    async (url: string): Promise<ContentData> => {
      try {
        const response = await fetch(url, { method: 'GET' });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const type = response.headers.get('Content-Type') || '';
        if (type === 'text/plain') {
          const text = await response.text();
          return { type, text, url };
        }
        return { type, url };
      } catch (error) {
        console.error('Error fetching content:', error);
        return { type: '' };
      }
    },
    [],
  );

  useEffect(() => {
    const initializeContent = async () => {
      if (!path || presignedUrl) return;

      const url = await getPresignedUrl(path);
      if (!url) return;

      // 이미 같은 URL로 데이터를 가져왔다면 다시 가져오지 않음
      if (contentData.url === url) return;

      const data = await fetchContentData(url);
      setContentData(data);
    };
    initializeContent();
  }, [path]);

  const extractNumber = (value: string | number) => {
    if (typeof value === 'string') {
      const match = value.match(/(\d+)/);
      return match ? parseInt(match[0], 10) : 0;
    }
    return value;
  };

  useEffect(() => {
    if (movable) {
      const initialWidth = typeof width === 'string' ? 200 : (width as number);
      const initialHeight =
        typeof height === 'string' ? 200 : (height as number);
      const initialX = extractNumber(x);
      const initialY = extractNumber(y);
      init(
        { x: initialX, y: initialY },
        { width: initialWidth, height: initialHeight },
      );
    }
  }, []);

  useEffect(() => {
    if (movable && onUpdate) {
      onUpdate({ size, position: pos });
    }
  }, [size, pos, movable, onUpdate]);

  const renderContent = () => {
    if (contentData.type === 'text/plain' && contentData.text) {
      return (
        <Text
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
          }}
        >
          {contentData.text}
        </Text>
      );
    }

    return (
      <Image
        src={contentData.url}
        alt={path}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'fill',
          ...style,
        }}
      />
    );
  };

  if (!movable) {
    if (contentData.type === 'text/plain' && contentData.text) {
      return (
        <Text pos={position} top={y} left={x} style={style}>
          {contentData.text}
        </Text>
      );
    }

    return (
      <Image
        fit={'fill'}
        w={width}
        h={height}
        src={contentData.url}
        pos={position}
        top={y}
        left={x}
        style={style}
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
        ...style,
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
