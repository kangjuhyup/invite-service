import { useState } from 'react';
import apiClient from '../common/http.client';
import ApiResponse from '../common/response';
import useErrorStore from '../store/error.store';
import {
  PrepareRequest,
  PrepareResponse,
  AddLetterResponse,
  AddLetterRequest,
  GetLetterPageResponse,
  GetLetterResponse,
  GetLetterDetailResponse,
  AddLetterCommentRequest,
  GetLetterCommentResponse,
} from './dto/letter.dto';
import useLoginStore from '@/store/login.store';

const useLetterApi = () => {
  const { setError } = useErrorStore();
  const { access } = useLoginStore();
  const [letter, setLetter] = useState<GetLetterResponse>();
  const [letterDetail, setLetterDetail] = useState<GetLetterDetailResponse>();
  const [letterPage, setLetterPage] = useState<GetLetterPageResponse>();
  const [prepareUrls, setPrepareUrls] = useState<PrepareResponse>();
  const [addLetter, setAddLetter] = useState<AddLetterResponse>();
  const [comments, setComments] = useState<GetLetterCommentResponse>();

  const getLetter = async (letterId: number) => {
    const response = await apiClient.get<ApiResponse<GetLetterResponse>>(
      `/letter/${letterId}`,
    );
    if (!response.result) {
      setError(response.error);
    } else {
      setLetter(response.data);
    }
  };
  const getPrepareUrls = async (request: PrepareRequest) => {
    const response = await apiClient.post<ApiResponse<PrepareResponse>>(
      `/letter/prepare-add`,
      request,
      {
        headers: {
          Authorization: `Bearer ${access ?? ''}`,
        },
      },
    );
    if (!response.result) {
      setError(response.error);
    } else {
      setPrepareUrls(response.data);
    }
  };
  const postAddLetter = async (request: AddLetterRequest) => {
    const response = await apiClient.post<ApiResponse<AddLetterResponse>>(
      `/letter`,
      request,
      {
        headers: {
          Authorization: `Bearer ${access ?? ''}`,
        },
      },
    );
    if (!response.result) {
      setError(response.error);
    } else {
      setAddLetter(response.data);
    }
  };

  const deleteLetter = async (letterId: number) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/letter/${letterId}`,
      {
        headers: {
          Authorization: `Bearer ${access ?? ''}`,
        },
      },
    );
    if (!response.result) {
      setError(response.error);
    }
  };

  const getLetterPage = async (limit: number, skip: number) => {
    const response = await apiClient.get<ApiResponse<GetLetterPageResponse>>(
      `/letter`,
      {
        headers: {
          Authorization: `Bearer ${access ?? ''}`,
        },
        queryParams: {
          limit,
          skip,
        },
      },
    );
    if (!response.result) {
      setError(response.error);
    } else {
      setLetterPage(response.data);
    }
  };

  const getLetterDetail = async (letterId: number) => {
    const response = await apiClient.get<ApiResponse<GetLetterDetailResponse>>(
      `/letter/detail/${letterId}`,
    );
    if (!response.result) {
      setError(response.error);
    } else {
      setLetterDetail(response.data);
    }
  };

  const getLetterComments = async (letterId: number) => {
    const response = await apiClient.get<ApiResponse<GetLetterCommentResponse>>(
      `/comment/letter/${letterId}`,
    );
    if (!response.result) {
      setError(response.error);
    } else {
      setComments(response.data);
    }
  };

  const addComment = async (letterId: number, dto: AddLetterCommentRequest) => {
    const response = await apiClient.post<ApiResponse<GetLetterDetailResponse>>(
      `/comment/letter/${letterId}`,
      dto,
      {
        headers: {
          Authorization: `Bearer ${access ?? ''}`,
        },
      },
    );
    if (!response.result) {
      setError(response.error);
    }
  };

  const deleteComment = async (commentId: number, password: string) => {
    const response = await apiClient.delete<
      ApiResponse<GetLetterDetailResponse>
    >(`/comment/${commentId}`, {
      headers: {
        Authorization: `Bearer ${access ?? ''}`,
        'x-comment-password': password,
      },
    });
    if (!response.result) {
      setError(response.error);
    }
  };

  return {
    letter,
    getLetter,
    prepareUrls,
    getPrepareUrls,
    addLetter,
    postAddLetter,
    deleteLetter,
    letterPage,
    getLetterPage,
    letterDetail,
    getLetterDetail,
    comments,
    getLetterComments,
    addComment,
    deleteComment,
  };
};

export default useLetterApi;
