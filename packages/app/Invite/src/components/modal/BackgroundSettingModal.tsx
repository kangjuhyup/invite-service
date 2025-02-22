import React from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface BackgroundSettingModalProps {
  visible: boolean;
  onClose: () => void;
  hue: number;
  saturation: number;
  lightness: number;
  backgroundColor: string;
  onHueChange: (value: number) => void;
  onSaturationChange: (value: number) => void;
  onLightnessChange: (value: number) => void;
  onSelectImage: () => void;
  onSelectColor: (color: string) => void;
}

export const BackgroundSettingModal: React.FC<BackgroundSettingModalProps> = ({
  visible,
  onClose,
  hue,
  saturation,
  lightness,
  backgroundColor,
  onHueChange,
  onSaturationChange,
  onLightnessChange,
  onSelectImage,
  onSelectColor,
}) => {
  // 기본 색상 팔레트
  const colorPalette = [
    '#FFFFFF',
    '#000000',
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#FF00FF',
    '#00FFFF',
    '#FFA500',
    '#800080',
    '#008080',
    '#808080',
  ];
  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={onClose}
      animationType="slide">
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={e => e.stopPropagation()}>
            <Text style={styles.modalTitle}>배경 설정</Text>
            <View style={styles.colorPicker}>
              <Text style={styles.colorLabel}>배경색 선택</Text>
              <View style={styles.colorGrid}>
                {colorPalette.map(color => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      backgroundColor === color && styles.selectedColor,
                    ]}
                    onPress={() => onSelectColor(color)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.colorControls}>
              <Text style={styles.colorLabel}>색조</Text>
              <Slider
                value={hue}
                onValueChange={onHueChange}
                minimumValue={0}
                maximumValue={360}
                style={styles.slider}
              />
              <Text style={styles.colorLabel}>채도</Text>
              <Slider
                value={saturation}
                onValueChange={onSaturationChange}
                minimumValue={0}
                maximumValue={100}
                style={styles.slider}
              />
              <Text style={styles.colorLabel}>밝기</Text>
              <Slider
                value={lightness}
                onValueChange={onLightnessChange}
                minimumValue={0}
                maximumValue={100}
                style={styles.slider}
              />
            </View>
            <TouchableOpacity
              style={styles.imageSelectButton}
              onPress={onSelectImage}>
              <Icon name="image" size={24} color="#666" />
              <Text style={styles.imageSelectText}>이미지 선택</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  colorPicker: {
    marginBottom: 15,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#1a73e8',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  colorControls: {
    marginBottom: 15,
    paddingHorizontal: 8,
  },
  colorLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  imageSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  imageSelectText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
});
