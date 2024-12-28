import { useState } from 'react';
import apiClient from '../common/http.client';
import ApiResponse from '../common/response';
import useErrorStore from '../store/error.store';
import {
  PrepareRequest,
  PrepareResponse,
  AddLetterResponse,
  AddLetterRequest,
} from './dto/letter.dto';
import useLoginStore from '@/store/login.store';

interface GetLetterResponse {
  id: number;
  img: string;
  comments: {
    name: string;
    body: string;
  }[];
}

const useLetterApi = () => {
  const { setError } = useErrorStore();
  const { access } = useLoginStore();
  const [letter, setLetter] = useState<GetLetterResponse>();
  const [prepareUrls, setPrepareUrls] = useState<PrepareResponse>();
  const [addLetter, setAddLetter] = useState<AddLetterResponse>();
  const getLetter = async (letterId: number) => {
    const response = await apiClient.get<ApiResponse<GetLetterResponse>>(
      `/${letterId}`,
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

  return {
    letter,
    getLetter,
    prepareUrls,
    getPrepareUrls,
    addLetter,
    postAddLetter,
  };
};

export default useLetterApi;
