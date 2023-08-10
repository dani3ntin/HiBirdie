import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import EncyclopediaPage from './EncyclopediaPage';
import FollowedPage from './FollowedPage';
import LatestSightingsPage from './LatestSightingsPage'
import { useEffect } from 'react'
import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createMaterialTopTabNavigator();

export default function Home() {
  useEffect(() => {
    const fetchLocation = async () => {
      const coordinates = await getLocationCoordinates()
      console.log('Coordinate:', coordinates)
      await AsyncStorage.setItem('userCoordinates', JSON.stringify({latitude: coordinates.latitude, longitude: coordinates.longitude}))
    };

    fetchLocation();
  }, []);

  const getLocationCoordinates = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permesso di geolocalizzazione non concesso');
      return null;
    }
  
    const currentLocation = await Location.getCurrentPositionAsync({});
    return currentLocation.coords;
  };

  return (
    <>
      <NavigationContainer>
          <Tab.Navigator>
              <Tab.Screen name="My Encyclopedia" component={EncyclopediaPage}/>
              <Tab.Screen name="Latest Sightings" component={LatestSightingsPage}/>
              <Tab.Screen name="Followed" component={FollowedPage}/>
          </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
