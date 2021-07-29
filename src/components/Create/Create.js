import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Pressable,
  PushNotificationIOS,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useQuery } from 'react-query';
import Geolocation from 'react-native-geolocation-service';
import { theme } from '../../theme';
import Select from './Select';
import CreateContext from '../../context/createContext';
import { BASE, EMERGENCIES, EMERGENCIES_TYPES } from '../../endpoints';
import Modal from '../../components/common/Modal';
import Camera from '../../components/Icons/Camera';
import Error from '../../components/Icons/Error';
import { useNavigation } from '@react-navigation/native';
import Images from './Images';
import Map from './Map';
import { hasGeolocationPermissions } from '../../permissions';
import { normalize } from '../../utils/fonts';
import Spinner from '../common/Spinner';

import {
  clearAll,
  createBackup,
  getEmergencyTypes,
  setEmergencyTypes,
} from '../../utils/backup';
import CityContext from '../../context/cityContext';

const STATES = {
  CREATING: 'creating',
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESSFUL: 'successful',
  INCOMPLETE: 'incomplete',
};

const Create = (props) => {
  const { city, cityId, email } = useContext(CityContext);

  const navigation = useNavigation();
  const [user] = useState('');
  const {
    description,
    changeDescription,
    type,
    changeType,
    photos,
    coords,
    changeCoords,
    video,
    resetAll,
  } = useContext(CreateContext);
  const {
    isLoading: isLoadingTypes,
    data: typesOptions,
    error: errorTypes,
  } = useQuery('typesOfEmergencies', () =>
    fetch(`${BASE}${EMERGENCIES_TYPES}`).then((res) => res.json()),
  );

  const [state, setState] = useState(STATES.CREATING);

  useEffect(() => {
    if (typesOptions) {
      setEmergencyTypes(typesOptions);
    }
  }, [typesOptions]);

  useEffect(() => {
    async function getPosition() {
      const { allowed } = await hasGeolocationPermissions();
      if (allowed) {
        Geolocation.getCurrentPosition(
          (position) => {
            changeCoords([position.coords.longitude, position.coords.latitude]);
          },
          (error) => {
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      }
    }
    getPosition();
  }, []);

  const openCamera = useCallback(() => {
    navigation.navigate('TakePicture');
  });

   const createEmergency =  ()  =>  {
    if (type && description && photos.length > 0) {
      const data = new FormData();
      photos.forEach((item, i) => {
        data.append('photos[]', {
          uri: item.node.image.uri,
          type: item.node.type,
          name: `filename${i}.jpg`,
        });
      });

/*      photos.forEach( async (item, i) => {
        console.log(item.node.image.uri)
       // const base64 = await RNFS.readFile(item.node.image.uri,'base64')//await  FileSystem.readAsStringAsync(photos.uri,{encoding:base64});
       const base64='hola';
       console.log(base64)
        data.append('photos', {
          uri: base64,
          type: item.node.type,
          name: `filename${i}.jpg`,
        });
      });*/
      if (video) {
        data.append('video', {
          uri: video.node.image.uri,
          type: video.node.type,
          name: `video.${video.node.type.split('/')[1]}`,
        });
      }
      data.append('emergency_type', type);
      data.append('geolocation', `${coords[1]},${coords[0]}`);
      data.append('description', description);
      data.append('cityId', cityId);
      data.append('email', email);
      data.append('mobile_report', true);
      setState(STATES.LOADING);
      createBackup({
        emergency_type: type,
        description,
        cityId,
        email,
        coords,
        photos,
        video,
      });

      fetch(`${BASE}${EMERGENCIES}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: data,
      })
        .then((res) => {
          console.log(res);
          if (res.ok) {
            clearAll();
            setState(STATES.SUCCESSFUL);
          } else {
            setState(STATES.ERROR);
          }
        })
        .catch((error) => {
          setState(STATES.ERROR);
          console.error('Error', error);
        });
    } else {
      setState(STATES.INCOMPLETE);
    }
  };

  const accept = () => {
    setState(STATES.CREATING);
  };


  const successful = () => {
    setState(STATES.CREATING);
    resetAll();
    navigation.navigate('Login');
  };
  const renderModal = () => {
    switch (state) {
      case STATES.ERROR:
        return (
          <>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Ha ocurrido un error, por favor revise su conexión a internet y
                vuelva a intentarlo
              </Text>
              <Error size={40} color={theme.colors.text} />
              <Pressable onPress={accept}>
                <Text style={styles.accept}>Continuar</Text>
              </Pressable>
            </View>
          </>
        );

      case STATES.INCOMPLETE:
        return (
          <>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Por favor complete los siguientes campos:
              </Text>
              {!type && <Text>Tipo de emergencia</Text>}
              {!description && <Text>Descripcion</Text>}
              {photos.length === 0 && <Text>Fotos (Al menos una foto)</Text>}
              <Pressable onPress={accept}>
                <Text style={styles.accept}>Continuar</Text>
              </Pressable>
            </View>
          </>
        );
      case STATES.SUCCESSFUL:
        return (
          <>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Emergencia reportada con éxito
              </Text>
              <Pressable onPress={successful}>
                <Text style={styles.accept}>Continuar</Text>
              </Pressable>
            </View>
          </>
        );
      case STATES.LOADING:
        return <Spinner light />;
    }
  };

  return (

    <View style={{ flex: 1 }}>
      <View style={styles.email}>
           <Text style={styles.textemail}>{email}</Text>
      </View>
      <ScrollView style={styles.container}>
        <Select
          placeholder="Tipo de emergencia"
          options={typesOptions}
          current={type}
          changeOption={changeType}
          isLoading={isLoadingTypes}
          error={errorTypes}
          backupOptions={getEmergencyTypes}
          zIndex={9999}
        />
        <TextInput
          style={[styles.inputBase, styles.textInput]}
          placeholder="Descripción"
          placeholderTextColor={theme.colors.text}
          multiline={true}
          numberOfLines={6}
          value={description}
          onChangeText={changeDescription}
        />
        <View style={styles.inputBase}>
          <Text style={styles.label}>Localización</Text>
        </View>
        <View style={styles.mapContainer}>
          <Map coords={coords} changeCoords={changeCoords} />
        </View>
        <Pressable onPress={openCamera}>
          <View style={[styles.inputBase, styles.camera]}>
            <Text style={styles.label}>Adjuntar foto</Text>
            <Camera color={theme.colors.text} />
          </View>
        </Pressable>
        <Images />
      </ScrollView>
      <View style={styles.sendContainer}>
        <Pressable onPress={createEmergency}>
          <Text style={styles.send}>Enviar</Text>
        </Pressable>
      </View>
      <Modal
        visible={state !== STATES.CREATING}
        noCard={state === STATES.LOADING}>
        {renderModal()}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 25,
  },
  inputBase: {
    backgroundColor: theme.colors.gray,
    color: theme.colors.text,
    borderRadius: 30,
    padding: 12,
    marginHorizontal: 30,
    textAlignVertical: 'top',
    paddingHorizontal: 30,
    marginBottom: 20,
    fontSize: normalize(16),
    lineHeight: normalize(16),
  },
  camera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: normalize(16),
    lineHeight: normalize(16),
    color: theme.colors.text,
  },
  mapContainer: {
    paddingHorizontal: 30,
    marginBottom: 20,
    borderRadius: 30,
    overflow: 'hidden',
  },
  sendContainer: {
    paddingTop: 15,
    paddingBottom: 5,
    alignItems: 'center',
  },
  send: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    color: 'white',
    backgroundColor: theme.colors.green,
    fontSize: normalize(18),
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    textAlign: 'center',
    fontSize: normalize(17),
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 10,
  },
  accept: {
    borderRadius: 15,
    backgroundColor: theme.colors.blue,
    padding: 10,
    color: 'white',
    paddingHorizontal: 17,
    marginTop: 20,
    fontWeight: 'bold',
  },
  textInput: {
    height: 100,
  },
  email: {
    backgroundColor: theme.colors.orange,
    paddingHorizontal: 7,
    paddingBottom: 5,
    paddingTop: 0,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textemail: {
    color: 'white',
    fontWeight: '800',
    fontSize: normalize(12),
  },
});
export default Create;
