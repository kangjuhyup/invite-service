import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type {Letter} from '../api/letter';
import {
  Comment,
  getComments,
  createComment,
  deleteComment,
} from '../api/comment';

type Props = NativeStackScreenProps<RootStackParamList, 'LetterDetail'>;

const LetterDetail: React.FC<Props> = ({route, navigation}) => {
  const letter = route.params.letter;
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (showComments) {
      console.log('load comments');
      loadComments();
    }
  }, [showComments]);

  const loadComments = async () => {
    try {
      setLoading(true);
      // 임시로 더미 데이터 사용
      const dummyComments: Comment[] = [
        {
          id: '1',
          letterId: '1',
          userId: '1',
          userNickname: '테스트 유저 1',
          content: '첫 번째 테스트 댓글입니다.',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          letterId: '1',
          userId: '2',
          userNickname: '테스트 유저 2',
          content: '두 번째 테스트 댓글입니다.',
          createdAt: new Date().toISOString(),
        },
      ];
      setComments(dummyComments);
      // const data = await getComments(letter.id);
      // setComments(data);
    } catch (error) {
      console.error('댓글 로딩 실패:', error);
      Alert.alert('오류', '댓글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    // TODO: 공유 기능 구현
    console.log('공유하기');
  };

  const handleEdit = () => {
    // TODO: 수정 페이지로 이동
    console.log('수정하기');
  };

  const handleDelete = () => {
    // TODO: 삭제 확인 다이얼로그 표시
    console.log('삭제하기');
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      // 임시로 더미 데이터 사용
      const dummyComment: Comment = {
        id: Math.random().toString(),
        letterId: '1',
        userId: '1',
        userNickname: '테스트 유저',
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
      };
      setComments(prev => [...prev, dummyComment]);
      setNewComment('');
      // const comment = await createComment(letter.id, {
      //   content: newComment.trim(),
      // });
      // setComments(prev => [...prev, comment]);
      // setNewComment('');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      Alert.alert('오류', '댓글 작성에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      // 임시로 API 호출 없이 상태만 업데이트
      setComments(prev => prev.filter(c => c.id !== commentId));
      // await deleteComment(letter.id, commentId);
      // setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      Alert.alert('오류', '댓글 삭제에 실패했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{letter.category}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Icon name="share" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
              <Icon name="edit" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDelete}>
              <Icon name="delete" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                showComments && styles.actionButtonActive,
              ]}
              onPress={() => setShowComments(!showComments)}>
              <Icon
                name="comment"
                size={24}
                color={showComments ? '#1a73e8' : '#666'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 썸네일 이미지 */}
        {letter.thumbnail && (
          <Image
            source={{uri: letter.thumbnail}}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        )}

        {/* 컨텐츠 */}
        <View style={styles.content}>
          <Text style={styles.title}>{letter.title}</Text>
          <Text style={styles.date}>{letter.inviteDate}</Text>
          <Text style={styles.body}>{letter.body}</Text>

          {/* 통계 */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Icon name="visibility" size={20} color="#666" />
              <Text style={styles.statText}>{letter.viewCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="chat" size={20} color="#666" />
              <Text style={styles.statText}>{letter.commentCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="people" size={20} color="#666" />
              <Text style={styles.statText}>{letter.attendCount}</Text>
            </View>
          </View>
        </View>

        {showComments && (
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>댓글</Text>
            {loading ? (
              <ActivityIndicator style={styles.loading} color="#1a73e8" />
            ) : (
              <View style={styles.commentsList}>
                {comments.map(comment => (
                  <View key={comment.id} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <View style={styles.commentUser}>
                        {comment.userProfileImage ? (
                          <Image
                            source={{uri: comment.userProfileImage}}
                            style={styles.commentUserImage}
                          />
                        ) : (
                          <View style={styles.commentUserImagePlaceholder}>
                            <Text style={styles.commentUserImageText}>
                              {comment.userNickname[0]}
                            </Text>
                          </View>
                        )}
                        <Text style={styles.commentUserName}>
                          {comment.userNickname}
                        </Text>
                      </View>
                      {comment.userId === letter.userId && (
                        <TouchableOpacity
                          onPress={() => handleDeleteComment(comment.id)}>
                          <Icon name="close" size={20} color="#666" />
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                    <Text style={styles.commentDate}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {showComments && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="댓글을 입력하세요"
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !newComment.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSubmitComment}
            disabled={!newComment.trim()}>
            <Icon
              name="send"
              size={24}
              color={newComment.trim() ? '#1a73e8' : '#ccc'}
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  actionButtonActive: {
    backgroundColor: '#e8f0fe',
  },
  commentsSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    marginTop: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#202124',
  },
  loading: {
    padding: 20,
  },
  commentsList: {
    gap: 16,
  },
  commentItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentUserImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentUserImagePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1a73e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentUserImageText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
  },
  commentContent: {
    fontSize: 16,
    color: '#202124',
    lineHeight: 24,
  },
  commentDate: {
    fontSize: 12,
    color: '#5f6368',
  },
  commentInputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    padding: 8,
  },
  categoryBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
  },
  thumbnail: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 24,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
});

export default LetterDetail;
