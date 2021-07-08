import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  Easing,
  withTiming,
} from 'react-native-reanimated';
import { theme } from '../../theme';
import { normalize } from '../../utils/fonts';
import ArrowDown from '../Icons/ArrowDown';

const Select = ({
  isLoading,
  options,
  changeOption,
  current,
  placeholder,
  backupOptions,
  error,
  zIndex,
}) => {
  const [localOptions, setLocalOptions] = useState([]);
  const height = useSharedValue(0);
  const onPress = () => {
    if (height.value === 0) {
      height.value = 400;
    } else {
      height.value = 0;
    }
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      maxHeight: withTiming(height.value, {
        duration: 500,
        easing: Easing.ease,
      }),
    };
  });

  const getCurrentName = () => {
    if (current) {
      if (options?.length > 0) {
        return options?.filter((opt) => opt.id_tipo_emergencia === current)[0].descripcion;
      }
      if (localOptions?.length > 0) {
        return localOptions?.filter((opt) => opt.id_tipo_emergencia === current)[0].descripcion;
      }
    }
    return placeholder;
  };

  useEffect(() => {
    backupOptions().then((data) => {
      setLocalOptions(data);
    });
  }, []);

  const currentName = getCurrentName();

  return (
    <>
      <View style={[styles.select]}>
        <Pressable onPress={onPress}>
          <View style={styles.container}>
            <View style={styles.left}>
              <Text style={styles.text}>{currentName}</Text>
            </View>
            <ArrowDown size={28} color={theme.colors.text} />
          </View>
        </Pressable>
        <Animated.ScrollView style={[styles.options, animatedStyles]}>
          {options?.length > 0 &&
            options.map((opt, index) => (
              <Pressable
                key={opt.id_tipo_emergencia}
                onPress={() => {
                  changeOption(opt.id_tipo_emergencia);
                  height.value = 0;
                }}
                style={[
                  styles.option,
                  index === options.length - 1 ? styles.noBorder : null,
                  opt.id === current ? styles.currentOption : null,
                  index === options.length - 1 ? styles.last : null,
                  index === 0 ? styles.first : null,
                ]}>
                <Text style={styles.text}>{opt.descripcion}</Text>
              </Pressable>
            ))}
          {(isLoading || error) &&
            (localOptions?.length === 0 ? (
              <View style={styles.loadingContainer}>
                <Text styles={styles.loading}>Cargando</Text>
              </View>
            ) : (
              localOptions?.map((opt, index) => (
                <Pressable
                  key={opt.id_tipo_emergencia}
                  onPress={() => {
                    changeOption(opt.id_tipo_emergencia);
                    height.value = 0;
                  }}
                  style={[
                    styles.option,
                    index === localOptions.length - 1 ? styles.noBorder : null,
                    opt.id === current ? styles.currentOption : null,
                    index === localOptions.length - 1 ? styles.last : null,
                    index === 0 ? styles.first : null,
                  ]}>
                  <Text style={styles.text}>{opt.descripcion}</Text>
                </Pressable>
              ))
            ))}
        </Animated.ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  select: {
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.gray,
  },
  text: {
    color: theme.colors.text,
    marginLeft: 15,
    fontSize: normalize(16),
    lineHeight: normalize(16),
  },
  left: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  options: {
    position: 'absolute',
    top: '100%',
    left: 30,
    right: 30,
    zIndex: 9000,
    backgroundColor: '#FBFBFB',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  option: {
    borderBottomColor: theme.colors.text,
    borderBottomWidth: 1,
    padding: 10,
    paddingHorizontal: 20,
    color: theme.colors.text,
  },
  noBorder: {
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
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
});

export default Select;
