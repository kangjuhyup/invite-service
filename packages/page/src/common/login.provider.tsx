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
    if (
      router.pathname === '/page/login' ||
      router.pathname === '/page' ||
      router.query.isView === 'true'
    ) {
      return true;
    }

    const isValid = store.checkLoginStatus();

    if (!isValid) {
      console.warn('로그인이 필요하거나 토큰이 만료되었습니다.');
      store.clearToken();
      router.replace('/page/login');
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (!router.isReady) return;

    if (store.access) {
      validateAccessToken();
    }
    // 1초마다 토큰 검증
    const intervalId = setInterval(validateAccessToken, 1000);

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
