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
    const { access } = store;

    if (!access && router.pathname !== '/page/login') {
      router.replace('/page/login');
    }
  }, [store.access, router]);

  return (
    <LoginContext.Provider value={store}>{children}</LoginContext.Provider>
  );
};

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error('useLogin must be used within a LoginProvider');
  }
  return context;
};
