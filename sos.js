import React, { useEffect } from 'react';
import { View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CreateNavigator from './src/screens/CreateNavigator';
import { QueryClient, QueryClientProvider } from 'react-query';
import RNBootSplash from 'react-native-bootsplash';
import { CityProvider } from './src/context/cityContext';
import HomeScreen from './src/screens/Home';
import ListScreen from './src/screens/List';
import EmergencyDetailScreen from './src/screens/EmergencyDetail';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 3600,
      retry: true,
    },
  },
});
const Stack = createStackNavigator();

const App = () => {
  const insets = useSafeAreaInsets();
  useEffect(() => {
    RNBootSplash.hide();
  }, []);

  return (
    <View
      style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <QueryClientProvider client={queryClient}>
        <CityProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" headerMode="none">
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="List" component={ListScreen} />
              <Stack.Screen name="Detail" component={EmergencyDetailScreen} />
              <Stack.Screen name="Create" component={CreateNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </CityProvider>
      </QueryClientProvider>
    </View>
  );
};

const AppContainer = () => (
  <SafeAreaProvider>
    <App />
  </SafeAreaProvider>
);

export default AppContainer;
