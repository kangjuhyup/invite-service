import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';
import {getProfile} from '../api/profile';
import type {ProfileResponse} from '../api/profile';
import {getLetters, Letter} from '../api/letter';
import {fetchImage, getImageUrl} from '../api/image';
import Icon from 'react-native-vector-icons/Feather';
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.85;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.6;

// 카드 색상 배열
const CARD_COLORS = ['#FF9EAA', '#90CAF9', '#A5D6A7', '#FFD54F', '#B39DDB'];

const My: React.FC<Props> = ({navigation}) => {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [profile, setProfile] = useState<ProfileResponse>();
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<{[key: string]: string}>({});
  const [renderedItems, setRenderedItems] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 프로필과 레터 데이터 로드
        const [profileData, lettersData] = await Promise.all([
          getProfile(),
          getLetters(),
        ]);
        setProfile(profileData.data);
        setLetters(lettersData.items);
        setLoading(false);

        // 이미지 비동기 로드
        lettersData.items
          .filter(item => item.thumbnail)
          .forEach(async (item) => {
            try {
              const [bucket, path] = item.thumbnail.split('/');
              const url = await fetchImage(bucket, path);
              setImageUrls(prev => ({
                ...prev,
                [item.thumbnail]: url
              }));
            } catch (error) {
              console.error('이미지 로드 실패:', error);
            }
          });
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);
  const renderCard = (item: Letter, index: number) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        key={item.id}
        onLayout={() => {
          setRenderedItems(prev => ({
            ...prev,
            [item.id]: true
          }));
        }}
        style={[styles.cardContainer, {transform: [{scale}], opacity}]}>
        <TouchableOpacity
          style={[
            styles.card,
            {backgroundColor: CARD_COLORS[index % CARD_COLORS.length]},
          ]}
          onPress={() => {
            navigation.navigate('LetterDetail', {letter: item});
          }}>
          <View style={styles.cardContent}>
            <Animated.View style={[styles.thumbnail, styles.thumbnailBackground]}>
              {item.thumbnail && renderedItems[item.id] && (
                <Animated.Image
                  source={{
                    uri: imageUrls[item.thumbnail] || undefined,
                  }}
                  style={[
                    styles.thumbnail,
                    {
                      opacity: imageUrls[item.thumbnail] ? 1 : 0,
                    },
                  ]}
                  resizeMode="cover"
                />
              )}
            </Animated.View>
            <View style={styles.overlay} />
            <View style={styles.cardInfo}>
              <View style={styles.cardHeader}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <Text style={styles.cardDate}>{item.inviteDate}</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.body}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.cardStats}>
                  <View style={styles.statItem}>
                    <Icon name="eye" size={16} color="#ffffff" />
                    <Text style={styles.statValue}>{item.viewCount}</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Icon name="message-circle" size={16} color="#ffffff" />
                    <Text style={styles.statValue}>{item.commentCount}</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Icon name="users" size={16} color="#ffffff" />
                    <Text style={styles.statValue}>{item.attendCount}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profile}>
        <View style={styles.profileImageContainer}>
          {profile?.profileImage ? (
            <Image
              source={{uri: profile.profileImage}}
              style={styles.profileImage}
            />
          ) : (
            <View style={[styles.profileImage, styles.profileImagePlaceholder]}>
              <Text style={styles.profileImagePlaceholderText}>
                {profile?.nickName?.[0] || '?'}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {profile?.nickName || '로딩중...'}
          </Text>
          <Text style={styles.profileEmail}>{profile?.email || ''}</Text>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>나의 초대장</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('LetterEditor')}>
          <Text style={styles.createButtonText}>+ 새 초대장</Text>
        </TouchableOpacity>
      </View>

      {letters.length >= 5 ? (
        <Text style={styles.maxInvitationsWarning}>
          초대장은 최대 5개까지 생성 가능합니다
        </Text>
      ) : null}

      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <View style={styles.loadingContainer}></View>
        ) : (
          letters.map((item, index) => renderCard(item, index))
        )}
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: CARD_HEIGHT,
  },
  maxInvitationsWarning: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    paddingHorizontal: 10,
  },
  profile: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileImagePlaceholder: {
    backgroundColor: '#1a73e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#202124',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#5f6368',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  createButton: {
    backgroundColor: '#1a73e8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    height: CARD_HEIGHT,
  },
  cardContent: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  cardInfo: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardDate: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.9,
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  cardDescription: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    opacity: 0.9,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 16,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  statValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  thumbnailBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export default My;
