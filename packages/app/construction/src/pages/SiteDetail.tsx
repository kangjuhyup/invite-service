import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  ActionSheetIOS,
  Linking,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import type { ConstructionSite } from '../types/user';

type Props = NativeStackScreenProps<RootStackParamList, 'SiteDetail'>;

// 임시 데이터
const mockSiteDetail: ConstructionSite = {
  id: '1',
  name: '서울 아파트 건설 현장',
  location: '서울시 강남구 역삼동 123-45',
  startDate: '2024-01-01',
  endDate: '2025-12-31',
  status: 'in-progress',
  description: '지하 3층, 지상 20층 규모의 주상복합 아파트 신축 공사',
  progress: 35,
  contacts: [
    {
      id: '1',
      name: '김현장',
      position: '현장소장',
      phone: '010-1234-5678',
      department: '시공팀',
    },
    {
      id: '2',
      name: '이안전',
      position: '안전관리자',
      phone: '010-8765-4321',
      department: '안전팀',
    },
  ],
  photoFolders: [
    {
      id: '1',
      name: '기초공사',
      createdAt: '2024-01-15',
      photoCount: 15,
    },
    {
      id: '2',
      name: '철근작업',
      createdAt: '2024-02-01',
      photoCount: 23,
    },
  ],
};

const SiteDetail: React.FC<Props> = ({ navigation, route }) => {
  const [isContactsVisible, setIsContactsVisible] = useState(false);
  const [isNewFolderModalVisible, setIsNewFolderModalVisible] = useState(false);
  
  // 실제 구현시 API로 데이터 fetch 필요
  const site = mockSiteDetail;

  const handleCreateFolder = () => {
    setIsNewFolderModalVisible(true);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButton}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{site.name}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* 기본 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>현장 정보</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>위치</Text>
              <Text style={styles.value}>{site.location}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>공사기간</Text>
              <Text style={styles.value}>{site.startDate} ~ {site.endDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>진행률</Text>
              <Text style={styles.value}>{site.progress}%</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>상태</Text>
              <View style={[styles.statusBadge, { backgroundColor: site.status === 'in-progress' ? '#007AFF' : '#34C759' }]}>
                <Text style={styles.statusText}>
                  {site.status === 'in-progress' ? '진행중' : '완료'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 사진 폴더 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>사진 폴더</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleCreateFolder}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.folderList}>
            {site.photoFolders.map(folder => (
              <TouchableOpacity
                key={folder.id}
                style={styles.folderItem}
                onPress={() => navigation.navigate('PhotoList', {
                  siteId: route.params.siteId,
                  folderId: folder.id,
                  folderName: folder.name,
                })}>
                <Text style={styles.folderName}>{folder.name}</Text>
                <Text style={styles.folderInfo}>
                  {folder.photoCount}장 • {folder.createdAt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 현장 관계자 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>현장 관계자</Text>
          <View style={styles.contactList}>
            {site.contacts.map(contact => (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactItem}
                onPress={() => {
                  ActionSheetIOS.showActionSheetWithOptions(
                    {
                      options: ['취소', '수정하기', '전화걸기'],
                      cancelButtonIndex: 0,
                      userInterfaceStyle: 'light',
                    },
                    async (buttonIndex) => {
                      if (buttonIndex === 1) {
                        // TODO: 수정하기 기능 구현
                        Alert.alert('알림', '수정하기 기능 구현 예정');
                      } else if (buttonIndex === 2) {
                        const phoneNumber = contact.phone.replace(/-/g, '');
                        try {
                          await Linking.openURL(`tel:${phoneNumber}`);
                        } catch (error) {
                          Alert.alert('오류', '전화걸기를 실행할 수 없습니다.');
                        }
                      }
                    },
                  );
                }}>
                <View>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactInfo}>
                    {contact.department} • {contact.position}
                  </Text>
                </View>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 새 폴더 생성 모달 */}
      <Modal
        visible={isNewFolderModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsNewFolderModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>새 폴더 만들기</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                Alert.alert('알림', '폴더 생성 기능 구현 예정');
                setIsNewFolderModalVisible(false);
              }}>
              <Text style={styles.modalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
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
  },
  headerRight: {
    width: 50,
  },
  content: {
    flex: 1,
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  label: {
    fontSize: 16,
    color: '#6B6B6B',
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
  },
  folderList: {
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  folderItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  folderName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  folderInfo: {
    fontSize: 14,
    color: '#6B6B6B',
  },
  contactList: {
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 14,
    color: '#6B6B6B',
  },
  contactPhone: {
    fontSize: 14,
    color: '#007AFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SiteDetail;
