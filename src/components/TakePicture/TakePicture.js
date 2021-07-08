import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CameraRoll from '@react-native-community/cameraroll';
import CreateContext from '../../context/createContext';
import Gallery from './Gallery';
import { hasCameraPermissions, hasStoragePermissions } from '../../permissions';
import Camera from './CameraElements/Camera';

const TakePicture = (props) => {
  hasStoragePermissions();
  hasCameraPermissions();

  const navigation = useNavigation();
  const { photos, removePhoto, addPhotos, video, changeVideo } = useContext(
    CreateContext,
  );

  //Camera roll
  const [cameraRollPreview, setCameraRollPreview] = useState();
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [eventsOpen, setEventsOpen] = useState([0]);
  const [storageAllowed, setStorageAllowed] = useState(false);

  useEffect(() => {
    async function getFirstPhoto() {
      const { allowed } = await hasStoragePermissions();
      if (allowed) {
        setStorageAllowed(true);
        CameraRoll.getPhotos({
          first: 1,
          assetType: 'Photos',
        })
          .then(({ edges }) => {
            setCameraRollPreview(edges[0].node.image.uri);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setStorageAllowed(false);
      }
    }
    getFirstPhoto();
  }, []);

  const changeStorageToAllowed = useCallback(() => {
    setStorageAllowed(true);
  }, [setStorageAllowed]);

  const openGallery = useCallback(() => {
    setEventsOpen([...eventsOpen, 1]);
  }, [eventsOpen]);

  const confirmSelection = () => {
    addPhotos(selectedPhotos);
    changeVideo(selectedVideo ? selectedVideo : video);
    navigation.navigate('Index');
  };

  const discardPhotos = useCallback(() => {
    setSelectedPhotos([]);
    setEventsOpen([...eventsOpen, 0]);
  }, [eventsOpen]);

  const addToSelectedPhotos = useCallback(
    (photo) => {
      setSelectedPhotos((state) => [...state, photo]);
    },
    [selectedPhotos],
  );

  const removeFromSelectedPhotos = useCallback(
    (photo) => {
      setSelectedPhotos((state) => {
        if (state.includes(photo)) {
          const newPhotos = state.filter(
            (ph) => ph.node.image.uri !== photo.node.image.uri,
          );
          return newPhotos;
        } else {
          removePhoto(photo);
          return state;
        }
      });
    },
    [selectedPhotos, photos],
  );

  const addVideo = useCallback((video) => {
    setSelectedVideo(video);
  });

  const removeVideo = useCallback(() => {
    setSelectedVideo(null);
  });

  return (
    <View style={styles.container}>
      <Camera openGallery={openGallery} cameraRollPreview={cameraRollPreview} />
      <Gallery
        storageAllowed={storageAllowed}
        changeStorageToAllowed={changeStorageToAllowed}
        selectedPhotos={selectedPhotos}
        eventsOpen={eventsOpen}
        confirmSelection={confirmSelection}
        discardPhotos={discardPhotos}
        confirmedPhotos={photos}
        addToSelectedPhotos={addToSelectedPhotos}
        removeFromSelectedPhotos={removeFromSelectedPhotos}
        confirmedVideo={video}
        selectedVideo={selectedVideo}
        addVideo={addVideo}
        removeVideo={removeVideo}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  preview: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
export default TakePicture;
