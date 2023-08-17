import { View, StyleSheet, Text, Image, ScrollView, Dimensions, ActivityIndicator, Pressable, Alert, BackHandler, Button } from "react-native"
import { useEffect, useState } from "react"
import { Input } from 'react-native-elements'
import UserSettingHeaderBar from "../headerBars/UserSettingHeaderBar"
import MapInputComponent from "../addNewBird-editBird/MapInputComponent"
import * as ImagePicker from 'expo-image-picker'
import { API_URL } from "../../env"
import { calculateOptimizedImageSize } from "../imageSizesOptimizer/imageSizesOptimizer"
import { useNavigation } from "@react-navigation/native"
import UserUpperInfos from "../userDetail/UserUpperInfos"
import { useGlobalContext } from "../globalContext/GlobalContext"
import AsyncStorage from "@react-native-async-storage/async-storage"


const windowWidth = Dimensions.get('window').width

function UserSetting(props){
    const navigation = useNavigation()
    const { globalVariable, setGlobalVariable } = useGlobalContext()

    const [isLoadingUserData, setIsLoadingUserData] = useState(true)
    const [name, setName] = useState(props.userData.name)
    const [state, setState] = useState(props.userData.state)
    const [latUser, setLatUser] = useState(props.userData.xPosition ? props.userData.xPosition : 0)
    const [lonUser, setLonUser] = useState(props.userData.yPosition ? props.userData.yPosition : 0)
    const [email, setEmail] = useState(props.userData.email)
    const [likes, setLikes] = useState(props.userData.likes)
    const [followers, setFollowers] = useState(props.userData.followers)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null)
    const [userImageWidth, setUserImageWidth] = useState(0)
    const [userImageHeight, setUserImageHeight] = useState(0)
    const [image, setImage] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [editButtonText, setEditButtonText] = useState('Edit')
    const [changinPassword, setChanginPassword] = useState(false)

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress
        );
    
        return () => backHandler.remove()
    }, [])
      
    const handleBackPress = () => {
        if(editButtonText === 'Save changes'){
            closePageAlert()
            return true
        }else{
            navigation.goBack()
        }
    }


    useEffect(() => {
        console.log(props.userData)
        setIsLoadingUserData(true)
        calculateOptimizedImageSize(API_URL + 'getuserbyusername/' + props.userData.username + '/' + props.userData.username, 80, setUserImageWidth, setUserImageHeight)
        setIsLoadingUserData(false)
    }, [])

    useEffect(() => {
        if(image){
            calculateOptimizedImageSize(image[0].uri, 80, setUserImageWidth, setUserImageHeight)
        }
    }, [image])

    useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
            setHasGalleryPermission(galleryStatus.status === 'granted')
        })()
    }, [])

    function getUserImage(){
        if(!image) return <Image source={{ uri: API_URL + 'getuserbyusername/' + props.userData.username + '/' + props.userData.username }} style={[styles.userImage, imageSizeStyle]} />
        return image && <Image source={{ uri: image[0].uri }} style={[styles.userImage, imageSizeStyle]} />
    }

    function closePageAlert(){
        if(editButtonText === 'Save changes' || changinPassword)
            Alert.alert(
                'Request for confirmation',
                'If you go back, all changes will be lost.',
                [
                { text: 'Cancel', },
                { text: 'OK', onPress: () => navigation.goBack() }
                ],
                { cancelable: true }
            )
        else
            navigation.goBack()
    }

    function logoutAlert(){
        Alert.alert(
            'Confirm logout',
            'Are you sure you want to log out?',
            [
            { text: 'Cancel', },
            { text: 'Yes', onPress: () => logout() }
            ],
            { cancelable: true }
        )
    }

    async function logout(){
        await AsyncStorage.clear()
        navigation.navigate('IntroPage')
    }

    function getLocationHandler(coordinate){
        setLatUser(coordinate.latitude)
        setLonUser(coordinate.longitude)
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        })

        if(!result.canceled){
            setImage(result.assets)
            console.log(result.assets)
        }
    }

    const imageSizeStyle = {
        width: userImageWidth || 200,
        height: userImageHeight || 200,
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
        if(name.length === 0) showAlert('Missing data', 'Please enter your name')
        else if(lonUser.length === 0) showAlert('Missing data', 'Please enter your default location in the map')
        else{ 
            saveChanges()
            return true
        }
        return false
    }

    async function saveChanges(){
        setIsSaving(true)
        let formData = new FormData()
        if(image){
            formData.append('photo', {
                uri: image[0].uri,
                type: 'image/jpeg',
                name: 'my_image.jpg',
            })
        }

        formData.append('username', props.userData.username)
        formData.append('name', name)
        formData.append('state', state)
        formData.append('xPosition', latUser)
        formData.append('yPosition', lonUser)

        console.log(formData)
        
        try {
            const response = await fetch(API_URL + 'edituser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            })
            const jsonUserData = await response.json()
            if(response.ok){
                props.setUserData(jsonUserData[0])
            }
            console.log(jsonUserData[0])
        } catch (error) {
            console.error(error);
        }
        setIsSaving(false)
    }
      
    function onEditButtonPressHandler(){
        if(editButtonText === 'Save changes'){
            result = controlInputData()
            if(result){
                setEditButtonText('Edit')
            }
        }else{
            setEditButtonText('Save changes')
        }
    }

    function checkNewPasswordData(){
        if(password === '') showAlert('Missing password', 'Please insert the password')
        else if(confirmPassword === '') showAlert('Missing confirm password', 'Please insert the confirm password')
        else if(password !== confirmPassword) showAlert('Different password and confirm password', 'Password and confirm password are different')
        else changePassword()
    }

    async function changePassword(){
        let formData = new FormData()
        formData.append('password', password)
        formData.append('username', props.userData.username)

        console.log(formData)
        
        try {
            const response = await fetch(API_URL + 'changepassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            })
            const jsonUserData = await response.json()
            if(response.ok){
                showAlert('Password changed', 'Password was successfully changed')
                setChanginPassword(false)
                setPassword('')
                setConfirmPassword('')
            }
            console.log(jsonUserData[0])
        } catch (error) {
            console.error(error);
        }
    }

    async function pickColor(headerColor, backgroundColor, buttonColor){
        setGlobalVariable({backgroundColor: backgroundColor, headerColor: headerColor, buttonColor: buttonColor})
        await AsyncStorage.setItem('applicationColor', JSON.stringify({backgroundColor: backgroundColor, headerColor: headerColor, buttonColor: buttonColor}))
    }

    function changePasswordButtonHandler(){
        const newValue = !changinPassword
        if(newValue === true)
            setChanginPassword(true)
        else{
            checkNewPasswordData()
        }
    }

    function getUserSettings(){
        return(
            <>
                <ScrollView style={{backgroundColor: globalVariable.backgroundColor}}>
                    <UserUpperInfos likes={likes} followers={followers} state={''}/>
                    <View style={styles.imageContainer}>
                        {
                            getUserImage()
                        }
                        {
                            editButtonText === 'Save changes'
                            ?
                            <Pressable
                                style={({ pressed }) => [
                                    styles.imageButtonPicker,
                                    pressed && { opacity: 0.8, backgroundColor: '#929292' }
                                ]} 
                                onPress={() => pickImage()}
                                >
                                <Text style={styles.textPickPhotoPressable}>Change your profile pic</Text>
                            </Pressable>
                            : null
                        }
                    </View>
                    <View style={styles.ItemsContainer}>
                        <Input
                            errorStyle={{ color: 'red' }}
                            label='Username'
                            multiline={true}
                            value={props.userData.username}
                            onChangeText={text => setState(text)}
                            maxLength={200}
                            disabled
                        />
                        <Input
                            placeholder='Insert your name'
                            errorStyle={{ color: 'red' }}
                            label='Name'
                            value={name}
                            onChangeText={text => setName(text)}
                            maxLength={30}
                            disabled={editButtonText === 'Edit' ? true : false}
                        />
                        <Input
                            errorStyle={{ color: 'red' }}
                            label='Email'
                            multiline={true}
                            value={email}
                            onChangeText={text => setState(text)}
                            maxLength={200}
                            disabled
                        />
                        <Input
                            placeholder='Insert your state'
                            errorStyle={{ color: 'red' }}
                            label='State'
                            multiline={true}
                            value={state}
                            onChangeText={text => setState(text)}
                            maxLength={200}
                            disabled={editButtonText === 'Edit' ? true : false}
                        />
                    </View>
                    <View style={styles.colorsContainer}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.changePasswordButton,
                                pressed && { opacity: 0.8, backgroundColor: '#929292' }
                            ]} 
                            onPress={() => changePasswordButtonHandler()}
                            >
                            {
                                changinPassword ? 
                                <Text style={styles.textPickPhotoPressable}>Confirm new password</Text>
                                :
                                <Text style={styles.textPickPhotoPressable}>Change your password</Text>
                            }
                        </Pressable>
                        {
                            changinPassword ?
                            <>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.changePasswordButton,
                                        pressed && { opacity: 0.8, backgroundColor: '#929292' }
                                    ]} 
                                    onPress={() => setChanginPassword(false)}
                                    >
                                    <Text style={styles.textPickPhotoPressable}>Cancel</Text>
                                </Pressable>
                                <Input
                                placeholder='Insert password'
                                errorStyle={{ color: 'red' }}
                                label='Password'
                                multiline={true}
                                value={password}
                                onChangeText={text => setPassword(text)}
                                maxLength={200}
                                disabled={changinPassword === true ? false : true}
                                />
                                <Input
                                placeholder='Insert confirm password'
                                errorStyle={{ color: 'red' }}
                                label='Confirm password'
                                multiline={true}
                                value={confirmPassword}
                                onChangeText={text => setConfirmPassword(text)}
                                maxLength={200}
                                />
                            </>
                            :null
                        }
                    </View>
                    <View style={styles.colorsContainer}>
                        <Text style={styles.text}>Select the color of the application:</Text>
                        <View style={styles.rowContainer}>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.colorButtonPurple,
                                    pressed && { opacity: 0.8, backgroundColor: '#929292' }
                                ]} 
                                onPress={() => pickColor('#adb2fc', '#c0daf8', '#bcc9ff')}
                                >
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.colorButtonGrey,
                                    pressed && { opacity: 0.8, backgroundColor: '#929292' }
                                ]} 
                                onPress={() => pickColor('#f2f2f2', '#d1cfcf', '#f3f3f3')}
                                >
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.colorButtonYellow,
                                    pressed && { opacity: 0.8, backgroundColor: '#929292' }
                                ]} 
                                onPress={() => pickColor('#f2e28e', '#f1ebca', '#f5d4be')}
                                >
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.colorButtonRed,
                                    pressed && { opacity: 0.8, backgroundColor: '#929292' }
                                ]} 
                                onPress={() => pickColor('#ff9a98', '#fdd8d8', '#fcb6b6')}
                                >
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.colorButtonGreen,
                                    pressed && { opacity: 0.8, backgroundColor: '#929292' }
                                ]} 
                                onPress={() => pickColor('#85D2D0', '#e0f2f1', '#acb9f3')}
                                >
                            </Pressable>
                        </View>
                    </View>
                    <View style={styles.locationContainer}>
                        <Text style={styles.text}>Default location:</Text>
                        {
                            editButtonText === 'Edit' ?
                            <Text>(Press edit to change it)</Text> : null
                        }
                        <View style={styles.mapContainer}>
                            <MapInputComponent latUser={parseFloat(props.userData.xPosition)} lonUser={parseFloat(props.userData.yPosition)} sendLocation={getLocationHandler} enablePressing={editButtonText !== 'Edit'}/>
                        </View>
                    </View>
                    <View style={styles.logoutContainer}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.logoutButton,
                                pressed && { opacity: 0.8, backgroundColor: '#929292' }
                            ]} 
                            onPress={() => logoutAlert()}
                            >
                            <Text style={styles.textPickPhotoPressable}>Logout</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </>

        )
    }

    return (
        <>
            <View style={styles.headerContainer}>
                <UserSettingHeaderBar onBackButtonPress={closePageAlert} onEditButtonPress={onEditButtonPressHandler} editButtonText={editButtonText} isSaving={isSaving}/>
            </View>
            {
                isLoadingUserData ?
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
                :
                getUserSettings()
            }
        </>
      )
}

export default UserSetting

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

const colorButton = StyleSheet.create({
    height: 40,
    width: 40,
    borderRadius: 50,
    borderColor: 'black',
    borderWidth: 5,
})

const styles = StyleSheet.create({
    userImage: {
        borderRadius: 10,
        width: windowWidth - 50, 
        height: windowWidth - 110, // L'altezza sarà il 50% della larghezza per mantenere l'aspect ratio
        borderRadius: 10,
    }, 
    ItemsContainer: {
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: 'white',
        borderRadius: 13,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        ...shadowStyle
    },
    logoutContainer: {
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: 'white',
        borderRadius: 13,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        marginBottom: 20,
        ...shadowStyle
    },
    colorsContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 13,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        ...shadowStyle
    },
    imageContainer: {
        marginLeft: 10,
        marginRight: 10,
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
    locationContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 13,
        padding: 20,
        ...shadowStyle
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
    },
    calendarText: {
        fontWeight: 'bold', 
        fontSize: 16, 
        color: '#a3a3a3', 
        paddingLeft: 10,
        paddingTop: 10,
    },
    headerContainer: {
        height: '8%'
    },
    mapContainer: {
        paddingTop: 20,
    },
    uploadPressable: {
        backgroundColor: '#cbd8ca',
        borderColor: 'black',
        borderWidth: 2,
        height: 70,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    textUploadPressable: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    imageButtonPicker: {
        backgroundColor: '#dfdfdf',
        borderColor: 'black',
        borderWidth: 2,
        height: 50,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    changePasswordButton: {
        backgroundColor: '#dfdfdf',
        borderColor: 'black',
        borderWidth: 2,
        height: 50,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    logoutButton: {
        backgroundColor: '#ffb3b3',
        borderColor: 'black',
        borderWidth: 2,
        height: 50,
        marginLeft: 40,
        marginRight: 40,
        marginBottom: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    colorButtonGrey: {
        ...colorButton,
        backgroundColor: '#e9e7e7',
    },
    colorButtonYellow: {
        ...colorButton,
        backgroundColor: '#f2e28e',
    },
    colorButtonRed: {
        ...colorButton,
        backgroundColor: '#ff9a98',
    },
    colorButtonGreen: {
        ...colorButton,
        backgroundColor: '#85D2D0',
    },
    colorButtonPurple: {
        ...colorButton,
        backgroundColor: '#adb2fc',
    },
    textPickPhotoPressable: {
        fontSize: 18,
    },
    rowContainer: {
        flex: 1,
        marginTop: 20,
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'space-between',
    },
})