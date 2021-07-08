import AsyncStorage from '@react-native-async-storage/async-storage';

export const createBackup = ({
  emergency_type,
  entity,
  description,
  cityId,
  email,
  photos,
  coords,
  video,
}) => {
  AsyncStorage.multiSet([
    ['emergency_type', emergency_type + ''],
    ['entity', entity + ''],
    ['description', description],
    ['cityId', cityId.toString()],
    ['email', email],
    ['photos', JSON.stringify(photos)],
    ['coords', coords.toString()],
    ['video', JSON.stringify(video)],
  ]);
};

export const getBackup = async () => {
  const data = await AsyncStorage.multiGet([
    'emergency_type',
    'entity',
    'description',
    'photos',
    'coords',
    'video',
  ]);
  return {
    type: data[0][1],
    entity: data[1][1],
    description: data[2][1],
    photos: JSON.parse(data[3][1]),
    coords: data[4][1]?.split(','),
    video: JSON.parse(data[5][1]),
  };
};

export const clearAll = () => {
  AsyncStorage.multiRemove([
    'emergency_type',
    'entity',
    'description',
    'cityId',
    'email',
    'photos',
    'coords',
    'video',
  ]);
};

export const getEmergencyTypes = async () => {
  return JSON.parse(await AsyncStorage.getItem('@sinergia:types'));
};

export const getEntities = async () => {
  return JSON.parse(await AsyncStorage.getItem('@sinergia:entities'));
};

export const setEmergencyTypes = async (data) => {
  AsyncStorage.setItem('@sinergia:types', JSON.stringify(data));
};

export const setEntities = async (data) => {
  AsyncStorage.setItem('@sinergia:entities', JSON.stringify(data));
};
