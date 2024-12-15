import { useState } from 'react';
import apiClient from '../common/http.client';
import ApiResponse from '../common/response';
import useErrorStore from '../store/error.store';

interface LoginResponse {}

const useLoginApi = () => {
  const { setError } = useErrorStore();
  const [login, setLogin] = useState<LoginResponse>();
  const getLogin = async (letterId: number) => {
    const response = await apiClient.get<ApiResponse<LoginResponse>>(
      `/${letterId}`,
    );
    if (!response.result) {
      setError(response.error);
    } else {
      setLogin(response.data);
    }
  };

  return { login, getLogin };
};

export default useLoginApi;
