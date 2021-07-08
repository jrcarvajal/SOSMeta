import React, { useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Layout from '../components/common/Layout';
import Select from '../components/common/SelectCity';
import { theme } from '../theme';
import illustration from '../../assets/illustration.png';
import { normalize } from '../utils/fonts';

const HomeScreen = (props) => {
  const navigation = useNavigation();
  //const { city } = useContext(MunicipioContext);

  /*useEffect(() => {
    if (city) {
      navigation.navigate('List');
    }
  }, [city]);*/

  return (
    //<Layout>
      <View style={styles.container}>
        <Image
          style={styles.image}
          resizeMode="contain"
          source={illustration}
        />
        <View style={styles.content}>
          <Text style={styles.title}>SOS Meta</Text>
          <Text style={styles.subtitle}>
            Reporte de emergencias en el departamento del Meta
          </Text>
          <Select main />
        </View>
      </View>
    //</Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 80,
  },
  content: {
    justifyContent: 'center',
    paddingBottom: normalize(30),
    paddingHorizontal:
      Dimensions.get('window').width < 370 ? normalize(20) : normalize(40),
  },
  title: {
    color: theme.colors.blue,
    fontSize: normalize(26),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal:
      Dimensions.get('window').width < 370 ? normalize(25) : normalize(50),
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 12,
    fontSize: normalize(16),
    color: theme.colors.text,
    paddingHorizontal:
      Dimensions.get('window').width < 370 ? normalize(25) : normalize(50),
  },
  image: {
    flex: 1,
    width: '100%',
  },
});
export default HomeScreen;
