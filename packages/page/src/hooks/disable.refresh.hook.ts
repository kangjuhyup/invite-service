import { useEffect } from 'react';

const disablePullToRefresh = () => {
  const preventPullToRefresh = (event: TouchEvent) => {
    if (event.touches.length > 1 || window.scrollY === 0) {
      event.preventDefault();
    }
  };

  document.addEventListener('touchmove', preventPullToRefresh, {
    passive: false,
  });

  return () => {
    document.removeEventListener('touchmove', preventPullToRefresh);
  };
};

export const useDisablePullToRefresh = () => {
  useEffect(() => {
    const cleanup = disablePullToRefresh();
    return () => cleanup();
  }, []);
};
