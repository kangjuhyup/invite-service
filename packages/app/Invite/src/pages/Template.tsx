import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const Icon = MaterialIcons as unknown as React.ComponentType<{
  name: string;
  size: number;
  color: string;
  style?: any;
}>;
import {getTemplates, TemplatePageItem} from '../api/template';
import {fetchImage} from '../api/image';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';
import {LetterCategoryCode} from '../api/letter';
import {getCategoryDisplayName} from '../utils/category';

type Props = NativeStackScreenProps<RootStackParamList, 'Template'>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - 40 - 20) / 3; // 패딩 40, 갭 20
const ITEMS_PER_PAGE = 15;

const Template: React.FC<Props> = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<LetterCategoryCode>();
  const [templates, setTemplates] = useState<TemplatePageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [imageUrls, setImageUrls] = useState<{[key: string]: string}>({});
  const [renderedItems, setRenderedItems] = useState<{[key: string]: boolean}>(
    {},
  );

  const loadTemplates = useCallback(
    async (refresh = false) => {
      if (loading || (!hasMore && !refresh)) return;

      try {
        setLoading(true);
        const startAt = refresh
          ? 0
          : templates.length > 0
          ? templates[templates.length - 1].templateId
          : 0;

        const response = await getTemplates({
          startAt,
          limit: ITEMS_PER_PAGE,
          category: selectedCategory,
          title: searchText || undefined,
        });

        const newTemplates = refresh
          ? response.data?.templates
          : [...templates, ...(response.data?.templates || [])];
        setTemplates(newTemplates || []);
        setHasMore(response.data?.templates?.length === ITEMS_PER_PAGE);

        // 이미지 비동기 로드
        response.data?.templates
          ?.filter(item => item.thumbnailUrl)
          ?.forEach(async item => {
            try {
              const [bucket, path] = item.thumbnailUrl.split('/');
              const url = await fetchImage(bucket, path);
              setImageUrls(prev => ({
                ...prev,
                [item.thumbnailUrl]: url,
              }));
            } catch (error) {
              console.error('이미지 로드 실패:', error);
            }
          });
      } catch (error) {
        console.error('템플릿 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, templates, selectedCategory, searchText],
  );

  useEffect(() => {
    loadTemplates(true);
  }, [selectedCategory, searchText]);

  const renderItem = ({item}: {item: TemplatePageItem}) => (
    <TouchableOpacity
      style={styles.card}
      onLayout={() => {
        setRenderedItems(prev => ({
          ...prev,
          [item.templateId]: true,
        }));
      }}
      onPress={() => {
        navigation.navigate('TemplateDetail', {
          templateId: item.templateId,
          template: item,
          imageUrl: imageUrls[item.thumbnailUrl],
        });
      }}>
      <View style={styles.cardImageContainer}>
        {item.thumbnailUrl && renderedItems[item.templateId] && (
          <Image
            source={{uri: imageUrls[item.thumbnailUrl]}}
            style={styles.cardImage}
            resizeMode="cover"
          />
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.cardStats}>
          <View style={styles.statItem}>
            <Icon name="remove-red-eye" size={12} color="#666" />
            <Text style={styles.statText}>{item.viewCount}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="content-copy" size={12} color="#666" />
            <Text style={styles.statText}>{item.forkCount}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>템플릿</Text>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="템플릿 검색"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryList}>
        <TouchableOpacity
          style={[
            styles.categoryChip,
            !selectedCategory && styles.categoryChipSelected,
          ]}
          onPress={() => setSelectedCategory(undefined)}>
          <Text
            style={[
              styles.categoryText,
              !selectedCategory && styles.categoryTextSelected,
            ]}>
            전체
          </Text>
        </TouchableOpacity>
        {Object.values(LetterCategoryCode).map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipSelected,
            ]}
            onPress={() => setSelectedCategory(category)}>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextSelected,
              ]}>
              {getCategoryDisplayName(category)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={templates}
        renderItem={renderItem}
        keyExtractor={item => item.templateId.toString()}
        numColumns={3}
        contentContainerStyle={styles.content}
        onEndReached={() => loadTemplates()}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loading ? (
            <View style={styles.loading}>
              <ActivityIndicator color="#1a73e8" />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#202124',
  },
  categoryList: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexGrow: 0,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    minWidth: 48,
    alignItems: 'center',
  },
  categoryChipSelected: {
    backgroundColor: '#1a73e8',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  content: {
    padding: 20,
    gap: 10,
  },
  card: {
    width: CARD_WIDTH,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImageContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: 8,
    gap: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
  },
  cardStats: {
    flexDirection: 'row',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  loading: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default Template;
