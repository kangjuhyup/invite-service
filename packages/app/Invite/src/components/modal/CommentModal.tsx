import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Comment} from '../../api/comment';
import {styles} from '../../styles/LetterDetail.styles';

interface CommentModalProps {
  visible: boolean;
  loading: boolean;
  comments: Comment[];
  newComment: string;
  onClose: () => void;
  onDelete: (commentId: number) => void;
  onSubmit: () => void;
  onChangeComment: (text: string) => void;
}

export const CommentModal: React.FC<CommentModalProps> = ({
  visible,
  loading,
  comments,
  newComment,
  onClose,
  onDelete,
  onSubmit,
  onChangeComment,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}>
        <SafeAreaView style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.commentsTitle}>댓글</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.commentsSection}>
            {loading ? (
              <ActivityIndicator style={styles.loading} color="#1a73e8" />
            ) : (
              <View style={styles.commentsList}>
                {comments.length === 0 ? (
                  <View style={styles.emptyComments}>
                    <Text style={styles.emptyCommentsText}>
                      아직 댓글이 없습니다.
                    </Text>
                  </View>
                ) : (
                  comments.map(comment => (
                    <View key={comment.id} style={styles.commentItem}>
                      <View style={styles.commentHeader}>
                        <View style={styles.commentUser}>
                          <Text style={styles.commentUserName}>
                            {comment.editor}
                          </Text>
                        </View>
                        <View style={styles.commentItem}>
                          <Text>{comment.body}</Text>
                        </View>
                        {true && (
                          <TouchableOpacity
                            onPress={() => onDelete(comment.id)}>
                            <Icon name="close" size={20} color="#666" />
                          </TouchableOpacity>
                        )}
                      </View>
                      <Text style={styles.commentContent}>{comment.body}</Text>
                    </View>
                  ))
                )}
              </View>
            )}
          </ScrollView>

          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="댓글을 입력하세요"
              value={newComment}
              onChangeText={onChangeComment}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !newComment.trim() && styles.sendButtonDisabled,
              ]}
              onPress={onSubmit}
              disabled={!newComment.trim()}>
              <Icon
                name="send"
                size={24}
                color={newComment.trim() ? '#1a73e8' : '#ccc'}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};
