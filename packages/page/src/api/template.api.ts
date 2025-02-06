import { useState } from "react";
import apiClient from "../common/http.client";
import ApiResponse from "../common/response";
import useErrorStore from "../store/error.store";
import {
  CreateTemplateRequest,
  CreateTemplateResponse,
  GetTemplateDetailRequest,
  GetTemplateDetailResponse,
  GetTemplatePageRequest,
  GetTemplatePageResponse,
} from "./dto/template.dto";
import useLoginStore from "@/store/login.store";

const useTemplateApi = () => {
  const { setError } = useErrorStore();
  const { access } = useLoginStore();
  const [createTemplateResponse, setCreateResponse] =
    useState<CreateTemplateResponse>();
  const [templatePageResponse, setTemplatePageResponse] =
    useState<GetTemplatePageResponse>();
  const [templateDetailResponse, setTemplateDetailResponse] =
    useState<GetTemplateDetailResponse>();
  const getTemplateDetail = async (path: GetTemplateDetailRequest) => {
    const response = await apiClient.get<
      ApiResponse<GetTemplateDetailResponse>
    >(`/template/${path.templateId}`, {
      headers: {
        Authorization: `Bearer ${access ?? ""}`,
      },
    });
    if (!response.result) {
      setError(response.error);
    } else {
      setTemplateDetailResponse(response.data);
    }
  };
  const getTemplatePage = async (query: GetTemplatePageRequest) => {
    const response = await apiClient.get<ApiResponse<GetTemplatePageResponse>>(
      `/template?startAt=${query.startAt}&limit=${query.limit}`,
      {
        headers: {
          Authorization: `Bearer ${access ?? ""}`,
        },
      }
    );
    if (!response.result) {
      setError(response.error);
    } else {
      setTemplatePageResponse(response.data);
    }
  };
  const createTemplate = async (dto: CreateTemplateRequest) => {
    const response = await apiClient.post<ApiResponse<CreateTemplateResponse>>(
      "/template",
      dto,
      {
        headers: {
          Authorization: `Bearer ${access ?? ""}`,
        },
      }
    );
    if (!response.result) {
      setError(response.error);
    } else {
      setCreateResponse(response.data);
    }
  };

  return {
    createTemplateResponse,
    createTemplate,
    templatePageResponse,
    getTemplatePage,
    templateDetailResponse,
    getTemplateDetail,
  };
};

export default useTemplateApi;
