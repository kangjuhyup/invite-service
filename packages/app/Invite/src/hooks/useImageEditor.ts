import {useState, useCallback} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {Alert} from 'react-native';
import {type EditorItemType} from '../types/editor';

interface ImageEditorState {
  selectedImageId: string | null;
  isImageControlsVisible: boolean;
  isProcessingImage: boolean;
  backgroundImage: string | null;
  showBackgroundModal: boolean;
}

interface UseImageEditorProps {
  items: EditorItemType[];
  onUpdateItem: (id: string, updates: Partial<EditorItemType>) => void;
  onAddItem: (item: EditorItemType) => void;
  onDeleteItem: (id: string) => void;
}

/**
 * 이미지 에디터 관련 상태와 함수들을 관리하는 훅
 */
export const useImageEditor = ({
  items,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
}: UseImageEditorProps) => {
  const [state, setState] = useState<ImageEditorState>({
    selectedImageId: null,
    isImageControlsVisible: false,
    isProcessingImage: false,
    backgroundImage: null,
    showBackgroundModal: false,
  });

  // 선택된 이미지 아이템 가져오기
  const selectedImageItem = items.find(
    item => item.id === state.selectedImageId && item.type === 'image',
  );

  // 이미지 선택
  const handleImageSelect = useCallback(
    (id: string) => {
      const imageItem = items.find(
        item => item.id === id && item.type === 'image',
      );
      if (imageItem) {
        setState(prev => ({
          ...prev,
          selectedImageId: id,
          isImageControlsVisible: true,
        }));
      }
    },
    [items],
  );

  // 새 이미지 추가
  const addImage = useCallback(async () => {
    try {
      setState(prev => ({...prev, isProcessingImage: true}));
      const image = await ImagePicker.openPicker({
        cropping: true,
        compressImageQuality: 0.8,
      });

      const newItem: EditorItemType = {
        id: Math.random().toString(),
        type: 'image',
        content: image.path,
        position: {
          x: 100,
          y: 100,
        },
      };
      onAddItem(newItem);
      setState(prev => ({
        ...prev,
        selectedImageId: newItem.id,
        isImageControlsVisible: true,
        isProcessingImage: false,
      }));
    } catch (error) {
      console.error('이미지 선택 실패:', error);
      Alert.alert('오류', '이미지를 선택하는데 실패했습니다.');
      setState(prev => ({...prev, isProcessingImage: false}));
    }
  }, [onAddItem]);

  // 배경 이미지 선택
  const selectBackgroundImage = useCallback(async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 800,
        height: 800,
        cropping: true,
      });
      setState(prev => ({
        ...prev,
        backgroundImage: image.path,
        showBackgroundModal: false,
      }));
    } catch (error) {
      console.error('배경 이미지 선택 실패:', error);
      Alert.alert('오류', '이미지를 선택하는데 실패했습니다.');
    }
  }, []);

  // 이미지 위치 업데이트
  const updateImagePosition = useCallback(
    (id: string, position: {x: number; y: number}) => {
      onUpdateItem(id, {position});
    },
    [onUpdateItem],
  );

  // 이미지 삭제
  const deleteImage = useCallback(
    (id: string) => {
      onDeleteItem(id);
      setState(prev => ({
        ...prev,
        selectedImageId: null,
        isImageControlsVisible: false,
      }));
    },
    [onDeleteItem],
  );

  // 배경 모달 토글
  const toggleBackgroundModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      showBackgroundModal: !prev.showBackgroundModal,
    }));
  }, []);

  // 이미지 컨트롤 닫기
  const closeImageControls = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedImageId: null,
      isImageControlsVisible: false,
    }));
  }, []);

  return {
    state,
    selectedImageItem,
    handleImageSelect,
    addImage,
    selectBackgroundImage,
    updateImagePosition,
    deleteImage,
    toggleBackgroundModal,
    closeImageControls,
  };
};
