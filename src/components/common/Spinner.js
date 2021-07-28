import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { theme } from '../../theme';

const Spinner = ({ light }) => {
  const rotation = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${rotation.value}deg`,
        },
      ],
    };
  }, [rotation.value]);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      200,
    );
  }, []);

  const color = light ? 'rgb(255,255,255)' : 'rgba(0,0,0,.1)';

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spinner,
          {
            borderTopColor: color,
            borderRightColor: color,
            borderBottomColor: color,
          },
          animatedStyles,
        ]}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  spinner: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 7,
    borderLeftColor: theme.colors.orange,
  },
});
export default Spinner;
