import React, { useCallback, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
} from 'react-native';
import CityContext from '../../context/cityContext';
import { normalize } from '../../utils/fonts';
import { theme } from '../../theme';

const EmergencyCard = (props) => {
  const { city } = useContext(CityContext);
  const navigation = useNavigation();
  const goToDetail = useCallback(() => {
    navigation.navigate('Detail', {
      event: {
        ...props,
        city,
      },
    });
  });
  return (
    <TouchableNativeFeedback onPress={goToDetail}>
      <View style={styles.container}>
        <Image style={styles.image} source={{ uri: props.photos[0] }} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{props.emergency_type.name}</Text>
          <Text style={styles.colorText} numberOfLines={3}>
            {props.description}
          </Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 13,
    backgroundColor: 'white',
    marginHorizontal: 30,
    marginVertical: 10,
    height: 120,
  },
  image: {
    flex: 1,
    height: '100%',
    borderRadius: 20,
  },
  textContainer: {
    flex: 2,
    width: 240,
    padding: 10,
    paddingVertical: 5,
  },
  title: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  colorText: {
    color: theme.colors.text,
  },
});
const areEqual = (prevProps, nextProps) => {
  return prevProps.id === nextProps.id;
};
export default React.memo(EmergencyCard, areEqual);
