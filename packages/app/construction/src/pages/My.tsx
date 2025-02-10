import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import type { UserInfo, ConstructionSite } from '../types/user';
import type { MyScreenProps } from '../types/navigation';

/**
 * 임시 데이터 - 실제 구현시 API로 대체 필요
 */
const mockUserInfo: UserInfo = {
  name: '홍길동',
  team: '건설팀',
  position: '팀장',
  contact: '010-1234-5678',
};

const mockConstructionSites: ConstructionSite[] = [
  {
    id: '1',
    name: '서울 아파트 건설 현장',
    location: '서울시 강남구',
    startDate: '2024-01-01',
    status: 'in-progress',
  },
  {
    id: '2',
    name: '부산 오피스텔 건설 현장',
    location: '부산시 해운대구',
    startDate: '2024-02-01',
    status: 'planned',
  },
];

/**
 * My 페이지 컴포넌트
 */
const My = ({ navigation }: MyScreenProps) => {
  /**
   * 건설현장 상태에 따른 색상 반환
   */
  const getStatusColor = (status: ConstructionSite['status']) => {
    switch (status) {
      case 'in-progress':
        return '#007AFF';
      case 'completed':
        return '#34C759';
      case 'planned':
        return '#FF9500';
      default:
        return '#8E8E93';
    }
  };

  /**
   * 건설현장 상태 한글 변환
   */
  const getStatusText = (status: ConstructionSite['status']) => {
    switch (status) {
      case 'in-progress':
        return '진행중';
      case 'completed':
        return '완료';
      case 'planned':
        return '예정';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* 사용자 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>내 정보</Text>
          <View style={styles.userInfoContainer}>
            <View style={styles.userInfoRow}>
              <Text style={styles.label}>이름</Text>
              <Text style={styles.value}>{mockUserInfo.name}</Text>
            </View>
            <View style={styles.userInfoRow}>
              <Text style={styles.label}>소속</Text>
              <Text style={styles.value}>{mockUserInfo.team}</Text>
            </View>
            <View style={styles.userInfoRow}>
              <Text style={styles.label}>직책</Text>
              <Text style={styles.value}>{mockUserInfo.position}</Text>
            </View>
            <View style={styles.userInfoRow}>
              <Text style={styles.label}>연락처</Text>
              <Text style={styles.value}>{mockUserInfo.contact}</Text>
            </View>
          </View>
        </View>

        {/* 건설현장 리스트 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>건설현장 목록</Text>
          {mockConstructionSites.map((site) => (
            <TouchableOpacity
              key={site.id}
              style={styles.siteContainer}
              onPress={() => navigation.navigate('SiteDetail', { siteId: site.id })}>
              <View style={styles.siteHeader}>
                <Text style={styles.siteName}>{site.name}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(site.status) },
                  ]}>
                  <Text style={styles.statusText}>
                    {getStatusText(site.status)}
                  </Text>
                </View>
              </View>
              <Text style={styles.siteLocation}>{site.location}</Text>
              <Text style={styles.siteDate}>시작일: {site.startDate}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  userInfoContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  siteContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  siteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  siteName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
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
  siteLocation: {
    fontSize: 14,
    color: '#6B6B6B',
    marginBottom: 4,
  },
  siteDate: {
    fontSize: 14,
    color: '#6B6B6B',
  },
});

export default My;
