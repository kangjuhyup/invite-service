import React from 'react';
import {View, StyleSheet} from 'react-native';
import {DotLottiePlayer} from '@dotlottie/react-player';
import LottieView from 'lottie-react-native';

interface LetterSendProps {
  visible?: boolean;
}

export const LetterSend: React.FC<LetterSendProps> = ({visible = false}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/lottie/LetterSendLottie.json')}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 999,
  },
  animation: {
    width: 300,
    height: 300,
  },
});
