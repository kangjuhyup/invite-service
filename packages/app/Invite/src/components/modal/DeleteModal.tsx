import React from 'react';
import {View, Modal, StyleSheet, Text} from 'react-native';
import LottieView from 'lottie-react-native';

interface Props {
  visible: boolean;
}

/**
 * 삭제 중임을 나타내는 로딩 모달
 */
export const DeleteModal: React.FC<Props> = ({visible}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.content}>
          <LottieView
            source={require('../../assets/lottie/DeleteLottie.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text style={styles.text}>삭제 중...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  lottie: {
    width: 100,
    height: 100,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});
