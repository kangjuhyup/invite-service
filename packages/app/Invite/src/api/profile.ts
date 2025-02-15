import {apiClient} from './client';
import ApiResponse from '../../../../page/src/common/response';

export interface ProfileResponse {
  userId: string;
  email: string;
  nickName: string;
  profileImage?: string;
}

export interface UpdateProfileRequest {
  nickName?: string;
}

export interface PrepareImageResponse {
  url: string;
  sessionKey: string;
  urlExpires: number;
}

// 프로필 정보 조회
export const getProfile = async (): Promise<ApiResponse<ProfileResponse>> => {
  return await apiClient.get<ProfileResponse>('/api/user', {
    credentials: 'include',
  });
};

// 프로필 정보 업데이트 (닉네임)
export const updateProfile = async (data: UpdateProfileRequest): Promise<ApiResponse<ProfileResponse>> => {
  return await apiClient.patch<ProfileResponse>('/api/user', data, {
    credentials: 'include',
  });
};

// 프로필 이미지 업로드를 위한 presigned URL 요청
export const prepareProfileImage = async (): Promise<ApiResponse<PrepareImageResponse>> => {
  return await apiClient.get<PrepareImageResponse>('/api/user/profile-image/prepare-add', {
    credentials: 'include',
  });
};

// 프로필 이미지 업로드 후 처리
export const validateProfileImage = async (): Promise<ApiResponse<ProfileResponse>> => {
  return await apiClient.put<ProfileResponse>('/api/user/profile-image', null, {
    credentials: 'include',
  });
};

// S3에 이미지 업로드
export const uploadProfileImage = async (url: string, uri: string, sessionKey: string): Promise<void> => {
  await fetch(url, {
    method: 'PUT',
    body: await fetch(uri).then(r => r.blob()),
    headers: {
      'Content-Type': 'image/jpeg',
      'x-amz-meta-width': '300',  // 프로필 이미지 기본 크기
      'x-amz-meta-height': '300',
      'x-amz-meta-x': '0',
      'x-amz-meta-y': '0',
      'x-amz-meta-z': '0',
      'x-amz-meta-angle': '0',
      sessionKey: sessionKey,
    },
  });
};
