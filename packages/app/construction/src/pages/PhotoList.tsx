import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';
import type {Photo, Memo} from '../types/user';

type Props = NativeStackScreenProps<RootStackParamList, 'PhotoList'>;

const windowWidth = Dimensions.get('window').width;

// 임시 데이터
const mockPhotos: Photo[] = [
  {
    id: '1',
    url: 'https://picsum.photos/400/300',
    createdAt: '2024-02-10',
    memos: [
      {
        id: '1',
        content: '기초 공사 진행 상황',
      },
      {
        id: '2',
        content: '보강 필요 부분',
      },
    ],
  },
  {
    id: '2',
    url: 'https://picsum.photos/400/300',
    createdAt: '2024-02-11',
    memos: [
      {
        id: '3',
        content: '철근 배치 완료',
      },
    ],
  },
];

/**
 * 메모 컴포넌트
 */
const MemoItem: React.FC<{content: string}> = ({content}) => {
  return (
    <View style={styles.memoItem}>
      <Text style={styles.memoText}>{content}</Text>
    </View>
  );
};

/**
 * 사진 카드 컴포넌트
 */
const PhotoCard: React.FC<{photo: Photo}> = ({photo}) => {
  return (
    <View style={styles.card}>
      <Image
        source={{uri: photo.url}}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.memoContainer}>
        <Text style={styles.dateText}>{photo.createdAt}</Text>
        {photo.memos.map(memo => (
          <MemoItem key={memo.id} content={memo.content} />
        ))}
      </View>
    </View>
  );
};

/**
 * 사진 목록 페이지
 */
const PhotoList: React.FC<Props> = ({navigation, route}) => {
  const handleAddPhoto = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['취소', '촬영하기', '불러오기'],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            launchCamera(
              {
                mediaType: 'photo',
                quality: 1,
              },
              response => {
                if (response.didCancel) return;
                if (response.errorCode) {
                  console.error('카메라 에러:', response.errorMessage);
                  return;
                }
                // 촬영된 사진으로 메모 페이지로 이동
                if (response.assets?.[0]?.uri) {
                  navigation.navigate('AddPhotoMemo', {
                    imageUri: response.assets[0].uri,
                  });
                }
              },
            );
          } else if (buttonIndex === 2) {
            console.log('갤러리 열기');
            launchImageLibrary(
              {
                mediaType: 'photo',
                quality: 1,
                selectionLimit: 1,
              },
              response => {
                console.log('갤러리 응답:', response);
                if (response.didCancel) {
                  console.log('취소됨');
                  return;
                }
                if (response.errorCode) {
                  console.error('갤러리 에러:', response.errorMessage);
                  return;
                }
                // 선택된 사진으로 메모 페이지로 이동
                console.log('선택된 사진 URI:', response.assets?.[0]?.uri);
                if (response.assets?.[0]?.uri) {
                  navigation.navigate('AddPhotoMemo', {
                    imageUri: response.assets[0].uri,
                  });
                }
              },
            );
          }
        },
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {route.params?.folderName || '사진 목록'}
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* 사진 목록 */}
      <ScrollView style={styles.content}>
        {mockPhotos.map(photo => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </ScrollView>

      {/* 플로팅 액션 버튼 */}
      <TouchableOpacity style={styles.fab} onPress={handleAddPhoto}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  headerRight: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  memoContainer: {
    padding: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  memoItem: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  memoText: {
    fontSize: 16,
    color: '#333',
  },
});

export default PhotoList;
