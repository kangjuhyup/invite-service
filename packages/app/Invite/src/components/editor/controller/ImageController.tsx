import React from 'react';
import {View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ImageControllerProps {
  onDeletePress: () => void;
  onDonePress: () => void;
  isProcessingImage: boolean;
}

export const ImageController: React.FC<ImageControllerProps> = ({
  onDeletePress,
  onDonePress,
  isProcessingImage,
}) => {
  return (
    <View style={styles.imageControls}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}>
        <TouchableOpacity
          style={[
            styles.imageControlButton,
            isProcessingImage && styles.imageControlButtonDisabled,
          ]}
          onPress={async () => {
            if (isProcessingImage) return;
            try {
              Alert.alert('알림', '현재 배경 제거 기능은 준비중입니다.');
            } catch (error) {
              Alert.alert('오류', '배경 제거에 실패했습니다.');
            }
          }}
          disabled={isProcessingImage}>
          <Icon
            name="content-cut"
            size={24}
            color={isProcessingImage ? '#999' : '#666'}
          />
          <Text style={styles.imageControlText}>배경 제거</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.controlsRight}>
        <TouchableOpacity
          style={[styles.controlButton, styles.deleteButton]}
          onPress={onDeletePress}>
          <Icon name="delete" size={24} color="#ff4444" />
          <Text style={[styles.imageControlText, styles.deleteText]}>
            삭제
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={onDonePress}>
          <Icon name="check" size={24} color="#1a73e8" />
          <Text style={[styles.imageControlText, styles.doneText]}>
            완료
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  scrollView: {
    flex: 1,
    marginRight: 8,
  },
  imageControlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  imageControlButtonDisabled: {
    opacity: 0.5,
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
  imageControlText: {
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
