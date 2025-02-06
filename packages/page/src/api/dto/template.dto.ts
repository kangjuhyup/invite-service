import { Background, Component } from "./letter.dto";

export interface CreateTemplateRequest {
  letterId: number;
}

export interface CreateTemplateResponse {
  templateId: number;
}

export interface GetTemplatePageRequest {
  startAt: number;
  limit: number;
}

export interface GetTemplatePageResponse {
  totalCount: number;
  templates: TemplatePageItem[];
}

export interface TemplatePageItem {
  templateId: number;
  userId: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  forkCount: number;
  viewCount: number;
}

export interface GetTemplateDetailRequest {
  templateId: number;
}

export interface GetTemplateDetailResponse {
  templateId: number;
  userId: string;
  background: Background;
  components: Component[];
}
