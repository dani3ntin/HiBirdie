import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Button } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { ActivityIndicator } from 'react-native'

function MapInputRegisterComponent(props) {
  const [selectedLocation, setSelectedLocation] = useState(undefined)

  const handleMapPress = (event) => {
    if(props.enablePressing === true){
      const { coordinate } = event.nativeEvent
      setSelectedLocation(coordinate)
      props.sendLocation(coordinate)
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={{
          latitude: 45,
          longitude: 11,
          latitudeDelta: 7,
          longitudeDelta: 7,
        }}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Selected Location"
          />
        )}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: 300,
  },
  locationInfo: {
    marginTop: 10,
  },
});

export default MapInputRegisterComponent
