import {apiClient} from './client';
import {Background, Component, LetterCategoryCode} from './letter';
import ApiResponse from '../../../../page/src/common/response';

export interface GetTemplatePageRequest {
  startAt?: number;
  limit: number;
  category?: LetterCategoryCode;
  title?: string;
  userId?: string;
}

export interface TemplatePageItem {
  templateId: number;
  title: string;
  category: LetterCategoryCode;
  userId: string;
  thumbnailUrl: string;
  forkCount: number;
  viewCount: number;
}

export interface GetTemplatePageResponse {
  totalCount: number;
  limit: number;
  startAt: number;
  templates: TemplatePageItem[];
}

export const getTemplates = async (
  params: GetTemplatePageRequest,
): Promise<ApiResponse<GetTemplatePageResponse>> => {
  return await apiClient.get<GetTemplatePageResponse>('/api/template', {
    params,
    credentials: 'include',
  });
};

export interface TemplateDetailResponse {
  templateId: number;
  userId: string;
  background: Background;
  components: Component[];
}

export const getTemplateDetail = async (
  id: number,
): Promise<ApiResponse<TemplateDetailResponse>> => {
  return await apiClient.get<TemplateDetailResponse>(`/api/template/${id}`, {
    credentials: 'include',
  });
};

export interface CreateTemplateResponse {
  templateId: number;
}

export const createTemplate = async (
  letterId: number,
): Promise<ApiResponse<CreateTemplateResponse>> => {
  return await apiClient.post<CreateTemplateResponse>('/api/template', {
    letterId,
  });
};
