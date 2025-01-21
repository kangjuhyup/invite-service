import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import useLoginStore from '@/store/login.store';

const LoginContext = createContext<ReturnType<typeof useLoginStore> | null>(
  null,
);

export const LoginProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const store = useLoginStore();

  useEffect(() => {
    const checkAccessToken = () => {
      if (router.pathname === '/page/login') {
        return;
      }

      if (router.query.isView === 'true') {
        return;
      }
      const { access } = store;
      if (!access) {
        console.error('로그인되지 않았습니다.');
        router.replace('/page/login');
        return;
      }

      try {
        const tokenData = JSON.parse(atob(access.split('.')[1]));
        const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
        const currentTime = new Date().getTime();

        if (currentTime >= expirationTime) {
          store.clearToken();
          router.replace('/page/login');
        }
      } catch (error) {
        store.clearToken();
        router.replace('/page/login');
      }
    };

    checkAccessToken();
    const intervalId = setInterval(checkAccessToken, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, [router, store]);

  useEffect(() => {
    const { access } = store;

    if (!access && router.pathname !== '/page/login') {
      router.replace('/page/login');
    }
  }, [store.access, router]);

  return (
    <LoginContext.Provider value={store}>{children}</LoginContext.Provider>
  );
};
