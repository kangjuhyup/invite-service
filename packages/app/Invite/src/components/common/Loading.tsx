import React from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';

interface LoadingProps {
  visible?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({visible = false}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/lottie/loading.json')}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  animation: {
    width: 200,
    height: 200,
  },
});
