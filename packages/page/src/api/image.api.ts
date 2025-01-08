import { useState } from 'react';
import apiClient from '../common/http.client';
import ApiResponse from '../common/response';
import useErrorStore from '../store/error.store';

const useImageApi = () => {
  const [presignedUrl, setPresignedUrl] = useState<string>();
  const getPresignedUrl = async (path: string) => {
    const response = await apiClient.get<ApiResponse<string>>(`/image/${path}`);
    setPresignedUrl(response.data);
    return response.data;
  };

  return { presignedUrl, getPresignedUrl };
};

export default useImageApi;
