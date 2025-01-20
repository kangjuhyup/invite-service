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

  const removeBackground = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post<ArrayBuffer>('/image/bg-remove', formData, {
      responseType: 'arraybuffer',
    });
  };

  return { presignedUrl, getPresignedUrl, removeBackground };
};

export default useImageApi;
