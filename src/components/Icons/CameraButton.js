import React from 'react';
import { StyleSheet, View } from 'react-native';

const CameraButton = ({ size = 85, color = 'white', recording }) => {
  const styles = StyleSheet.create({
    outside: {
      height: size,
      width: size,
      borderWidth: 4,
      borderColor: 'white',
      borderRadius: size / 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inside: {
      width: size - 5,
      height: size - 5,
      borderRadius: size / 2,
      backgroundColor: color,
      borderWidth: 5,
      borderColor: 'transparent',
    },
    recordingOutside: {
      backgroundColor: 'white',
    },
    recordingInside: {
      width: 30,
      height: 30,
      borderRadius: 8,
      backgroundColor: 'red',
    },
  });
  return (
    <View style={[styles.outside, recording && styles.recordingOutside]}>
      <View style={[styles.inside, recording && styles.recordingInside]} />
    </View>
  );
};
export default CameraButton;
