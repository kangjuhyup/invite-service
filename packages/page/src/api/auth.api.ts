import apiClient from '@/common/http.client';

const useAuthApi = () => {
  const signOut = async () => {
    try {
      await apiClient.post(
        '/auth/signout',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
            'x-refresh-token': localStorage.getItem('refresh') || '',
          },
        },
      );
      return true;
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      return false;
    }
  };

  return {
    signOut,
  };
};

export default useAuthApi;
