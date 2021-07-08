import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const Map = ({ coords }) => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={{
          longitude: coords[0],
          latitude: coords[1],
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        {coords && (
          <Marker coordinate={{ longitude: coords[0], latitude: coords[1] }} />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 30,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
  },
});
export default Map;
