import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { PinchGestureHandler } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

const PinchableBox = ({ photo }) => {
  const pinchScale = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(pinchScale.value),
        },
      ],
    };
  });
  return (
    <PinchGestureHandler
      minPointers={2}
      maxPointers={2}
      onGestureEvent={(e) => {
        pinchScale.value = e.nativeEvent.scale;
      }}
      onHandlerStateChange={(e) => {
        pinchScale.value = 1;
      }}>
      <Animated.Image
        source={{ uri: photo }}
        style={[styles.image, animatedStyles]}
      />
    </PinchGestureHandler>
  );
};

const styles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
});

export default PinchableBox;
