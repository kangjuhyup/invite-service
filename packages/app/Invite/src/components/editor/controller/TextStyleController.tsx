import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
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
  onDeletePress: () => void;
  onDonePress: () => void;
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
  onDeletePress,
  onDonePress,
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
          <Text style={styles.controlText}>색상</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controlsRight}>
        <TouchableOpacity
          style={[styles.controlButton, styles.deleteButton]}
          onPress={onDeletePress}>
          <Icon name="delete" size={24} color="#ff4444" />
          <Text style={[styles.controlText, styles.deleteText]}>삭제</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={onDonePress}>
          <Icon name="check" size={24} color="#1a73e8" />
          <Text style={[styles.controlText, styles.doneText]}>완료</Text>
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
  scrollView: {
    flexGrow: 0,
    marginRight: 8,
  },
  container: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
  },
  sizeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4,
    marginRight: 4,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 8,
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
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingBottom: 4,
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
  controlsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  controlText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
  deleteText: {
    color: '#ff4444',
  },
  doneText: {
    color: '#1a73e8',
  },
});
