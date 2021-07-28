import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const Map = ({ coords, changeCoords }) => {
  useEffect(() => {}, []);

  const hitSlop = 15;
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
        <Marker
          coordinate={{ longitude: coords[0], latitude: coords[1] }}
          draggable
          hitSlop={{
            bottom: hitSlop,
            top: hitSlop,
            left: hitSlop,
            right: hitSlop,
          }}
          onDragEnd={(e) => {
            changeCoords([
              e.nativeEvent.coordinate.longitude,
              e.nativeEvent.coordinate.latitude,
            ]);
          }}
        />
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
