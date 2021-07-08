import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import FlashOff from '../../Icons/FlashOff';
import FlashOn from '../../Icons/FlashOn';
import Close from '../../Icons/Close';

const TopBar = ({ camera, pausePreview, flash, changeFlash, onClose }) => {
  return (
    <View style={styles.topBar}>
      {pausePreview ? (
        <View style={styles.emptyFlash} />
      ) : (
        <Pressable onPress={changeFlash}>
          {flash ? (
            <FlashOn size={32} color="white" />
          ) : (
            <FlashOff size={32} color="white" />
          )}
        </Pressable>
      )}
      <Pressable
        onPress={() => {
          onClose(camera);
        }}>
        <Close size={36} color="white" />
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  topBar: {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  emptyFlash: {
    width: 32,
  },
});
export default TopBar;
