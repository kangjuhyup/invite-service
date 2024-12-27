import { useState } from 'react';
import apiClient from '../common/http.client';
import ApiResponse from '../common/response';
import useErrorStore from '../store/error.store';
import useLoginStore from '@/store/login.store';

interface ProfileResponse {
  userId: string;
  email: string;
  nickName: string;
}

const useUserApi = () => {
  const { setError } = useErrorStore();
  const { access } = useLoginStore();
  const [profile, setProfile] = useState<ProfileResponse>();
  const getProfile = async () => {
    const response = await apiClient.get<ApiResponse<ProfileResponse>>(
      `/user`,
      {
        headers: {
          Authorization: `Bearer ${access ?? ''}`,
        },
      },
    );
    if (!response.result) {
      setError(response.error);
    } else {
      setProfile(response.data);
    }
  };

  return { profile, getProfile };
};

export default useUserApi;
