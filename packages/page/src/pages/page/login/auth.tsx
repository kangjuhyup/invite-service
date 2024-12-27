import { useRouter } from 'next/router';
import apiClient from '../../../common/http.client';
import { useEffect } from 'react';
import useLoginStore from '@/store/login.store';

const CallbackPage = () => {
  const router = useRouter();
  const store = useLoginStore();
  const { code } = router.query;

  const exchangeCodeForTokens = async () => {
    if (code) {
      const { result, data } = await apiClient
        .post<{
          result: boolean;
          data: {
            access: string;
            refresh: string;
          };
        }>('/auth/signin/google', { code })
        .catch((err) => {
          alert('로그인 실패');
          window.location.href = `${process.env.NEXT_PUBLIC_PAGE_URL}/login`;
          throw err;
        });
      if (result) {
        store.setToken({
          ...data,
        });
        router.replace('/page/me/profile');
      }
    }
  };

  useEffect(() => {
    exchangeCodeForTokens();
  }, [code]);

  return <div>Processing Google Login...</div>;
};

export default CallbackPage;
