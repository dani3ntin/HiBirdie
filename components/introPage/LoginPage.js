import { React, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, StyleSheet, StatusBar, TextInput, TouchableOpacity, Text, ActivityIndicator, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { Platform, Dimensions, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import LoginHeaderBar from '../headerBars/LoginHeaderBar'
import BackIcon from 'react-native-vector-icons/AntDesign'
import { useGlobalContext } from '../globalContext/GlobalContext'

const windowWidth = Dimensions.get('window').width
  
export default function LoginPage(props) {
  const navigation = useNavigation()

  useEffect(() => {
    
}, [])
const { globalVariable, setGlobalVariable } = useGlobalContext()
const [input, setInput] = useState('')
const [password, setPassowrd] = useState('')
const [showPassword, setShowPassword] = useState(false)
const [error, setError] = useState(null)
const [checkingPassword, setCheckingPassword] = useState(false)


const toggleShowPassword = () => {
    setShowPassword(!showPassword);
}

const CustomIcon = ({ name, size, color }) => {
    const IconComponent = BackIcon;
    return <IconComponent name={name} size={size} color={color} />;
}

async function tryLogin(){
    if(input === ''){
        setError('Insert username or email')
        return
    }
    if(password === ''){
        setError('Insert password')
        return
    }
    setCheckingPassword(true)
    try {
        const response = await fetch( globalVariable.API_URL + 'login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: input, password: password }),
        })

        const responseData = await response.json()
        if(responseData && responseData.username){
            props.setUserData(responseData)
            const userCoordinates = {latitude: responseData.xPosition, longitude: responseData.yPosition, defaultPosition: true}
            props.sendLocation(userCoordinates)
            await AsyncStorage.setItem('userData', JSON.stringify(responseData))
            await AsyncStorage.setItem('userCoordinates', JSON.stringify(userCoordinates))
            navigation.navigate('Home')
        }
        else{
            setError('Wrong username or password')
        }
    } catch (error) {
        console.error('Errore durante la richiesta API:', error)
    }
    setCheckingPassword(false)
}

  return (
    <>
        <View style={styles.headerContainer}>
            <LoginHeaderBar onBackButtonPress={() => navigation.goBack()}/>
        </View>
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.welcomeText}>Welcome back!</Text>
                <Image
                    source={require('../../assets/images/introImages/intro1.jpg')} 
                    style={styles.image}
                />
                <Text style={styles.text}>Please insert your credentials to login</Text>
                <View style={styles.ItemsContainer}>
                    <TextInput
                        placeholder='Insert your username or email'
                        label='input'
                        value={input}
                        onChangeText={text => setInput(text)}
                        maxLength={50}
                        style={[styles.textInput]}
                    />
                    <View style={styles.passwordContainer}>
                        <TextInput
                            placeholder='Insert password'
                            label='password'
                            value={password}
                            onChangeText={text => setPassowrd(text)}
                            maxLength={50}
                            secureTextEntry={!showPassword}
                            style={[styles.passwordText]}
                        />
                        <TouchableOpacity style={styles.iconContainer} onPress={toggleShowPassword}>
                            <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    {
                        //<Text style={styles.linkText} onPress={() => console.log('s')}>Do you forget your password?</Text>
                    }
                    <TouchableOpacity
                        style={[styles.button, styles.buttonMargin]}
                        onPress={tryLogin}
                    >
                        {
                            checkingPassword ? 
                            <ActivityIndicator size="large"  color="#0000ff"/>
                            :
                            <Text style={styles.buttonText}>Login</Text>
                        }
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
        <StatusBar style="auto" />
    </>
  );
}

const shadowStyle = Platform.select({
    ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    android: {
        elevation: 5,
    },
    default: {},
})

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
    },
    backButton: {
        width: 70,
        height: 70,
    },
    backIcon: {
        paddingLeft: 10,
    },
    pressedBackButton: {
        opacity: 0.3,
    },
    linkText: {
        paddingLeft: 10,
        fontSize: 18,
        color: 'blue', // Colore tipico dei link
        textDecorationLine: 'underline', // Sottolineatura del testo
    },
    image: {
        marginBottom: 30,
        borderRadius: 200,
        width: 0.45 * windowWidth, 
        height: 0.45 * windowWidth,
        alignSelf: 'center',
    },
    passwordText: {
        fontSize: 18,
        flex: 1,
    },
    welcomeText:{
        fontSize: 50, 
        paddingBottom: 20,
        fontFamily: 'sans-serif-thin',
        paddingTop: 20,
        alignSelf: 'center'
    },
    text:{
        fontSize: 18,
        paddingTop: 2,
        alignSelf: 'center',
    },
    passwordContainer: {
        flexDirection: 'row',
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        margin: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#c0daf8'
      },
    headerContainer: {
        height: '8%'
    },
    ItemsContainer: {
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 13,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20,
        ...shadowStyle
    },
    textInput: {
        width: windowWidth* 0.7,
        fontSize: 18,
        margin: 10,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderWidth: 2,
    },
    button: {
        marginHorizontal: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#adb2fc',
        borderRadius: 10,
        width: 0.7 * windowWidth,
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
    iconContainer: {
        padding: 5,
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        textAlign: 'center',
        fontSize: 18,
    },
});
