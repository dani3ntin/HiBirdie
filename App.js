import { StyleSheet, View, SafeAreaView, StatusBar, Button } from 'react-native'
import HomeHeaderBar from './components/headerBars/HomeHeaderBar'
import Home from './components/home/Home'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL } from './env'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AddNewBird from './components/addNewBird-editBird/AddNewBird'
import EditBird from './components/addNewBird-editBird/EditBird'
import * as Location from 'expo-location'
import BirdDetailPageWithoutAuthor from './components/detailBird/BirdDetailPageWithoutAuthor'
import BirdDetailPageWithAuthor from './components/detailBird/BirdDetailPageWithAuthor'
import UserDetailPage from './components/userDetail/UserDetailPage'

const Stack = createStackNavigator();

export default function App() {

  const [userData, setUserData] = useState(null)
  const [username, setUsername] = useState(null)
  const [coordinates, setCoordinates] = useState(null)

  useEffect(() => {
    //AsyncStorage.clear()
    fetchData()
    settingUsername()
    const fetchLocation = async () => {
      const coordinates = await getLocationCoordinates()
      setCoordinates(coordinates)
      console.log('Coordinate:', coordinates)
      await AsyncStorage.setItem('userCoordinates', JSON.stringify({latitude: coordinates.latitude, longitude: coordinates.longitude}))
    }
    fetchLocation()
  }, []);

  const getLocationCoordinates = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permesso di geolocalizzazione non concesso');
      return null;
    }
  
    const currentLocation = await Location.getCurrentPositionAsync({});
    return currentLocation.coords;
  }

  const fetchData = async () => {
    const storedUserData = await AsyncStorage.getItem('userData')
    console.log(storedUserData)
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData)
      setUserData(parsedUserData)
    } else {
      //here the user will have to go to the login page
      try {
        const response = await fetch( API_URL + 'login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ input: 'apaolo', password: 'password' }), // Dati da inviare nel corpo della richiesta
        })
  
        const responseData = await response.json()
        await AsyncStorage.setItem('userData', JSON.stringify(responseData))
      } catch (error) {
        console.error('Errore durante la richiesta API:', error)
      }
    }
  };

  async function settingUsername(){
    const storedUserData = await AsyncStorage.getItem('userData')
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData)
      setUsername(parsedUserData.username)
    }
  }

  return (
    <SafeAreaView style={styles.SafeArea}>
      <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" options={{ headerShown: false }}>{() => <Home userData={userData} username={username}/>}</Stack.Screen>
            <Stack.Screen name="AddBird" options={{ headerShown: false }}>{() => <AddNewBird loggedUsername={username} coordinates={coordinates}/>}</Stack.Screen>
            <Stack.Screen name="EditBird" options={{ headerShown: false }} component={EditBird} />
            <Stack.Screen name="BirdDetailPageWithoutAuthor" options={{ headerShown: false }} component={BirdDetailPageWithoutAuthor} />
            <Stack.Screen name="BirdDetailPageWithAuthor" options={{ headerShown: false }} component={BirdDetailPageWithAuthor} />
            <Stack.Screen name="UserDetailPage" options={{ headerShown: false }} component={UserDetailPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  SafeArea: {
    flex: 1,
  },
  headerContainer: {
    height: '8%'
  }
});
