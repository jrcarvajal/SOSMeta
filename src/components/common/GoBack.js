import React, { useCallback, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ArrowLeft from '../Icons/ArrowLeft';
import { theme } from '../../theme';
import { normalize } from '../../utils/fonts';
import CityContext from '../../context/cityContext';

const GoBack = (props) => {
  const { changeCity } = useContext(CityContext);
  const navigation = useNavigation();
  const route = useRoute();
  const goBack = useCallback(() => {
    navigation.goBack();
    if (route.name === 'List') {
      changeCity('', '');
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      {route.name !== 'Index' ? (
        <Pressable onPress={goBack}>
          <ArrowLeft color="white" />
        </Pressable>
      ) : (
        <View style={styles.empty} />
      )}
      <Text style={styles.text}>SOS Meta</Text>
      <View style={styles.empty} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.orange,
    paddingHorizontal: 7,
    paddingVertical: 3,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '800',
    fontSize: normalize(18),
  },
  empty: {
    width: 24,
  },
});
export default GoBack;
