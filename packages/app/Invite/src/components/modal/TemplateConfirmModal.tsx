import React from 'react';
import {View, Text, Modal, StyleSheet, TouchableOpacity} from 'react-native';

interface TemplateConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const TemplateConfirmModal: React.FC<TemplateConfirmModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>템플릿 공개</Text>
          <Text style={styles.message}>
            이 초대장을 템플릿으로 공개하시겠습니까?{'\n'}
            다른 사용자들이 이 템플릿을 사용할 수 있게 됩니다.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmButtonText}>공개하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#1a73e8',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
  confirmButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
});
