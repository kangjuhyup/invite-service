import {apiClient} from './client';
import ApiResponse from '../../../../page/src/common/response';
import {HttpResponse} from './letter';

export interface SendVerifyCodeResponse {
  result: boolean;
  data: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface VerifyCodeResponse {
  result: boolean;
  data: string;
}

/**
 * 이메일 인증 코드 전송
 */
export const sendVerifyCode = async (
  email: string,
): Promise<HttpResponse<SendVerifyCodeResponse>> => {
  return await apiClient.get<SendVerifyCodeResponse>(
    `/api/mail/verify?email=${email}`,
    {
      credentials: 'include',
    },
  );
};

/**
 * 이메일 인증 코드 확인
 */
export const verifyCode = async (
  payload: VerifyCodeRequest,
): Promise<HttpResponse<VerifyCodeResponse>> => {
  return await apiClient.post<VerifyCodeResponse>('/api/mail/verify', payload, {
    credentials: 'include',
  });
};
