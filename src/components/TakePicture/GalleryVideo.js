import React, { useEffect, useState } from 'react';
import { StyleSheet, Pressable, View, Dimensions, Image } from 'react-native';
import Tick from '../Icons/Tick';
import { createThumbnail } from 'react-native-create-thumbnail';
const GalleryVideo = ({ video, selected, addVideo, removeVideo }) => {
  const [thumbnail, setThumbnail] = useState('');

  useEffect(() => {
    createThumbnail({
      url: video.node.image.uri,
      timeStamp: 300,
    }).then((data) => {
      setThumbnail(data.path);
    });
  }, []);

  const changeState = () => {
    if (selected) {
      removeVideo(video);
    } else {
      addVideo(video);
    }
  };
  return (
    <Pressable key={video.node.image.uri} onPress={changeState}>
      <View style={styles.photoContainer}>
        {thumbnail ? (
          <Image style={styles.photo} source={{ uri: thumbnail }} />
        ) : (
          <View style={styles.photo} />
        )}
        {selected && (
          <View style={styles.overlay}>
            <Tick color="white" size={44} />
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  photoContainer: {
    width: Dimensions.get('window').width / 4,
    height: Dimensions.get('window').width / 4,
    padding: 2,
  },
  photo: {
    backgroundColor: 'lightgray',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    left: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.selected === nextProps.selected &&
    prevProps.photo === nextProps.photo
  );
};
export default React.memo(GalleryVideo, areEqual);
