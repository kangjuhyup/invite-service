import { useRouter } from 'next/router';
import apiClient from '../../../common/http.client';
import { useEffect } from 'react';

const CallbackPage = () => {
  const router = useRouter();
  const { code } = router.query;

  const exchangeCodeForTokens = async () => {
    if (code) {
      const { result } = await apiClient
        .post<{
          result: boolean;
        }>('/auth/signin/google', { code })
        .catch((err) => {
          alert('로그인 실패');
          window.location.href = `${process.env.NEXT_PUBLIC_PAGE_URL}/login`;
          throw err;
        });
      if (result) {
        window.location.href = `${process.env.NEXT_PUBLIC_PAGE_URL}/me/profile`;
      }
    }
  };

  useEffect(() => {
    exchangeCodeForTokens();
  }, [code]);

  return <div>Processing Google Login...</div>;
};

export default CallbackPage;
