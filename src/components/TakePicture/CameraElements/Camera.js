import React, { useCallback, useContext, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  Text,
  Dimensions,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import CreateContext from '../../../context/createContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import NotAuthorized from './NotAuthorized';
import { hasCameraPermissions } from '../../../permissions';
import { normalize } from '../../../utils/fonts';
import Video from 'react-native-video';

const Camera = ({ openGallery, cameraRollPreview }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { addPhoto, changeVideo } = useContext(CreateContext);

  //Camera core
  const [type, setType] = useState('photo');
  const [recording, setRecording] = useState(false);
  const [pausePreviewVideo, setPausePreviewVideo] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [flash, setFlash] = useState(false);
  const [pausePreview, setPausePreview] = useState(false);
  const [preview, setPreview] = useState(null);

  const changeFlash = useCallback(() => {
    setFlash(!flash);
  }, [flash]);

  const onClose = useCallback(
    async (camera) => {
      if (pausePreview) {
        await camera.resumePreview();
        setPausePreview(false);
      } else {
        navigation.goBack();
      }
    },
    [pausePreview],
  );

  const takePicture = useCallback(async (camera) => {
    if (type === 'photo') {
      const options = { quality: 1, base64: true };
      const data = await camera.takePictureAsync(options);
      const { uri, imageType } = data;
      if (uri) {
        await camera.pausePreview();
        setPausePreview(true);
        setPreview({
          node: {
            image: {
              uri,
            },
            type: imageType ? imageType : 'image/jpeg',
          },
        });
      }
    } else {
      if (!recording) {
        setRecording(true);
        setPausePreviewVideo(false);
        const data = await camera.recordAsync({
          quality: RNCamera.Constants.VideoQuality['720p'],
          maxFileSize: 80 * 1024 * 1024,
        });
        setRecording(false);
        setPreviewVideo({
          node: {
            image: {
              uri: data.uri,
            },
            type: 'video/mp4',
          },
        });
        setPausePreviewVideo(true);
      } else {
        await camera.stopRecording();
        setRecording(false);
        setPausePreviewVideo(true);
      }
    }
  });

  const savePhoto = useCallback(() => {
    addPhoto(preview);
    navigation.navigate('Index');
  }, [navigation, preview]);

  const saveVideo = useCallback(() => {
    changeVideo(previewVideo);
    navigation.navigate('Index');
  }, [navigation, previewVideo]);

  const onSuccessRequestOfPermissions = useCallback(() => {
    navigation.navigate('TakePicture', { status: 'READY' });
  }, [navigation]);

  const changeType = useCallback((type) => {
    setType(type);
  });

  return (
    <RNCamera
      captureAudio={false}
      style={styles.container}
      type={RNCamera.Constants.Type.back}
      flashMode={
        flash
          ? RNCamera.Constants.FlashMode.on
          : RNCamera.Constants.FlashMode.off
      }
      onTap={(e) => {
        console.log(e);
      }}>
      {({ camera, status }) => {
        if (status === 'NOT_AUTHORIZED' && !route.params) {
          return (
            <NotAuthorized
              type="CÁMARA"
              requestPermission={hasCameraPermissions}
              onSuccess={onSuccessRequestOfPermissions}
            />
          );
        }
        return (
          <>
            <TopBar
              camera={camera}
              pausePreview={pausePreview}
              flash={flash}
              changeFlash={changeFlash}
              onClose={onClose}
            />
            {pausePreview || pausePreviewVideo ? (
              pausePreview ? (
                <>
                  <View style={styles.pause}>
                    <Pressable onPress={savePhoto}>
                      <Text style={styles.continueButton}>Agregar</Text>
                    </Pressable>
                  </View>
                  {preview && (
                    <Image
                      style={styles.preview}
                      source={{ uri: preview.node.image.uri }}
                    />
                  )}
                </>
              ) : (
                <>
                  <View style={styles.pause}>
                    <Pressable onPress={saveVideo}>
                      <Text style={styles.continueButton}>Agregar video</Text>
                    </Pressable>
                  </View>
                  {previewVideo && (
                    <Video
                      style={styles.preview}
                      source={{ uri: previewVideo.node.image.uri }}
                      repeat
                      resizeMode="cover"
                    />
                  )}
                </>
              )
            ) : (
              <BottomBar
                camera={camera}
                cameraRollPreview={cameraRollPreview}
                openGallery={openGallery}
                takePicture={takePicture}
                type={type}
                changeType={changeType}
                recording={recording}
              />
            )}
          </>
        );
      }}
    </RNCamera>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  pause: {
    position: 'absolute',
    zIndex: 2,
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    fontWeight: 'bold',
    fontSize: normalize(18),
    lineHeight: normalize(18),
  },
  preview: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
export default Camera;
