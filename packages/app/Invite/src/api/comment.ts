import {apiClient} from './client';
import ApiResponse from '../../../../page/src/common/response';
import {HttpResponse} from './letter';

export interface Comment {
  id: number;
  editor: string;
  body: string;
}

export interface CreateCommentRequest {
  editor: string;
  body: string;
}

export interface GetCommentsResponse {
  letterId: number;
  comments: Comment[];
}

export interface CreateCommentResponse {
  result: boolean;
  data: Comment;
}

export const getComments = async (
  letterId: number,
): Promise<HttpResponse<GetCommentsResponse>> => {
  return await apiClient.get<GetCommentsResponse>(
    `/api/comment/letter/${letterId}`,
  );
};

export const createComment = async (
  letterId: string,
  request: CreateCommentRequest,
): Promise<CreateCommentResponse> => {
  const response = await apiClient.post<CreateCommentResponse>(
    `/comment/letter/${letterId}`,
    request,
  );
  return response.data;
};

export const deleteComment = async (
  letterId: string,
  commentId: string,
): Promise<{result: boolean}> => {
  const response = await apiClient.delete<{result: boolean}>(
    `/comment/letter/${letterId}/${commentId}`,
  );
  return response.data;
};
