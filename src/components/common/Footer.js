import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableHighlight, Dimensions } from 'react-native';
import { theme } from '../../theme';
import Plus from '../Icons/Plus';

const Footer = (props) => {
  const route = useRoute();
  const navigation = useNavigation();

  const onPress = useCallback(() => {
    navigation.navigate('Create');
  });
  if (
    route.name === 'Index' ||
    (route.name === 'Detail' && route.params.hideFooter)
  )
    return null;
  return (
    <View style={styles.container}>
      <View style={styles.bottom} />
      {/* <View style={styles.left} /> */}
      {/* <View style={styles.right} /> */}
      <View style={styles.curve}>
        <TouchableHighlight onPress={onPress} style={styles.button}>
          <Plus color="white" />
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    alignItems: 'center',
    // position: 'relative',
    // backgroundColor: 'white',
    // shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
    zIndex: 2,
  },
  bottom: {
    backgroundColor: theme.colors.gray,
    width: '100%',
    height: 50,
    position: 'absolute',
    left: 0,
    bottom: 0,
    shadowOffset: {
      width: 0,
      height: -7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
    zIndex: 2,
  },
  curve: {
    height: 80,
    width: 80,
    backgroundColor: theme.colors.gray,
    borderRadius: 40,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.61,
    shadowRadius: 9.11,
    elevation: 14,
    zIndex: 2,
  },
  button: {
    backgroundColor: theme.colors.orange,
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
    zIndex: 10,
  },
  left: {
    position: 'absolute',
    top: 0,
    bottom: 45,
    left: 0,
    right: Dimensions.get('window').width / 2 + 28,
    backgroundColor: 'white',
    borderBottomRightRadius: 100,
  },
  right: {
    position: 'absolute',
    top: 0,
    bottom: 45,
    left: Dimensions.get('window').width / 2 + 28,
    right: 0,
    backgroundColor: 'white',
    borderBottomLeftRadius: 100,
  },
});

export default Footer;
