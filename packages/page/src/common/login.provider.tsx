import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import useLoginStore from '@/store/login.store';

const LoginContext = createContext<ReturnType<typeof useLoginStore> | null>(
  null,
);

export const LoginProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const store = useLoginStore();

  const validateAccessToken = () => {
    const { access } = store;

    if (router.pathname === '/page/login' || router.query.isView === 'true') {
      return;
    }

    if (!access) {
      console.error('로그인되지 않았습니다.');
      store.clearToken();
      router.replace('/page/login');
      return;
    }

    try {
      const tokenData = JSON.parse(atob(access.split('.')[1]));
      const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      if (currentTime >= expirationTime) {
        console.warn('토큰이 만료되었습니다.');
        store.clearToken();
        router.replace('/page/login');
      }
    } catch (error) {
      console.error('토큰 파싱 중 오류 발생:', error);
      store.clearToken();
      router.replace('/page/login');
    }
  };

  useEffect(() => {
    if (!router.isReady) return;

    validateAccessToken();

    // 30초마다 토큰 검증
    const intervalId = setInterval(validateAccessToken, 30000);

    return () => clearInterval(intervalId);
  }, [router.isReady, store.access]);

  return (
    <LoginContext.Provider value={store}>{children}</LoginContext.Provider>
  );
};

export const useLoginContext = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error('useLoginContext must be used within a LoginProvider');
  }
  return context;
};
