import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AttendeeListModal} from '../components/modal/AttendeeListModal';
import {CommentModal} from '../components/modal/CommentModal';
import type {Letter} from '../api/letter';
import {fetchImage} from '../api/image';
import {getLetter} from '../api/letter';
import {styles} from '../styles/LetterDetail.styles';
import {useComments} from '../hooks/useComments';

type Props = NativeStackScreenProps<RootStackParamList, 'LetterDetail'>;

const LetterDetail: React.FC<Props> = ({route, navigation}) => {
  const letterId = route.params.letterId;
  const {
    comments,
    loading,
    newComment,
    setNewComment,
    loadComments,
    handleSubmitComment,
    handleDeleteComment,
  } = useComments(letterId);
  const [showComments, setShowComments] = useState(false);
  const [attendeeModalVisible, setAttendeeModalVisible] = useState(false);

  // 임시 참여자 데이터
  const tempAttendees = [
    {
      id: '1',
      name: '김철수',
      attendedAt: '2025.02.15',
    },
    {
      id: '2',
      name: '이영희',
      profileImage: 'https://picsum.photos/200',
      attendedAt: '2025.02.14',
    },
    {
      id: '3',
      name: '박지민',
      attendedAt: '2025.02.13',
    },
  ];
  const [letterData, setLetter] = useState<Letter>();
  const [detailLoading, setDetailLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>();
  useEffect(() => {
    if (letterId) {
      loadLetter();
    }
  }, [letterId]);

  useEffect(() => {
    if (letterData?.letter.path) {
      loadImage();
    }
  }, [letterData]);

  const loadImage = async () => {
    if (!letterData?.letter.path) return;
    console.log(letterData.letter);
    try {
      const [bucket, path] = letterData.letter.path.split('/');
      console.log(bucket, path);
      const url = await fetchImage(bucket, path);
      console.log(url);
      setImageUrl(url);
    } catch (error) {
      console.error('이미지 로드 실패:', error);
    }
  };

  useEffect(() => {
    if (showComments) {
      console.log('load comments');
      loadComments();
    }
  }, [showComments]);

  const loadLetter = async () => {
    try {
      setDetailLoading(true);
      const response = await getLetter(letterId);
      if (response.result && response.data) {
        setLetter(response.data);
      } else {
        Alert.alert('오류', '초대장 정보를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('초대장 정보 로딩 실패:', error);
      Alert.alert('오류', '초대장 정보를 불러오는데 실패했습니다.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleShare = () => {
    // TODO: 공유 기능 구현
    console.log('공유하기');
  };

  const handleEdit = () => {
    navigation.navigate('LetterEditor', {letterId});
  };

  const handleDelete = () => {
    // TODO: 삭제 확인 다이얼로그 표시
    console.log('삭제하기');
  };

  useEffect(() => {
    console.log(attendeeModalVisible);
  }, [attendeeModalVisible]);

  return (
    <SafeAreaView style={styles.container}>
      <AttendeeListModal
        visible={attendeeModalVisible}
        onClose={() => setAttendeeModalVisible(false)}
        attendees={tempAttendees}
      />
      <View style={styles.scrollView}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{letterData?.category}</Text>
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
          </View>
        </View>

        {detailLoading ? (
          <View style={styles.content}>
            <ActivityIndicator style={styles.loading} color="#1a73e8" />
          </View>
        ) : letterData ? (
          <View style={styles.content}>
            <Text style={styles.title}>{letterData.title}</Text>
            <Image
              source={{uri: imageUrl}}
              style={styles.letterImage}
              resizeMode="contain"
            />
            {letterData.body && (
              <Text style={styles.body}>{letterData.body}</Text>
            )}
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.errorText}>
              초대장 정보를 불러올 수 없습니다.
            </Text>
          </View>
        )}
      </View>

      <CommentModal
        visible={showComments}
        loading={loading}
        comments={comments}
        newComment={newComment}
        onClose={() => setShowComments(false)}
        onDelete={handleDeleteComment}
        onSubmit={handleSubmitComment}
        onChangeComment={setNewComment}
      />
      {/* 플로팅 통계 버튼 */}
      <View style={styles.floatingStats}>
        <View style={styles.statItem}>
          <Icon name="visibility" size={20} color="#666" />
          <Text style={styles.statText}>{letterData?.viewCount}</Text>
        </View>
        <TouchableOpacity
          style={styles.statItem}
          onPress={() => setShowComments(true)}>
          <Icon
            name="chat"
            size={20}
            color={showComments ? '#1a73e8' : '#666'}
          />
          <Text
            style={[styles.statText, showComments && styles.activeStatText]}>
            {letterData?.commentCount}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statItem}
          onPress={() => {
            console.log('onPress');
            setAttendeeModalVisible(true);
          }}>
          <Icon name="people" size={20} color="#666" />
          <Text style={styles.statText}>{letterData?.attendCount}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LetterDetail;
