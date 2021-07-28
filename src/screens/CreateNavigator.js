import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CreateProvider } from '../context/createContext';
import TakePictureScreen from './TakePicture';
import CreateScreen from './Create';

const Stack = createStackNavigator();

const CreateNavigator = (props) => {
  return (
    <CreateProvider>
      <Stack.Navigator initialRouteName="Index" headerMode="none">
        <Stack.Screen name="Index" component={CreateScreen} />
        <Stack.Screen name="TakePicture" component={TakePictureScreen} />
      </Stack.Navigator>
    </CreateProvider>
  );
};
export default CreateNavigator;
