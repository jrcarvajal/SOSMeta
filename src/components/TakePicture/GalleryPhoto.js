import React from 'react';
import { StyleSheet, Pressable, Image, View, Dimensions } from 'react-native';
import Tick from '../Icons/Tick';

const GalleryPhoto = ({ photo, selected, addPhoto, removePhoto }) => {
  const { uri } = photo.node.image;
  const changeState = () => {
    if (selected) {
      removePhoto(photo);
    } else {
      addPhoto(photo);
    }
  };
  return (
    <Pressable key={uri} onPress={changeState}>
      <View style={styles.photoContainer}>
        <Image style={styles.photo} source={{ uri }} />
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
export default React.memo(GalleryPhoto, areEqual);
