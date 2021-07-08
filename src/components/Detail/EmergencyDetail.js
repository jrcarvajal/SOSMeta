import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { theme } from '../../theme';
import { normalize } from '../../utils/fonts';
import ImageModal from './ImageModal';
import Map from './Map';

const EmergencyDetail = ({ emergency }) => {
  const { city } = emergency;
  const { description, emergency_type, photos } = emergency;
  const { coordinates } = emergency.geolocation;

  const navigation = useNavigation();

  const [current, setCurrent] = useState(null);
  const [openModal, setOpenModal] = useState([0]);

  const changeCurrent = useCallback(
    (index) => {
      navigation.setParams({ hideFooter: true });
      setCurrent(index);
      setOpenModal([...openModal, 1]);
    },
    [setCurrent],
  );

  const close = useCallback(() => {
    setOpenModal([...openModal, 0]);
  }, [openModal]);
  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{emergency_type.name}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.location}>Ubicación</Text>
        <Text style={styles.description}>{city}</Text>
        <Map coords={coordinates} />
        <View style={styles.images}>
          {photos.map((photo) => (
            <Pressable
              key={photo}
              onPress={(e) => changeCurrent(photo)}
              style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: photo }} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <ImageModal photo={current} openModal={openModal} onClose={close} />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    paddingBottom: 10,
  },
  title: {
    fontSize: normalize(22),
    fontWeight: 'bold',
    color: theme.colors.orange,
    marginBottom: 8,
  },
  description: {
    color: theme.colors.text,
    marginBottom: 16,
  },
  location: {
    fontWeight: 'bold',
    fontSize: normalize(18),
    color: theme.colors.text,
  },
  images: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  imageContainer: {
    width: '30%',
    height: 100,
    margin: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
});
export default EmergencyDetail;
