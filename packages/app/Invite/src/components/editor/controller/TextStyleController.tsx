import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface TextStyleControllerProps {
  fontSize: number;
  isBold: boolean;
  textColor: string;
  isColorPickerVisible: boolean;
  onFontSizeChange: (size: number) => void;
  onBoldToggle: () => void;
  onColorChange: (color: string) => void;
  onToggleColorPicker: () => void;
}

/**
 * 텍스트 스타일 컨트롤러 컴포넌트
 * 폰트 크기, 굵기, 색상 등을 조절할 수 있는 컨트롤러를 제공합니다.
 */
export const TextStyleController: React.FC<TextStyleControllerProps> = ({
  fontSize,
  isBold,
  textColor,
  isColorPickerVisible,
  onFontSizeChange,
  onBoldToggle,
  onColorChange,
  onToggleColorPicker,
}) => {
  // 기본 색상 팔레트
  const colorPalette = [
    '#000000',
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#FF00FF',
    '#00FFFF',
    '#808080',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        {/* 폰트 크기 조절 */}
        <View style={styles.sizeControl}>
          <TouchableOpacity
            onPress={() => onFontSizeChange(Math.max(8, fontSize - 2))}
            style={styles.button}>
            <Icon name="remove" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.sizeText}>{fontSize}</Text>
          <TouchableOpacity
            onPress={() => onFontSizeChange(Math.min(72, fontSize + 2))}
            style={styles.button}>
            <Icon name="add" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* 굵기 토글 */}
        <TouchableOpacity
          onPress={onBoldToggle}
          style={[styles.button, isBold && styles.activeButton]}>
          <Icon name="format-bold" size={24} color="#666" />
        </TouchableOpacity>

        {/* 색상 선택 */}
        <TouchableOpacity
          onPress={onToggleColorPicker}
          style={styles.colorButton}>
          <View style={[styles.colorPreview, {backgroundColor: textColor}]} />
        </TouchableOpacity>
      </View>

      {/* 색상 피커 */}
      {isColorPickerVisible && (
        <View style={styles.colorPicker}>
          <View style={styles.colorGrid}>
            {colorPalette.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  {backgroundColor: color},
                  textColor === color && styles.selectedColor,
                ]}
                onPress={() => onColorChange(color)}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  sizeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 4,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  activeButton: {
    backgroundColor: '#e3f2fd',
  },
  sizeText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  colorPicker: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#000',
  },
});
