import { useState } from 'react';
import apiClient from '../common/http.client';
import ApiResponse from '../common/response';
import useErrorStore from '../store/error.store';

interface GetPresignedUrlResponse {}

const useImageApi = () => {
  const [presignedUrl, setPresignedUrl] = useState<GetPresignedUrlResponse>();
  const getPresignedUrl = async (path: string) => {
    const response = await apiClient.get<ApiResponse<GetPresignedUrlResponse>>(
      `/image/${path}`,
    );
    setPresignedUrl(response.data);
    return response.data;
  };

  return { presignedUrl, getPresignedUrl };
};

export default useImageApi;
