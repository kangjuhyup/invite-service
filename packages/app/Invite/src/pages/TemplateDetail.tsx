import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {getCategoryDisplayName} from '../utils/category';
const Icon = MaterialIcons as unknown as React.ComponentType<{
  name: string;
  size: number;
  color: string;
  style?: any;
}>;

type Props = NativeStackScreenProps<RootStackParamList, 'TemplateDetail'>;

const TemplateDetail: React.FC<Props> = ({route, navigation}) => {
  const {templateId, template, imageUrl: initialImageUrl} = route.params;

  const handleCreateLetter = () => {
    navigation.navigate('LetterMeta', {
      templateId: template.templateId,
      meta: {
        title: template.title,
        category: template.category,
      },
    });
  };

  if (!template) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>템플릿을 찾을 수 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        {initialImageUrl ? (
          <Image
            source={{uri: initialImageUrl}}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Icon name="image" size={48} color="#ccc" />
          </View>
        )}
      </View>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentOverlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{template.title}</Text>

          <View style={styles.categoryChip}>
            <Text style={styles.categoryText}>
              {getCategoryDisplayName(template.category)}
            </Text>
          </View>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Icon name="remove-red-eye" size={16} color="#ffffff" />
              <Text style={styles.statText}>{template.viewCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="content-copy" size={16} color="#ffffff" />
              <Text style={styles.statText}>{template.forkCount}</Text>
            </View>
          </View>

          {/* <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>미리보기</Text>
            <Text style={styles.previewText}>{template.content}</Text>
          </View> */}

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateLetter}>
            <Icon name="edit" size={20} color="#fff" />
            <Text style={styles.createButtonText}>
              이 템플릿으로 초대장 만들기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingBottom: 34,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  categoryChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  previewContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 20,
  },
  createButton: {
    backgroundColor: '#1a73e8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TemplateDetail;
