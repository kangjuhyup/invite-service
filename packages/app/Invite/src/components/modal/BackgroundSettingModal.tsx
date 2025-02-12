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
  onHueChange: (value: number) => void;
  onSaturationChange: (value: number) => void;
  onLightnessChange: (value: number) => void;
  onSelectImage: () => void;
}

export const BackgroundSettingModal: React.FC<BackgroundSettingModalProps> = ({
  visible,
  onClose,
  hue,
  saturation,
  lightness,
  onHueChange,
  onSaturationChange,
  onLightnessChange,
  onSelectImage,
}) => {
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
            <View style={styles.colorControls}>
              <Text style={styles.colorLabel}>색조</Text>
              <Slider
                value={hue}
                onValueChange={(value: any) => onHueChange(value[0])}
                minimumValue={0}
                maximumValue={360}
              />
              <Text style={styles.colorLabel}>채도</Text>
              <Slider
                value={saturation}
                onValueChange={(value: any) => onSaturationChange(value[0])}
                minimumValue={0}
                maximumValue={100}
              />
              <Text style={styles.colorLabel}>밝기</Text>
              <Slider
                value={lightness}
                onValueChange={(value: any) => onLightnessChange(value[0])}
                minimumValue={0}
                maximumValue={100}
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
