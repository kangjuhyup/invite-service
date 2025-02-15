import {useState} from 'react';
import {Alert} from 'react-native';
import {
  Comment,
  getComments,
  createComment,
  deleteComment,
} from '../api/comment';

export const useComments = (letterId?: number) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');

  const loadComments = async () => {
    if (!letterId) return;
    try {
      setLoading(true);
      const response = await getComments(letterId);
      if (response.result && response.data) {
        setComments(response.data.comments);
      } else {
        Alert.alert('오류', '댓글을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 로딩 실패:', error);
      Alert.alert('오류', '댓글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !letterId) return;

    try {
      const response = await createComment(letterId, {
        editor: 'Anonymous', // TODO: 실제 사용자 정보로 변경
        body: newComment.trim(),
      });

      if (response.result && response.data) {
        setComments(prev => [...prev, response.data]);
        setNewComment('');
      } else {
        Alert.alert('오류', '댓글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      Alert.alert('오류', '댓글 작성에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!letterId) return;

    try {
      const response = await deleteComment(letterId, commentId.toString());
      if (response.result) {
        setComments(prev => prev.filter(c => c.id !== commentId));
      } else {
        Alert.alert('오류', '댓글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      Alert.alert('오류', '댓글 삭제에 실패했습니다.');
    }
  };

  return {
    comments,
    loading,
    newComment,
    setNewComment,
    loadComments,
    handleSubmitComment,
    handleDeleteComment,
  };
};
