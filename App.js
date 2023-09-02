import { StyleSheet, View, SafeAreaView, StatusBar, Button } from 'react-native'
import HomeHeaderBar from './components/headerBars/HomeHeaderBar'
import Home from './components/home/Home'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AddNewBird from './components/addNewBird-editBird/AddNewBird'
import EditBird from './components/addNewBird-editBird/EditBird'
import * as Location from 'expo-location'
import BirdDetailPageWithoutAuthor from './components/detailBird/BirdDetailPageWithoutAuthor'
import BirdDetailPageWithAuthor from './components/detailBird/BirdDetailPageWithAuthor'
import UserDetailPage from './components/userDetail/UserDetailPage'
import UserSettings from './components/userSettings/UserSettings'
import { GlobalProvider } from './components/globalContext/GlobalContext'
import IntroPage from './components/introPage/IntroPage'
import LoginPage from './components/introPage/LoginPage'
import RegisterPage from './components/introPage/RegisterPage'
//import * as Sentry from '@sentry/react-native'
import ShowFollowersPage from './components/userDetail/ShowFollowersPage'
import ShowLikesPage from './components/userDetail/ShowLikesPage'

const Stack = createStackNavigator()

export default function App() {

  const [userData, setUserData] = useState(null)
  const [username, setUsername] = useState(null)
  const [coordinates, setCoordinates] = useState(null)

  const fetchLocation = async () => {
    const coordinates = await getLocationCoordinates()
    setCoordinates(coordinates)
    await AsyncStorage.setItem('userCoordinates', JSON.stringify({latitude: coordinates.latitude, longitude: coordinates.longitude, defaultPosition: coordinates.defaultPosition}))
  }

  async function getLocationFromLogin(location){
    setCoordinates(location)
    await AsyncStorage.setItem('userCoordinates', JSON.stringify({latitude: location.latitude, longitude: location.longitude, defaultPosition: location.defaultPosition}))
  }

  useEffect(() => {
    settingUsername()
    fetchLocation()
  }, [userData]);

/*
Sentry.init({ 
  dsn: 'https://4e797a3d4a7c93316b5ed9a767f1ef17@o4505745355702272.ingest.sentry.io/4505745357012992', 
});
*/


const getLocationCoordinates = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync()
  if (status !== 'granted') {
    const storedLocation = getStoredLocationIfPresent()
    if(storedLocation) return storedLocation
    return {latitude: 0, longitude: 0, defaultPosition: true}
  }
  try {
    const currentLocation = await Location.getCurrentPositionAsync({})
    return currentLocation.coords
  } catch (error) {
    const storedLocation = getStoredLocationIfPresent()
    if(storedLocation) return storedLocation
    return {latitude: 0, longitude: 0, defaultPosition: true}
  }
}

async function getStoredLocationIfPresent(){
  const storedUserData = await AsyncStorage.getItem('userData')
  if(storedUserData){
    const parsedUserData = JSON.parse(storedUserData)
    return {latitude: parsedUserData.xPosition, longitude: parsedUserData.yPosition, defaultPosition: true}
  }
  else return null
}

async function settingUsername(){
  if(userData){
    setUsername(userData.username)
  }else{
    const storedUserData = await AsyncStorage.getItem('userData')
    console.log('storedUserData')
    console.log(JSON.parse(storedUserData))
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData)
      setUsername(parsedUserData.username)
    }
  }
}

  return (
    <SafeAreaView style={styles.SafeArea}>
      <GlobalProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="IntroPage">
              <Stack.Screen name="IntroPage" options={{ headerShown: false }}>{() => <IntroPage setUserData={setUserData}/>}</Stack.Screen>
              <Stack.Screen name="LoginPage" options={{ headerShown: false }}>{() => <LoginPage setUserData={setUserData} sendLocation={getLocationFromLogin}/>}</Stack.Screen>
              <Stack.Screen name="RegisterPage" options={{ headerShown: false }}>{() => <RegisterPage setUserData={setUserData}/>}</Stack.Screen>
              <Stack.Screen name="Home" options={{ headerShown: false }}>{() => <Home userData={userData} username={userData.username}/>}</Stack.Screen>
              <Stack.Screen name="AddBird" options={{ headerShown: false }}>{() => <AddNewBird loggedUsername={username} coordinates={coordinates}/>}</Stack.Screen>
              <Stack.Screen name="EditBird" options={{ headerShown: false }} component={EditBird} />
              <Stack.Screen name="BirdDetailPageWithoutAuthor" options={{ headerShown: false }} component={BirdDetailPageWithoutAuthor} />
              <Stack.Screen name="BirdDetailPageWithAuthor" options={{ headerShown: false }} component={BirdDetailPageWithAuthor} />
              <Stack.Screen name="UserDetailPage" options={{ headerShown: false }} component={UserDetailPage} />
              <Stack.Screen name="ShowFollowersPage" options={{ headerShown: false }} component={ShowFollowersPage} />
              <Stack.Screen name="ShowLikesPage" options={{ headerShown: false }} component={ShowLikesPage} />
              <Stack.Screen name="UserSettings" options={{ headerShown: false }}>{() => <UserSettings userData={userData} setUserData={setUserData}/>}</Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </GlobalProvider>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  SafeArea: {
    flex: 1,
  },
});
