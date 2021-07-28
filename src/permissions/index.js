import { PermissionsAndroid, Platform, Linking, Android } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import appConfig from '../../app.json';
import CameraRoll from '@react-native-community/cameraroll';

export const hasGeolocationPermissions = async () => {
  if (Platform.OS === 'ios') {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('No es posible abrir Configuración');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return { allowed: true };
    }

    if (status === 'denied') {
      Alert.alert('Permiso de localización denegado');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Activa la localización para permitir ${appConfig.displayName} para determinar to localización.`,
        '',
        [
          { text: 'Ir a configuración', onPress: openSetting },
          { text: 'No usar localización', onPress: () => {} },
        ],
      );
    }
    return { allowed: false };
  } else {
    let hasFineLocationPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    let hasCoarseLocationPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    );
    if (!hasFineLocationPermission || !hasCoarseLocationPermission) {
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
      hasCoarseLocationPermission =
        results['android.permission.ACCESS_COARSE_LOCATION'] === 'granted';
      hasFineLocationPermission =
        results['android.permission.ACCESS_FINE_LOCATION'] === 'granted';
    }
    return {
      allowed: hasCoarseLocationPermission && hasFineLocationPermission,
    };
  }
};

export const hasStoragePermissions = async () => {
  if (Platform.OS === 'android') {
    let hasReadPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    let hasWritePermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (!hasReadPermission || !hasWritePermission) {
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      hasReadPermission =
        results['android.permission.READ_EXTERNAL_STORAGE'] === 'granted';
      hasWritePermission =
        results['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted';
    }
    return {
      allowed: hasReadPermission && hasWritePermission,
    };
  } else {
    try {
      const res = await CameraRoll.getPhotos({ first: 1, assetType: 'Photos' });
      if (res) {
        return { allowed: true };
      }
    } catch (error) {
      Alert.alert('Permiso de acceso al almacenamiento denegado');
      console.log(error);
    }
    return { allowed: false };
  }
};

export const hasCameraPermissions = async () => {
  if (Platform.OS === 'android') {
    let hasCameraPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (!hasCameraPermission) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      hasCameraPermission = result === 'granted';
    }
    return {
      allowed: hasCameraPermission,
    };
  } else {
    try {
      const res = await CameraRoll.getPhotos({ first: 1, assetType: 'Photos' });
      if (res) {
        return { allowed: true };
      }
    } catch (error) {
      console.log(error);
    }
    return { allowed: false };
  }
};
