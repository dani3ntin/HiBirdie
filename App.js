import { StyleSheet, View, SafeAreaView, StatusBar, Button } from 'react-native'
import HomeHeaderBar from './components/headerBars/HomeHeaderBar'
import Home from './components/home/Home'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    //AsyncStorage.clear()
    fetchData()
  }, []);

  const fetchData = async () => {
    const storedUserData = await AsyncStorage.getItem('userData')
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData)
      setUserData(parsedUserData)
    } else {
      //here the user will have to go to the login page
      try {
        const response = await fetch('http://192.168.1.249:8000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ input: 'a', password: 'password' }), // Dati da inviare nel corpo della richiesta
        })
  
        const responseData = await response.json()
        await AsyncStorage.setItem('userData', JSON.stringify(responseData))
      } catch (error) {
        console.error('Errore durante la richiesta API:', error)
      }
    }
  };

  return (
    <SafeAreaView style={styles.SafeArea}>
      <View style={styles.headerContainer}>
        <HomeHeaderBar userName={userData ? userData.name : ''} userAvatar={{ uri: 'http://192.168.1.249:8000/api/getuserbyusername/' + (userData ? userData.username : '') }} />
      </View>
      <Home/>
      <StatusBar style="auto" />
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
