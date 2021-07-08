import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

console.log(SCREEN_WIDTH, PixelRatio.get());
// based on test device scale
const scale = SCREEN_WIDTH / 360;

export const normalize = (size) => {
  if (SCREEN_WIDTH > 385 && PixelRatio.get() > 2.5) {
    size = size + 1;
  }
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};
