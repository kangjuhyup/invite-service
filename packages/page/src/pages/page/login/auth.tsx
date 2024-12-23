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
        });
      if (result) {
        window.location.href = 'http://localhost:3000/me/profile';
      }
    }
  };

  useEffect(() => {
    exchangeCodeForTokens();
  }, [code]);

  return <div>Processing Google Login...</div>;
};

export default CallbackPage;
