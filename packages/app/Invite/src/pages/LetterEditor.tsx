import React, {useState, useRef} from 'react';
import ViewShot from 'react-native-view-shot';
import {useImageSave} from '../hooks/useImageSave';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import {EditorItem} from '../components/editor/EditorItem';
import {TextStyleController} from '../components/editor/controller/TextStyleController';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BackgroundSettingModal} from '../components/modal/BackgroundSettingModal';
import {useNavigation} from '@react-navigation/native';
import {useTextEditor} from '../hooks/useTextEditor';
import {useImageEditor} from '../hooks/useImageEditor';

import {styles} from '../styles/LetterEditor.styles';
import {EditorItemType} from '../types/editor';
import {BACKGROUND_HEIGHT, BACKGROUND_WIDTH} from '../constants/canvas';
import {DefaultController} from '../components/editor/controller/DefaultController';
import {ImageController} from '../components/editor/controller/ImageController';

const LetterEditor: React.FC = () => {
  const [showTextStyleControls, setShowTextStyleControls] =
    useState<boolean>(false);
  const navigation = useNavigation();

  const {editorRef, viewShotRef, handleSave} = useImageSave();

  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [lightness, setLightness] = useState(100);
  const [items, setItems] = useState<EditorItemType[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);

  const updateItem = (id: string, updates: Partial<EditorItemType>) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? {...item, ...updates} : item)),
    );
  };

  const {
    state: {
      isImageControlsVisible: showImageControls,
      isProcessingImage,
      backgroundImage,
    },
    handleImageSelect,
    addImage,
    selectBackgroundImage,
    updateImagePosition,
    deleteImage,
    closeImageControls,
  } = useImageEditor({
    items,
    onUpdateItem: (id: string, updates: Partial<EditorItemType>) => {
      updateItem(id, updates);
    },
    onAddItem: (item: EditorItemType) => setItems(prev => [...prev, item]),
    onDeleteItem: (id: string) =>
      setItems(prev => prev.filter(item => item.id !== id)),
  });

  const {
    state: {textColor, fontSize, isBold, isColorPickerVisible: showColorPicker},
    handleTextSelect,
    handleFontSizeChange,
    handleColorChange,
    handleBoldToggle,
    toggleColorPicker,
    closeTextStyleControls,
  } = useTextEditor({
    items,
    onUpdateItem: updateItem,
    onAddItem: (item: EditorItemType) => setItems(prev => [...prev, item]),
    onDeleteItem: (id: string) =>
      setItems(prev => prev.filter(item => item.id !== id)),
  });

  const addText = () => {
    const newItem: EditorItemType = {
      id: Math.random().toString(),
      type: 'text',
      content: '텍스트를 입력하세요',
      style: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000000',
      },
      position: {
        x: 100,
        y: 100,
      },
    };
    setItems(prev => [...prev, newItem]);
    setSelectedItem(newItem.id);
    setShowTextStyleControls(true);
  };

  const updateTextContent = (id: string, content: string) => {
    updateItem(id, {content});
  };

  const renderItem = (item: EditorItemType) => {
    switch (item.type) {
      case 'text':
        return (
          <TextInput
            style={{
              ...styles.editorText,
              fontSize: item.style?.fontSize || 16,
              fontWeight: item.style?.fontWeight || 'normal',
              color: item.style?.color || '#000000',
            }}
            value={item.content}
            onChangeText={text => updateTextContent(item.id, text)}
            multiline
            scrollEnabled={false}
          />
        );
      case 'image':
      case 'sticker':
        return (
          <Image
            source={{uri: item.content}}
            style={styles.editorImage}
            resizeMode="contain"
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.title}>초대장 편집</Text>
        <TouchableOpacity
          onPress={async () => {
            try {
              await handleSave(
                backgroundImage,
                BACKGROUND_WIDTH,
                BACKGROUND_HEIGHT,
                items,
              );
              Alert.alert('성공', '초대장이 저장되었습니다.');
              navigation.goBack();
            } catch (error) {
              console.error('이미지 저장 중 오류 발생:', error);
              Alert.alert('오류', '초대장 저장에 실패했습니다.');
            }
          }}>
          <Text style={styles.saveButton}>저장</Text>
        </TouchableOpacity>
      </View>

      <ViewShot
        ref={viewShotRef}
        style={styles.canvasContainer}
        options={{
          format: 'png',
          quality: 1,
          fileName: 'letter',
        }}>
        <View
          ref={editorRef}
          style={[
            styles.canvas,
            backgroundImage
              ? {backgroundColor: 'transparent'}
              : {backgroundColor},
          ]}>
          {backgroundImage && (
            <Image
              source={{uri: backgroundImage}}
              style={styles.backgroundImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.itemsContainer}>
            {items.map(item => (
              <EditorItem
                key={item.id}
                item={item}
                isSelected={selectedItem === item.id}
                onSelect={() => {
                  if (selectedItem === item.id) return;
                  setSelectedItem(item.id);
                  if (item.type === 'text') {
                    handleTextSelect(item.id);
                    closeImageControls();
                  } else if (item.type === 'image') {
                    handleImageSelect(item.id);
                    closeTextStyleControls();
                  } else {
                    closeTextStyleControls();
                    closeImageControls();
                  }
                }}
                onPositionChange={position =>
                  updateImagePosition(item.id, position)
                }>
                {renderItem(item)}
              </EditorItem>
            ))}
          </View>
        </View>
      </ViewShot>

      <BackgroundSettingModal
        visible={showBackgroundModal}
        onClose={() => setShowBackgroundModal(false)}
        hue={hue}
        saturation={saturation}
        lightness={lightness}
        onHueChange={value => setHue(value)}
        onSaturationChange={value => setSaturation(value)}
        onLightnessChange={value => {
          setLightness(value);
        }}
        onSelectImage={selectBackgroundImage}
      />

      {!showTextStyleControls && !showImageControls ? (
        <DefaultController
          onBackgroundPress={() => setShowBackgroundModal(true)}
          onTextPress={addText}
          onImagePress={addImage}
          onStickerPress={() => {}}
          onDeletePress={selectedItem ? () => {} : undefined}
          selectedItem={selectedItem}
        />
      ) : showImageControls && selectedItem ? (
        <ImageController
          isProcessingImage={isProcessingImage}
          onDeletePress={() => {
            deleteImage(selectedItem);
            closeImageControls();
          }}
          onDonePress={() => {
            closeImageControls();
            setSelectedItem(null);
          }}
        />
      ) : (
        <TextStyleController
          fontSize={fontSize}
          isBold={isBold}
          textColor={textColor}
          isColorPickerVisible={showColorPicker}
          onFontSizeChange={handleFontSizeChange}
          onBoldToggle={handleBoldToggle}
          onColorChange={handleColorChange}
          onToggleColorPicker={toggleColorPicker}
        />
      )}
    </SafeAreaView>
  );
};
export default LetterEditor;
