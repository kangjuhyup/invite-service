import useImageApi from '@/api/image.api';
import { Image } from '@mantine/core';
import { useEffect } from 'react';

interface PresignedImageProps {
  path: string;
  width?: string;
  height?: string;
  position?: 'relative' | 'absolute' | 'fixed';
  x?: string;
  y?: string;
}

const PresignedImage = ({
  path,
  width = '100%',
  height = '100%',
  position,
  x,
  y,
}: PresignedImageProps) => {
  const { presignedUrl, getPresignedUrl } = useImageApi();
  useEffect(() => {
    if (path) {
      getPresignedUrl(path);
    }
  }, [path]);
  return (
    <Image
      fit={'fill'}
      w={width}
      h={height}
      src={presignedUrl}
      pos={position}
      top={y}
      left={x}
    ></Image>
  );
};

export default PresignedImage;
