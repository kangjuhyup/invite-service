import {Platform} from 'react-native';
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from '../utils/token';
import {resignToken} from './auth';

export const BASE_URL = Platform.select({
  ios: 'http://192.168.0.18:3003',
  android: 'http://10.0.2.2:3000',
});

interface ApiResponse<T> {
  result: boolean;
  data: T;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = {
  async fetch<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      // access token 가져오기
      const accessToken = await getAccessToken();

      // 기본 headers에 Authorization 추가
      const headers = {
        'Content-Type': 'application/json',
        ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : {}),
        ...options.headers,
      };

      // API 요청
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      // 401 에러 (Unauthorized) 처리
      if (response.status === 401) {
        // refresh token으로 토큰 갱신 시도
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          throw new ApiError(401, '로그인이 필요합니다');
        }

        try {
          // 토큰 갱신
          const tokenResponse = await resignToken(refreshToken);
          await saveTokens(
            tokenResponse.data.access,
            tokenResponse.data.refresh,
          );

          // 새로운 access token으로 원래 요청 재시도
          const newResponse = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${tokenResponse.data.access}`,
            },
          });

          if (!newResponse.ok) {
            throw new ApiError(newResponse.status, '요청 실패');
          }

          return newResponse.json();
        } catch (error) {
          // 토큰 갱신 실패 시 로그아웃 처리
          await clearTokens();
          throw new ApiError(
            401,
            '세션이 만료되었습니다. 다시 로그인해주세요.',
          );
        }
      }

      if (!response.ok) {
        throw new ApiError(response.status, '요청 실패');
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('API 요청 실패');
    }
  },

  get<T>(endpoint: string, options: Omit<RequestInit, 'method'> & { params?: Record<string, any> } = {}) {
    const { params, ...fetchOptions } = options;
    
    let queryString = '';
    if (params) {
      const validParams = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
      
      if (validParams.length > 0) {
        queryString = `?${validParams.join('&')}`;
      }
    }

    return this.fetch<T>(`${endpoint}${queryString}`, {
      ...fetchOptions,
      method: 'GET',
    });
  },

  post<T>(
    endpoint: string,
    data?: any,
    options: Omit<RequestInit, 'method' | 'body'> = {},
  ) {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put<T>(
    endpoint: string,
    data?: any,
    options: Omit<RequestInit, 'method' | 'body'> = {},
  ) {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete<T>(endpoint: string, options: Omit<RequestInit, 'method'> = {}) {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  },

  patch<T>(
    endpoint: string,
    data?: any,
    options: Omit<RequestInit, 'method' | 'body'> = {},
  ) {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
