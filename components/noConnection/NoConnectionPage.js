import React, { useState, useEffect } from 'react'
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-async-storage/async-storage'

const windowWidth = Dimensions.get('window').width

function NoConnectionPage(props) {
    const navigation = useNavigation()
    const [isTryingToConnect, setIsTryingToConnect] = useState(false)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
          setIsConnected(state.isConnected); // Aggiorna lo stato isConnected quando cambia la connessione
        });
    
        return () => {
          unsubscribe();
        };
    }, []);

    function checkConnection(){
        setIsTryingToConnect(true)
        if(isConnected){
            navigation.navigate('IntroPage')
        }else{
            setIsTryingToConnect(false)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={[platformFont, {fontSize: 50 }]}>No connection!</Text>
            <Text style={[platformFont, { fontSize: 23, paddingBottom: 20, paddingTop: 20 }]}>You are not connected to the internet</Text>
            <Text style={[platformFont, { fontSize: 23, paddingBottom: 20 }]}>Please connect and try again</Text>
        <Image
            source={require('../../assets/images/noConnection/noConnection.jpg')} 
            style={styles.image}
        />
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={[styles.button, styles.buttonMargin]}
                onPress={() => checkConnection()}
            >
            {
                isTryingToConnect ? 
                <ActivityIndicator size="large"  color="#0000ff"/>
                :
                <Text style={styles.buttonText}>Try to connect</Text>
            }
            </TouchableOpacity>
        </View>
        </View>
    );
}

export default NoConnectionPage

//sans-serif-thin
//AvenirNext-UltraLight

const platformFont = Platform.select({
  ios: {
    fontFamily: 'AvenirNext-UltraLight'
  },
  android: {
    fontFamily: 'sans-serif-thin'
  },
  default: {},
})

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
    width: 0.6 * windowWidth, 
    height: 0.6 * windowWidth,
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
