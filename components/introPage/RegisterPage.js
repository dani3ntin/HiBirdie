import { NavigationContainer } from '@react-navigation/native'
import { React, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, StyleSheet, StatusBar, TextInput, TouchableOpacity, Text, ActivityIndicator, ScrollView, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { Platform, Dimensions, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import GeneralPurposeHeaderBar from '../headerBars/GeneralPurposeHeaderBar'
import { useGlobalContext } from '../globalContext/GlobalContext'
import MapInputRegisterComponent from './MapInputRegisterComponent'

const windowWidth = Dimensions.get('window').width
  
export default function RegisterPage(props) {
  const navigation = useNavigation()

  useEffect(() => {
    
}, [])

const [name, setName] = useState('')
const [username, setUsername] = useState('')
const [email, setEmail] = useState('')
const [password, setPassowrd] = useState('')
const [confirmPassword, setConfirmPassowrd] = useState('')
const [latitude, setLatitude] = useState(null)
const [longitude, setLongitude] = useState(null)
const [chooseLocation, setChooseLocation] = useState(false)
const [showPassword, setShowPassword] = useState(false)
const [error, setError] = useState(null)
const [checkingPassword, setCheckingPassword] = useState(false)
const [isSaving, setIsSaving] = useState(false)
const [isUsernameAlreadyUsed, setIsUsernameAlreadyUsed] = useState(false)
const { globalVariable, setGlobalVariable } = useGlobalContext()


const toggleShowPassword = () => {
    setShowPassword(!showPassword);
}

function sendLocation(coordinate){
    setLatitude(coordinate.latitude)
    setLongitude(coordinate.longitude)
    setChooseLocation(true)
}

function showAlert(title, message){
    Alert.alert(
        title,
        message,
        [
          { text: 'OK'}
        ],
        { cancelable: true }
    )
}

function controlInputData(){
    console.log(longitude)
    if(username.length === 0) showAlert('Missing data', 'Please enter your username')
    else if(name.length === 0) showAlert('Missing data', 'Please enter your name')
    else if(email.length === 0) showAlert('Missing data', 'Please enter your email')
    else if(password.length === 0) showAlert('Missing data', 'Please enter your password')
    else if(confirmPassword.length === 0) showAlert('Missing data', 'Please enter your confirm password')
    else if(confirmPassword !== password) showAlert('Password or confirm password wrong', 'Password and confirm password are different, please enter the same password')
    else if(!chooseLocation) showAlert('Missing data', 'Please enter your default location in the map')
    else{ 
        register()
        return true
    }
    return false
}

async function register(){
    setIsSaving(true)
    let formData = new FormData()

    formData.append('username', username)
    formData.append('name', name)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('xPosition', latitude)
    formData.append('yPosition', longitude)
    
    try {
        const response = await fetch(globalVariable.API_URL + 'register', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })

        const jsonUserData = await response.json()
        if(response.ok){
            console.log(jsonUserData)
            props.setUserData(jsonUserData)
            await AsyncStorage.setItem('userCoordinates', JSON.stringify({latitude: jsonUserData.xPosition, longitude: jsonUserData.yPosition, defaultPosition: true}))
            await AsyncStorage.setItem('userData', JSON.stringify(jsonUserData))
            navigation.navigate('Home')
        }
    } catch (error) {
        console.error(error);
    }
    setIsSaving(false)
}

async function checkUsername(username){
    if(username === '')
        return
    const response = await fetch(globalVariable.API_URL + 'isusernamealreadyused/' + username)
    const jsonData = await response.json()
    if(jsonData.response === 1){
        setIsUsernameAlreadyUsed(true)
    }else{
        setIsUsernameAlreadyUsed(false)
    }
}

function getTextCheckIfUsernameIsUsed(){
    if(username === '') return null
    if(isUsernameAlreadyUsed) return <Text style={styles.textNotOk}>This username is not available</Text>
    if(!isUsernameAlreadyUsed) return <Text style={styles.textOk}>Username available</Text>
}
  return (
    <>
        <View style={styles.headerContainer}>
        <GeneralPurposeHeaderBar text={'Register'} onBackButtonPress={() => navigation.goBack()}/>
        </View>
        <View style={styles.container}>
            <ScrollView>
                <Text style={[platformFont, styles.welcomeText]}>Oh, a new face!</Text>
                <Text style={styles.text}>Please insert your data to register</Text>
                <View style={styles.ItemsContainer}>
                    {
                        getTextCheckIfUsernameIsUsed()
                    }
                    <TextInput
                        placeholder='Insert your username'
                        label='input'
                        value={username}
                        onChangeText={text => {
                            setUsername(text);
                            checkUsername(text)
                        }}
                        maxLength={50}
                        style={[styles.textInput]}
                    />
                    <TextInput
                        placeholder='Insert your name'
                        label='input'
                        value={name}
                        onChangeText={text => setName(text)}
                        maxLength={50}
                        style={[styles.textInput]}
                    />
                    <TextInput
                        placeholder='Insert your email'
                        label='input'
                        value={email}
                        onChangeText={text => setEmail(text)}
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
                    <View style={styles.passwordContainer}>
                        <TextInput
                            placeholder='Insert confirm password'
                            label='Confirm password'
                            value={confirmPassword}
                            onChangeText={text => setConfirmPassowrd(text)}
                            maxLength={50}
                            secureTextEntry={!showPassword}
                            style={[styles.passwordText]}
                        />
                        <TouchableOpacity style={styles.iconContainer} onPress={toggleShowPassword}>
                            <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.mapContainer}>
                    <Text style={styles.text}>Please select your default position. It will be used when your real position will not be available</Text>
                    <MapInputRegisterComponent latUser={latitude} lonUser={longitude} sendLocation={sendLocation} enablePressing={true}/>
                </View>
                <View style={styles.mapContainer}>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    <TouchableOpacity
                        style={[styles.button, styles.buttonMargin]}
                        onPress={controlInputData}
                    >
                        {
                            isSaving ? 
                            <ActivityIndicator size="large"  color="#0000ff"/>
                            :
                            <Text style={styles.buttonText}>Register</Text>
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
        color: 'blue',
        textDecorationLine: 'underline',
    },
    image: {
        marginBottom: 30,
        borderRadius: 200,
        width: 0.45 * windowWidth, 
        height: 0.45 * windowWidth,
        alignSelf: 'center'
    },
    passwordText: {
        fontSize: 18,
        flex: 1,
    },
    welcomeText:{
        paddingTop: 20,
        fontSize: 50, 
        paddingBottom: 20,
        alignSelf: 'center'
    },
    text:{
        fontSize: 18,
        paddingTop: 2,
        alignSelf: 'center',
    },
    textOk:{
        fontSize: 18,
        color: '#43922f',
        alignSelf: 'center',
    },
    textNotOk:{
        fontSize: 18,
        color: '#8a1a1a',
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
        backgroundColor: '#c0daf8',
    },
    headerContainer: {
        height: '8%'
    },
    ItemsContainer: {
        marginLeft: 30,
        marginRight: 30,
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
    mapContainer: {
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 20,
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
