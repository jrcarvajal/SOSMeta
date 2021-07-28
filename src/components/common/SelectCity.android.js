import React, { useContext, useRef, useState, useCallback } from 'react';
import { StyleSheet, Text, Pressable, View, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  Easing,
  withTiming,
} from 'react-native-reanimated';
import { useQuery } from 'react-query';
import CityContext from '../../context/cityContext';
import { theme } from '../../theme';
import ArrowDown from '../Icons/ArrowDown';
import Search from '../Icons/Search';
import { BASE, CITIES } from '../../endpoints';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { normalize } from '../../utils/fonts';
import Plus from '../Icons/Tick';

const SelectCity = ({ main, fixed }) => {
  const inputRef = useRef(null);
  const { city, cityId, changeCity, search, changeSearch } = useContext(
    CityContext,
  );
  const { isLoading, data: options } = useQuery('cities', () =>
    fetch(`${BASE}${CITIES}`).then((res) => res.json()),
  );

  const navigation = useNavigation();
  const route = useRoute();

  const changeOption = (evt) => {
    changeCity(evt.id_municipio, evt.nombre);
    inputRef.current.blur();
  };

  const height = useSharedValue(0);

  const onPress = () => {
    if (height.value === 0) {
      inputRef.current.focus();
      height.value = 400;
    } else {
      inputRef.current.blur();
      height.value = 0;
    }
  };

  const onFocus = () => {
    height.value = 200;
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      maxHeight: withTiming(height.value, {
        duration: 500,
        easing: Easing.ease,
      }),
    };
  });

  const onPress1 = () => {
    if (cityId) {
         navigation.navigate('Create');
    } 
  };

  const OptionsFiltered = () => {
    const optionsFiltered = options &&
      options.filter(({ nombre }) =>
        nombre.toLowerCase().includes(search.toLowerCase()),
  );

    return (
      <>
        {optionsFiltered?.map((opt, index) => (
          <Pressable
            key={opt.id_municipio}
            onPress={() => {
              changeOption(opt);
              height.value = 0;
            }}
            style={[
              styles.option,
              index === optionsFiltered.length - 1 ? styles.noBorder : null,
              opt.id_municipio === cityId ? styles.currentOption : null,
              index === options.length - 1 ? styles.last : null,
              index === 0 ? styles.first : null,
            ]}>
            <Text style={styles.text}>{opt.nombre}</Text>
          </Pressable>
        ))}
      </>
    );
  };

  return (
    <View style={styles.select}>
      <Pressable onPress={onPress}>
        <View
          style={[
            styles.container,
            [{ backgroundColor: main ? theme.colors.orange : 'white' }],
            main ? null : styles.shadow,
          ]}>
          <View style={styles.left}>
            <Search size={28} color={main ? 'white' : 'gray'} />
            <TextInput
              numberOfLines={1}
              ref={inputRef}
              style={[
                styles.text,
                [
                  {
                    color: main ? 'white' : 'gray',
                  },
                ],
              ]}
              placeholder={city ? city : 'Municipio'}
              placeholderTextColor={main ? 'white' : theme.colors.text}
              value={search}
              onChangeText={changeSearch}
              onFocus={onFocus}
            />
          </View>
          <ArrowDown size={28} color={main ? 'white' : 'gray'} />
        </View>
      </Pressable>
      <Animated.ScrollView
        keyboardShouldPersistTaps="always"
        style={[
          styles.options,
          styles.shadow,
          animatedStyles,
          main ? styles.toUp : styles.toDown,
        ]}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text styles={styles.loading}>Cargando</Text>
          </View>
        )}
        <OptionsFiltered />
      </Animated.ScrollView>
      <View style={styles.buttonStyle}> 
      <TouchableOpacity
              style={styles.button}
              activeOpacity={0.5}
              onPress={onPress1}>
              <Plus color="white" />
       </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    bottom: 0,
  },
  text: {
    margin: 0,
    padding: 0,
    marginLeft: 15,
    fontSize: normalize(18),
    color: theme.colors.text,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  left: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  select: {
    top: '15%',
    paddingHorizontal: 30,
    marginVertical: 15,
  },
  options: {
    position: 'absolute',
    backgroundColor: '#FDFDFD',
    left: 30,
    right: 30,
    zIndex: 9000,
    borderRadius: 20,
    overflow: 'hidden',
  },
  option: {
    padding: 10,
    paddingHorizontal: 20,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    overflow: 'hidden',
    color: theme.colors.text,
  },
  noBorder: {
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
  },
  toDown: {
    top: '100%',
  },
  toUp: {
    bottom: '100%',
  },
  currentOption: {
    backgroundColor: theme.colors.gray,
    fontWeight: 'bold',
  },
  last: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  first: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  loading: {
    color: theme.colors.text,
  },
  loadingContainer: {
    padding: 12,
  },
  buttonStyle: {
    alignItems: 'center',
    top: '25%'
  },
  button: {
    backgroundColor: theme.colors.green,
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
  }
});

export default SelectCity;
