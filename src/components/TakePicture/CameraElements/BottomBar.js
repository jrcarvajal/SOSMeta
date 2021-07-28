import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import CameraButton from '../../Icons/CameraButton';
import { normalize } from '../../../utils/fonts';

const BottomBar = ({
  camera,
  cameraRollPreview,
  takePicture,
  openGallery,
  type,
  changeType,
  recording,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.type}>
        <Pressable
          onPress={() => {
            changeType('photo');
          }}>
          <Text style={[styles.option, type === 'photo' && styles.active]}>
            Foto
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            changeType('video');
          }}>
          <Text style={[styles.option, type === 'video' && styles.active]}>
            Video
          </Text>
        </Pressable>
      </View>
      <View style={styles.bottom}>
        <Pressable onPress={openGallery}>
          <View style={styles.cameraRoll}>
            {cameraRollPreview && (
              <Image
                style={styles.cameraRollPreview}
                source={{ uri: cameraRollPreview }}
              />
            )}
          </View>
        </Pressable>
        <Pressable onPress={() => takePicture(camera)}>
          {type === 'photo' ? (
            <CameraButton />
          ) : recording ? (
            <CameraButton recording />
          ) : (
            <CameraButton color="red" />
          )}
        </Pressable>
        <View style={styles.fillBottom} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 2,
    bottom: 0,
    width: '100%',
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  bottom: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cameraRoll: {
    width: 65,
    height: 65,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    padding: 3,
  },
  cameraRollPreview: {
    borderRadius: 5,
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    resizeMode: 'cover',
  },
  fillBottom: {
    width: 65,
  },
  type: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  option: {
    color: 'white',
    fontSize: normalize(16),
    marginBottom: 18,
    marginHorizontal: 12,
  },
  active: {
    color: 'yellow',
  },
});
export default BottomBar;
