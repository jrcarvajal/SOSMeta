import React, { useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, Pressable, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import Close from '../Icons/Close';
import PinchableBox from './PinchableBox';

const ImageModal = ({ photo, openModal, onClose }) => {
  const { height } = Dimensions.get('window');
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(1);

  const navigation = useNavigation();

  useEffect(() => {
    if (openModal[openModal.length - 1] === 1) {
      open();
    } else {
      close();
    }
  }, [openModal]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {
          translateY: height * translateY.value,
        },
      ],
    };
  });

  const open = useCallback(() => {
    opacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.ease,
    });
    translateY.value = withTiming(0, {
      duration: 400,
      easing: Easing.ease,
    });
  });

  const close = useCallback(() => {
    opacity.value = withTiming(0, {
      duration: 450,
      easing: Easing.ease,
    });
    translateY.value = withTiming(1, {
      duration: 450,
      easing: Easing.ease,
    });
  });

  return (
    <PanGestureHandler
      minPointers={1}
      maxPointers={1}
      onGestureEvent={(e) => {
        if (e.nativeEvent.translationY > 0) {
          const maxTranslation = height;
          const percentage =
            maxTranslation - e.nativeEvent.translationY > 0
              ? e.nativeEvent.translationY / maxTranslation
              : 1;
          opacity.value = withSpring(1 - percentage);
          translateY.value = withSpring(percentage);
        }
      }}
      onHandlerStateChange={(e) => {
        if (translateY.value > 0.2) {
          opacity.value = withSpring(0);
          translateY.value = withSpring(1);
          navigation.setParams({ hideFooter: false });
        } else {
          opacity.value = withSpring(1);
          translateY.value = withSpring(0);
        }
      }}>
      <Animated.View style={[styles.container, animatedStyles]}>
        <Pressable
          style={styles.button}
          hitSlop={{ bottom: 10, top: 10, right: 10, left: 10 }}
          onPress={onClose}>
          <Close size={32} color="white" />
        </Pressable>
        <PinchableBox photo={photo} />
      </Animated.View>
    </PanGestureHandler>
  );
};
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    zIndex: 999,
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 90,
  },
});
export default ImageModal;
