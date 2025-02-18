import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import {LetterCategoryCode} from '../api/letter';

interface LetterMeta {
  category: string;
  title: string;
  body?: string;
  inviteDate: string;
}
const categories = Object.values(LetterCategoryCode);

type Props = NativeStackScreenProps<RootStackParamList, 'LetterMeta'>;

export const LetterMeta: React.FC<Props> = ({route, navigation}) => {
  const {meta, letterId, templateId} = route.params;

  const [category, setCategory] = useState(meta.category);
  const [title, setTitle] = useState(meta.title);
  const [body, setBody] = useState(meta.body || '');
  const [date, setDate] = useState(meta.inviteDate ? new Date(meta.inviteDate) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleNext = () => {
    if (!category) {
      Alert.alert('알림', '카테고리를 선택해주세요');
      return;
    }
    if (!title.trim()) {
      Alert.alert('알림', '제목을 입력해주세요');
      return;
    }

    navigation.navigate('LetterEditor', {
      meta: {
        category,
        title,
        body,
        inviteDate: date.toISOString().split('T')[0],
      },
      letterId,
      templateId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.title}>초대장 정보</Text>
        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.nextButton}>다음</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form}>
        <Text style={styles.label}>카테고리*</Text>
        <View style={styles.categoryContainer}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && styles.categoryButtonSelected,
              ]}
              onPress={() => setCategory(cat)}>
              <Text
                style={[
                  styles.categoryButtonText,
                  category === cat && styles.categoryButtonTextSelected,
                ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>제목*</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="초대장 제목을 입력하세요"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>내용 (선택)</Text>
        <TextInput
          style={[styles.input, styles.bodyInput]}
          value={body}
          onChangeText={setBody}
          placeholder="초대장 내용을 입력하세요"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>날짜*</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateButtonText}>
            {date.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          <Icon name="calendar-today" size={20} color="#666" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  nextButton: {
    color: '#1a73e8',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
  },
  categoryButtonSelected: {
    backgroundColor: '#1a73e8',
  },
  categoryButtonText: {
    color: '#666',
    fontSize: 14,
  },
  categoryButtonTextSelected: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  bodyInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
});
