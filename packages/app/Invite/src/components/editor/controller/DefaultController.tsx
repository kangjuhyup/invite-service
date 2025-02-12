import React from 'react';
import {View, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface DefaultControllerProps {
  onBackgroundPress: () => void;
  onTextPress: () => void;
  onImagePress: () => void;
  onStickerPress: () => void;
  onDeletePress?: () => void;
  selectedItem: string | null;
}

export const DefaultController: React.FC<DefaultControllerProps> = ({
  onBackgroundPress,
  onTextPress,
  onImagePress,
  onStickerPress,
  onDeletePress,
  selectedItem,
}) => {
  return (
    <View style={styles.toolbar}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.toolButton}
          onPress={onBackgroundPress}>
          <Icon name="format-color-fill" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={onTextPress}>
          <Icon name="text-fields" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={onImagePress}>
          <Icon name="image" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={onStickerPress}>
          <Icon name="emoji-emotions" size={24} color="#666" />
        </TouchableOpacity>
        {selectedItem && onDeletePress && (
          <TouchableOpacity
            style={[styles.toolButton, styles.deleteButton]}
            onPress={onDeletePress}>
            <Icon name="delete" size={24} color="#ff4444" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  toolButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
});
