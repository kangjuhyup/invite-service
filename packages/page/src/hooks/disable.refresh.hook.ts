import { useEffect } from 'react';

export const useDisablePullToRefresh = () => {
  useEffect(() => {
    // CSS로 overscroll-behavior 설정
    document.body.style.overscrollBehavior = 'none';

    return () => {
      // 컴포넌트 언마운트 시 원래대로 복구
      document.body.style.overscrollBehavior = 'auto';
    };
  }, []);
};
