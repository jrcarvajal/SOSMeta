import React, { useContext, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { theme } from '../../theme';
import Close from '../Icons/Close';
import CreateContext from '../../context/createContext';
import Video from 'react-native-video';
import VideoIcon from '../../components/Icons/Video';

const Images = () => {
  const { removePhoto, photos, video, removeVideo } = useContext(CreateContext);
  const [selected, setSelected] = useState(null);

  const selectImage = (photo) => {
    if (photo === selected) {
      setSelected(null);
    } else {
      setSelected(photo);
    }
  };

  return (
    <View style={styles.images}>
      {video && (
        <View style={styles.imageContainer}>
          <Pressable
            onPress={() => {
              selectImage(video);
            }}>
            <View
              style={[styles.aux, video === selected ? styles.selected : null]}>
              <Video
                source={{ uri: video.node.image.uri }}
                style={styles.image}
              />
              <View style={{ position: 'absolute', bottom: 12, right: 15 }}>
                <VideoIcon size={20} />
              </View>
            </View>
          </Pressable>
          {video === selected && (
            <Pressable
              style={styles.deleteButton}
              onPress={() => {
                removeVideo();
                setSelected(null);
              }}>
              <Close color={theme.colors.orange} />
            </Pressable>
          )}
        </View>
      )}
      {photos?.map((photo) => (
        <View key={photo.node.image.uri} style={styles.imageContainer}>
          <Pressable
            onPress={() => {
              selectImage(photo);
            }}>
            <View
              style={[styles.aux, photo === selected ? styles.selected : null]}>
              <Image
                source={{ uri: photo.node.image.uri }}
                style={styles.image}
              />
            </View>
          </Pressable>
          {photo === selected && (
            <Pressable
              style={styles.deleteButton}
              onPress={() => {
                removePhoto(photo);
                setSelected(null);
              }}>
              <Close color={theme.colors.orange} />
            </Pressable>
          )}
        </View>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  images: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    width: '33%',
    padding: 4,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 2,
  },
  aux: {
    padding: 3,
  },
  selected: {
    backgroundColor: theme.colors.orange,
    borderRadius: 23,
  },
  deleteButton: {
    position: 'absolute',
    right: -3,
    top: -3,
    backgroundColor: 'white',
    borderColor: theme.colors.orange,
    borderWidth: 3,
    borderRadius: 15,
  },
});
export default Images;
