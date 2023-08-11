import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { NavigationContainer } from '@react-navigation/native'
import EncyclopediaPage from './EncyclopediaPage'
import FollowedPage from './FollowedPage'
import LatestSightingsPage from './LatestSightingsPage'
import { React, useEffect, useState } from 'react'
import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Tab = createMaterialTopTabNavigator();

export default function Home() {
  const [username, setUsername] = useState(null)

  useEffect(() => {
    const fetchLocation = async () => {
      const coordinates = await getLocationCoordinates()
      console.log('Coordinate:', coordinates)
      await AsyncStorage.setItem('userCoordinates', JSON.stringify({latitude: coordinates.latitude, longitude: coordinates.longitude}))
    }
    settingUsername()
    fetchLocation()
  }, [])

  const getLocationCoordinates = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permesso di geolocalizzazione non concesso');
      return null;
    }
  
    const currentLocation = await Location.getCurrentPositionAsync({});
    return currentLocation.coords;
  }

  async function settingUsername(){
    const storedUserData = await AsyncStorage.getItem('userData')
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData)
      setUsername(parsedUserData.username)
    }
  }

  return (
    <>
      <NavigationContainer>
          <Tab.Navigator>
              <Tab.Screen name="My Encyclopedia">{() => <EncyclopediaPage username={username}/>}</Tab.Screen>
              <Tab.Screen name="Latest Sightings">{() => <LatestSightingsPage username={username}/>}</Tab.Screen>
              <Tab.Screen name="Followed">{() => <FollowedPage username={username}/>}</Tab.Screen>
          </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
