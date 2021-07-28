import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../theme';
import { normalize } from '../../../utils/fonts';
import SadFace from '../../Icons/SadFace';

const NotAuthorized = ({ type, requestPermission, onSuccess }) => {
  const activeCamera = async () => {
    const { allowed } = await requestPermission();
    if (allowed) {
      onSuccess();
    }
  };
  return (
    <View style={styles.container}>
      <SadFace size={120} color={theme.colors.orange} />
      {Platform.OS === 'android' ? (
        <>
          <Text style={styles.text}>
            No es posible acceder a la {<Text style={styles.bold}>{type}</Text>}
            , porfavor {<Text style={styles.bold}>PRESIONA</Text>} el botón de
            abajo si deseas usarla
          </Text>
          <Pressable onPress={activeCamera}>
            <Text style={styles.button}>Activar</Text>
          </Pressable>
        </>
      ) : (
        <Text style={styles.text}>
          No es posible acceder a la {<Text style={styles.bold}>{type}</Text>},
          porfavor ve a configuración del sistema y activala
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  text: {
    color: theme.colors.text,
    fontSize: normalize(19),
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: theme.colors.blue,
    color: 'white',
    borderRadius: 10,
    fontSize: normalize(18),
    lineHeight: normalize(18),
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
});
export default NotAuthorized;
