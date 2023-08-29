import React, { useState, useEffect } from 'react'
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useGlobalContext } from '../globalContext/GlobalContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'

const windowWidth = Dimensions.get('window').width

function IntroPage(props) {
  const [isLoadingItems, setIsLoadingItems] = useState(true)
  const navigation = useNavigation()
  const { globalVariable, setGlobalVariable } = useGlobalContext()
  const isFocused = useIsFocused()

  useEffect(() => {
      getUserData()
  }, [isFocused])

  async function getUserData(){
      const userData = await AsyncStorage.getItem('userData')
      const parsedUserData = JSON.parse(userData)
      if(parsedUserData && parsedUserData.username){
        const updatedUserData = await updateUserData(parsedUserData)
        console.log(updatedUserData)
        props.setUserData(updatedUserData)
        navigation.navigate('Home')
      }else{
        setIsLoadingItems(false)
      }
  }

  async function updateUserData(userdata){
    try {
      const response = await fetch(globalVariable.API_URL + 'getuserbyusername/' + userdata.username + '/' + userdata.username)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const jsonData = JSON.parse(response.headers.get('imageInfos'))
      console.log(jsonData)
      return jsonData
    } catch (error) {
      console.error('Followed page Error on getting the datas:', error)
      return userdata
    }
  }

  function getIntroPage(){
    if(isLoadingItems)
      return <ActivityIndicator size="large"  color="#0000ff"/>
    return(
      <>
        <TouchableOpacity
            style={[styles.button, styles.buttonMargin]}
            onPress={() => navigation.navigate('RegisterPage')}
        >
            <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.button, styles.buttonMargin]}
            onPress={() => navigation.navigate('LoginPage')}
        >
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </>
    )
  }

  return (
    <View style={styles.container}>
        <Text style={{ fontFamily: 'sans-serif-thin', fontSize: 70 }}>HiBirdie</Text>
        <Text style={{ fontFamily: 'sans-serif-thin', fontSize: 30, paddingBottom: 20 }}>Share your bird watching </Text>
      <Image
        source={require('../../assets/images/introImages/intro2.jpg')} 
        style={styles.image}
      />
      <View style={styles.buttonContainer}>
        {
          getIntroPage()
        }
      </View>
    </View>
  );
}

export default IntroPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c0daf8'
  },
  image: {
    marginBottom: 30,
    borderRadius: 200,
    width: 0.8 * windowWidth, 
    height: 0.8 * windowWidth,
  },
  buttonContainer: {
    
  },
  button: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#adb2fc',
    borderRadius: 10,
    width: 0.55 * windowWidth,
    marginTop: 10,
  },
  buttonMargin: {
    margin: 2,
    borderColor: 'blue',
    borderWidth: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  },
});
