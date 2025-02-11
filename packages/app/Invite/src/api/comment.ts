import axios from 'axios';
import {API_URL} from '../config';

export interface Comment {
  id: string;
  letterId: string;
  userId: string;
  userNickname: string;
  userProfileImage?: string;
  content: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  content: string;
}

export const getComments = async (letterId: string): Promise<Comment[]> => {
  const response = await axios.get(`${API_URL}/letters/${letterId}/comments`);
  return response.data;
};

export const createComment = async (
  letterId: string,
  data: CreateCommentRequest,
): Promise<Comment> => {
  const response = await axios.post(
    `${API_URL}/letters/${letterId}/comments`,
    data,
  );
  return response.data;
};

export const deleteComment = async (
  letterId: string,
  commentId: string,
): Promise<void> => {
  await axios.delete(`${API_URL}/letters/${letterId}/comments/${commentId}`);
};
