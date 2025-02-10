'use client';

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';

interface MemoStyle {
  fontSize: number;
  fontFamily: string;
  color: string;
}

interface MemoItem {
  text: string;
  style: MemoStyle;
}

type Props = NativeStackScreenProps<RootStackParamList, 'AddPhotoMemo'>;

const DraggableMemo: React.FC<{memo: MemoItem; onPress: () => void}> = ({
  memo,
  onPress,
}) => {
  const translateX = useSharedValue(50);
  const translateY = useSharedValue(50);

  const gestureHandler = useAnimatedGestureHandler<any>({
    onStart: (_, context: any) => {
      'worklet';
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      'worklet';
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
    },
    onEnd: () => {
      'worklet';
      // 바운스 효과 추가
      translateX.value = withSpring(translateX.value);
      translateY.value = withSpring(translateY.value);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.draggableMemo, animatedStyle]}>
        <TouchableOpacity onPress={onPress} style={styles.memoContent}>
          <Text style={[styles.draggableMemoText, memo.style]}>
            {memo.text}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

const AddPhotoMemo: React.FC<Props> = ({navigation, route}) => {
  const [memo, setMemo] = useState('');
  const [memos, setMemos] = useState<MemoItem[]>([]);
  const [selectedMemoIndex, setSelectedMemoIndex] = useState<number | null>(
    null,
  );
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<MemoStyle>({
    fontSize: 14,
    fontFamily: 'System',
    color: '#000000',
  });
  const {imageUri} = route.params;

  const handleDeleteMemo = useCallback((index: number) => {
    const newMemos = memos.filter((_, i) => i !== index);
    setMemos(newMemos);
    setShowStyleModal(false);
  }, [memos]);

  const handleAddMemo = useCallback(() => {
    if (memo.trim()) {
      setMemos([...memos, {text: memo, style: {...currentStyle}}]);
      setMemo('');
    }
  }, [memo, memos, currentStyle]);

  const handleSave = () => {
    // TODO: 여기서 사진과 메모를 저장하는 로직 구현
    console.log('저장된 메모들:', memos);
    console.log('이미지 URI:', imageUri);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>취소</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>메모 추가</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>저장</Text>
        </TouchableOpacity>
      </View>

      <GestureHandlerRootView style={styles.content}>
        {/* 이미지와 메모들 */}
        <View style={styles.imageContainer}>
          <Image
            source={{uri: imageUri}}
            style={styles.image}
            resizeMode="cover"
          />
          {memos.map((memo, index) => (
            <DraggableMemo
              key={index}
              memo={memo}
              onPress={() => {
                setSelectedMemoIndex(index);
                setShowStyleModal(true);
              }}
            />
          ))}

          {/* 스타일 설정 모달 */}
          {showStyleModal && (
            <View style={styles.styleModal}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>메모 스타일 설정</Text>

                {/* 글자 크기 설정 */}
                <View style={styles.styleRow}>
                  <Text>글자 크기:</Text>
                  <View style={styles.buttonGroup}>
                    {[12, 14, 16, 18, 20].map(size => (
                      <TouchableOpacity
                        key={size}
                        style={[
                          styles.sizeButton,
                          currentStyle.fontSize === size &&
                            styles.selectedButton,
                        ]}
                        onPress={() =>
                          setCurrentStyle({...currentStyle, fontSize: size})
                        }>
                        <Text style={styles.buttonText}>{size}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* 폰트 설정 */}
                <View style={styles.styleRow}>
                  <Text>폰트:</Text>
                  <View style={styles.buttonGroup}>
                    {['System', 'Georgia', 'Times New Roman'].map(font => (
                      <TouchableOpacity
                        key={font}
                        style={[
                          styles.fontButton,
                          currentStyle.fontFamily === font &&
                            styles.selectedButton,
                        ]}
                        onPress={() =>
                          setCurrentStyle({...currentStyle, fontFamily: font})
                        }>
                        <Text style={{fontFamily: font}}>{font}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* 색상 설정 */}
                <View style={styles.styleRow}>
                  <Text>색상:</Text>
                  <View style={styles.buttonGroup}>
                    {['#000000', '#FF0000', '#0000FF', '#008000'].map(color => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorButton,
                          {backgroundColor: color},
                          currentStyle.color === color &&
                            styles.selectedColorButton,
                        ]}
                        onPress={() =>
                          setCurrentStyle({...currentStyle, color: color})
                        }
                      />
                    ))}
                  </View>
                </View>

                {/* 버튼 */}
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.deleteButton]}
                    onPress={() => {
                      if (selectedMemoIndex !== null) {
                        handleDeleteMemo(selectedMemoIndex);
                      }
                    }}>
                    <Text style={styles.modalButtonText}>삭제</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      if (selectedMemoIndex !== null) {
                        const newMemos = [...memos];
                        newMemos[selectedMemoIndex].style = {...currentStyle};
                        setMemos(newMemos);
                      }
                      setShowStyleModal(false);
                    }}>
                    <Text style={styles.modalButtonText}>적용</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowStyleModal(false)}>
                    <Text style={styles.modalButtonText}>취소</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* 메모 입력 */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}>
          <View style={styles.memoContainer}>
            <TextInput
              style={styles.memoInput}
              placeholder="메모를 입력하세요"
              value={memo}
              onChangeText={setMemo}
              onSubmitEditing={handleAddMemo}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddMemo}>
              <Text style={styles.addButtonText}>추가</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
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
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  cancelButton: {
    fontSize: 17,
    color: '#007AFF',
  },
  saveButton: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: windowWidth,
    height: windowWidth,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
  memoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  memoInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginRight: 12,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  draggableMemo: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: windowWidth * 0.7,
  },
  draggableMemoText: {
    fontSize: 14,
    color: '#000',
  },
  memoContent: {
    width: '100%',
  },
  styleModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  styleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10,
  },
  sizeButton: {
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 4,
    backgroundColor: '#F0F0F0',
  },
  fontButton: {
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 4,
    backgroundColor: '#F0F0F0',
  },
  colorButton: {
    width: 30,
    height: 30,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedButton: {
    backgroundColor: '#007AFF',
  },
  selectedColorButton: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: '#8E8E93',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddPhotoMemo;
