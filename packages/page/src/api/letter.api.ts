import { useState } from 'react';
import apiClient from '../common/http.client';
import ApiResponse from '../common/response';
import useErrorStore from '../store/error.store';
import { PrepareRequest, PrepareResponse } from './dto/letter.dto';
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
  const getLetterMock = async (letterId: number) => {
    setLetter({
      id: 1,
      img: 'https://yimgf-thinkzon.yesform.com/docimgs/public/1/62/61676/61675904.png',
      comments: [{ name: '강주협', body: '무조건 참석합니다!' }],
    });
  };
  return {
    letter,
    getLetter,
    getLetterMock,
    prepareUrls,
    getPrepareUrls,
  };
};

export default useLetterApi;
