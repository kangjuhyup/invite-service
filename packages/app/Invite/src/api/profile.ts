import {apiClient} from './client';
import ApiResponse from '../../../../page/src/common/response';

export interface ProfileResponse {
  userId: string;
  email: string;
  nickName: string;
  profileImage?: string;
}

export const getProfile = async (): Promise<ApiResponse<ProfileResponse>> => {
  return await apiClient.get<ProfileResponse>('/api/user', {
    credentials: 'include',
  });
};
