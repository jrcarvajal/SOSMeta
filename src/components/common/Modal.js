import React from 'react';
import { View, Modal as ModalRN, StyleSheet } from 'react-native';

const Modal = ({ children, visible, noCard }) => {
  return (
    <ModalRN animationType="fade" visible={visible} transparent={true}>
      <View style={styles.container}>
        {noCard ? children : <View style={styles.card}>{children}</View>}
      </View>
    </ModalRN>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  card: {
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 20,
  },
});
export default Modal;
