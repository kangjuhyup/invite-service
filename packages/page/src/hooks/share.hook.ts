import { useEffect } from 'react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH
  ? `/${process.env.NEXT_PUBLIC_BASE_PATH}`
  : '';

declare global {
  interface Window {
    Kakao: any;
  }
}

interface ShareOptions {
  title?: string;
  description?: string;
  imageUrl?: string;
  url?: string;
}

export const useShare = () => {
  useEffect(() => {
    const initKakao = async () => {
      try {
        const response = await fetch(`${basePath}/api/kakao/key`);
        const data = await response.json();
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(data.key);
        }
      } catch (error) {
        console.error('Failed to initialize Kakao SDK:', error);
      }
    };
    initKakao();
  }, []);

  const handleKakaoShare = (options: ShareOptions) => {
    const {
      title = '초대장이 도착했습니다!',
      description = '',
      imageUrl = '',
      url = window.location.href,
    } = options;

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title,
        description,
        imageUrl,
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
      buttons: [
        {
          title: '초대장 보기',
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
      ],
    });
  };

  return { handleKakaoShare };
};
