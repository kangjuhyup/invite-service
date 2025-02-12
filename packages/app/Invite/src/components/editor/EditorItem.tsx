import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

interface EditorItemProps {
  item: any;
  children: React.ReactNode;
  onSelect?: () => void;
  isSelected?: boolean;
  onPositionChange?: (position: { x: number; y: number }) => void;
}

export const EditorItem: React.FC<EditorItemProps> = ({
  item,
  children,
  onSelect,
  isSelected,
  onPositionChange,
}) => {
  const translateX = useSharedValue(item.position?.x || 100);
  const translateY = useSharedValue(item.position?.y || 100);
  const initialX = useSharedValue(item.position?.x || 100);
  const initialY = useSharedValue(item.position?.y || 100);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const updatePosition = (x: number, y: number) => {
    onPositionChange?.({ x, y });
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      initialX.value = translateX.value;
      initialY.value = translateY.value;
    })
    .onUpdate(e => {
      translateX.value = initialX.value + e.translationX;
      translateY.value = initialY.value + e.translationY;
    })
    .onEnd(() => {
      'worklet';
      initialX.value = translateX.value;
      initialY.value = translateY.value;
      runOnJS(updatePosition)(translateX.value, translateY.value);
    });

  const rotationGesture = Gesture.Rotation()
    .onUpdate(e => {
      rotation.value = e.rotation;
    })
    .onEnd(() => {
      rotation.value = withSpring(rotation.value);
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      scale.value = e.scale;
    })
    .onEnd(() => {
      scale.value = withSpring(scale.value);
    });

  const composed = Gesture.Simultaneous(panGesture, rotationGesture, pinchGesture);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {scale: scale.value},
        {rotate: `${rotation.value}rad`},
      ],
    };
  });

  return (
    <GestureDetector gesture={composed}>
      <Animated.View
        style={[styles.container, rStyle, isSelected && styles.selected]}
        onTouchStart={() => onSelect?.()}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  selected: {
    borderWidth: 1,
    borderColor: '#1a73e8',
    borderStyle: 'dashed',
  },
});
