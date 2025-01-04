import useImageApi from '@/api/image.api';
import { Image } from '@mantine/core';
import { useEffect } from 'react';

interface PresignedImageProps {
  path: string;
  width?: string;
  height?: string;
}

const PresignedImage = ({ path, width, height }: PresignedImageProps) => {
  const { presignedUrl, getPresignedUrl } = useImageApi();
  useEffect(() => {
    if (path) {
      getPresignedUrl(path);
    }
  }, [path]);
  return <Image fit={'fill'} w={width} h={height} src={presignedUrl}></Image>;
};

export default PresignedImage;
