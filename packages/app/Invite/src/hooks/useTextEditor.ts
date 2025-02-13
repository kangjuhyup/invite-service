import {useState, useCallback} from 'react';
import {type EditorItemType} from '../types/editor';

interface TextEditorState {
  selectedTextId: string | null;
  isTextStyleVisible: boolean;
  textColor: string;
  fontSize: number;
  isBold: boolean;
  isColorPickerVisible: boolean;
}

interface UseTextEditorProps {
  items: EditorItemType[];
  onUpdateItem: (id: string, updates: Partial<EditorItemType>) => void;
  onAddItem: (item: EditorItemType) => void;
  onDeleteItem: (id: string) => void;
}

/**
 * 텍스트 에디터 관련 상태와 함수들을 관리하는 훅
 */
export const useTextEditor = ({
  items,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
}: UseTextEditorProps) => {
  const [state, setState] = useState<TextEditorState>({
    selectedTextId: null,
    isTextStyleVisible: false,
    textColor: '#000000',
    fontSize: 16,
    isBold: false,
    isColorPickerVisible: false,
  });

  // 선택된 텍스트 아이템 가져오기
  const selectedTextItem = items.find(item => item.id === state.selectedTextId);

  // 텍스트 선택
  const handleTextSelect = useCallback(
    (id: string) => {
      const textItem = items.find(item => item.id === id);
      if (textItem) {
        setState(prev => ({
          ...prev,
          selectedTextId: id,
          isTextStyleVisible: true,
          textColor: textItem.style?.color || '#000000',
          fontSize: textItem.style?.fontSize || 16,
          isBold: textItem.style?.fontWeight === 'bold',
        }));
      }
    },
    [items],
  );

  // 텍스트 스타일 변경
  const handleTextStyleChange = useCallback(
    (updates: Partial<EditorItemType['style']>) => {
      if (state.selectedTextId) {
        onUpdateItem(state.selectedTextId, {
          style: {
            fontSize: state.fontSize,
            color: state.textColor,
            fontWeight: state.isBold ? 'bold' : 'normal',
            ...updates,
          },
        });
      }
    },
    [
      state.selectedTextId,
      state.fontSize,
      state.textColor,
      state.isBold,
      onUpdateItem,
    ],
  );

  // 폰트 크기 변경
  const handleFontSizeChange = useCallback(
    (newSize: number) => {
      setState(prev => ({...prev, fontSize: newSize}));
      handleTextStyleChange({fontSize: newSize});
    },
    [handleTextStyleChange],
  );

  // 텍스트 색상 변경
  const handleColorChange = useCallback(
    (color: string) => {
      setState(prev => ({
        ...prev,
        textColor: color,
        isColorPickerVisible: false,
      }));
      handleTextStyleChange({color});
    },
    [handleTextStyleChange],
  );

  // 굵기 변경
  const handleBoldToggle = useCallback(() => {
    setState(prev => ({...prev, isBold: !prev.isBold}));
    handleTextStyleChange({fontWeight: state.isBold ? 'normal' : 'bold'});
  }, [state.isBold, handleTextStyleChange]);

  // 텍스트 내용 변경
  const handleTextChange = useCallback(
    (text: string) => {
      if (state.selectedTextId) {
        onUpdateItem(state.selectedTextId, {content: text});
      }
    },
    [state.selectedTextId, onUpdateItem],
  );

  // 컬러 피커 토글
  const toggleColorPicker = useCallback(() => {
    setState(prev => ({
      ...prev,
      isColorPickerVisible: !prev.isColorPickerVisible,
    }));
  }, []);

  // 텍스트 스타일 컨트롤 닫기
  const closeTextStyleControls = useCallback(() => {
    console.log('closeTextStyleControls');
    setState(prev => ({
      ...prev,
      selectedTextId: null,
      isTextStyleVisible: false,
      isColorPickerVisible: false,
    }));
  }, []);

  const deleteItem = useCallback(() => {
    if (!state.selectedTextId) return;
    onDeleteItem(state.selectedTextId);
    setState(prev => ({
      ...prev,
      selectedTextId: null,
      isTextStyleVisible: false,
      isColorPickerVisible: false,
    }));
  }, [state.selectedTextId, onDeleteItem]);

  return {
    state,
    selectedTextItem,
    handleTextSelect,
    handleFontSizeChange,
    handleColorChange,
    handleBoldToggle,
    handleTextChange,
    toggleColorPicker,
    closeTextStyleControls,
    deleteItem,
  };
};
