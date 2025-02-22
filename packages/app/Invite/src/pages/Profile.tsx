import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';
import {
  getProfile,
  ProfileResponse,
  updateProfile,
  prepareProfileImage,
  uploadProfileImage,
  validateProfileImage,
} from '../api/profile';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {clearTokens} from '../utils/token';
import {launchImageLibrary} from 'react-native-image-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const Profile: React.FC<Props> = ({navigation}) => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState('');

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      if (response.result && response.data) {
        setProfile(response.data);
      } else {
        Alert.alert('오류', '프로필을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 로드 실패:', error);
      Alert.alert('오류', '프로필을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets[0]?.uri) {
        const uri = result.assets[0].uri;

        // 1. Presigned URL 요청
        const prepareResponse = await prepareProfileImage();
        if (!prepareResponse.result) {
          throw new Error('이미지 업로드 준비 실패');
        }

        // 2. S3에 이미지 업로드
        await uploadProfileImage(
          prepareResponse.data.url,
          uri,
          prepareResponse.data.sessionKey,
        );

        // 3. 이미지 업로드 완료 처리
        const validateResponse = await validateProfileImage();
        if (validateResponse.result && validateResponse.data) {
          setProfile(validateResponse.data);
          Alert.alert('성공', '프로필 이미지가 업데이트되었습니다.');
        }
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      Alert.alert('오류', '이미지 업로드에 실패했습니다.');
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a73e8" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#1a73e8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내 정보</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity
            style={styles.profileImageWrapper}
            onPress={handleImagePick}>
            {profile?.profileImage ? (
              <Image
                source={{uri: profile.profileImage}}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Icon name="person" size={40} color="#666" />
              </View>
            )}
            <View style={styles.editIconContainer}>
              <Icon name="edit" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>이메일</Text>
            <Text style={styles.infoValue}>{profile?.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>닉네임</Text>
            <TouchableOpacity
              style={styles.editableValue}
              onPress={() => {
                setNewNickname(profile?.nickName || '');
                setIsEditingNickname(true);
              }}>
              <Text style={styles.infoValue}>{profile?.nickName}</Text>
              <Icon name="edit" size={16} color="#1a73e8" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dashboardSection}>
          <Text style={styles.sectionTitle}>대시보드</Text>
          <View style={styles.dashboardContent}>
            {/* 대시보드 콘텐츠는 추후 추가 예정 */}
          </View>
        </View>

        <TouchableOpacity
          style={styles.withdrawButton}
          onPress={() => {
            Alert.alert(
              '회원탈퇴',
              '정말로 탈퇴하시겠습니까?\n탈퇴하면 모든 데이터가 삭제되며 복구할 수 없습니다.',
              [
                {text: '취소', style: 'cancel'},
                {
                  text: '탈퇴',
                  style: 'destructive',
                  onPress: () => {
                    // TODO: 회원탈퇴 API 구현
                    Alert.alert('알림', '회원탈퇴 기능은 아직 준비중입니다.');
                  },
                },
              ],
            );
          }}>
          <Text style={styles.withdrawButtonText}>회원탈퇴</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isEditingNickname}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditingNickname(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>닉네임 수정</Text>
            <TextInput
              style={styles.nicknameInput}
              value={newNickname}
              onChangeText={setNewNickname}
              placeholder="새로운 닉네임을 입력하세요"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditingNickname(false)}>
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={async () => {
                  try {
                    if (!newNickname.trim()) {
                      Alert.alert('오류', '닉네임을 입력해주세요.');
                      return;
                    }

                    const response = await updateProfile({
                      nickName: newNickname,
                    });
                    if (response.result && response.data) {
                      setProfile(response.data);
                      setIsEditingNickname(false);
                      Alert.alert('성공', '닉네임이 수정되었습니다.');
                    }
                  } catch (error) {
                    console.error('닉네임 수정 실패:', error);
                    Alert.alert('오류', '닉네임 수정에 실패했습니다.');
                  }
                }}>
                <Text style={styles.saveButtonText}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 로그아웃 버튼 */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            try {
              await clearTokens();
              navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
              });
            } catch (error) {
              console.error('로그아웃 실패:', error);
              Alert.alert('오류', '로그아웃에 실패했습니다.');
            }
          }}>
          <Text style={styles.logoutButtonText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    gap: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202124',
    textAlign: 'center',
  },
  nicknameInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#1a73e8',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#1a73e8',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  infoSection: {
    gap: 24,
  },
  infoItem: {
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#202124',
  },
  editableValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dashboardSection: {
    marginTop: 32,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202124',
  },
  dashboardContent: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    minHeight: 100,
  },
  withdrawButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    alignItems: 'center',
    padding: 16,
  },
  withdrawButtonText: {
    fontSize: 14,
    color: '#dc3545',
    textDecorationLine: 'underline',
  },
});

export default Profile;
