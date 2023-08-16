import { View, StyleSheet, Text, Image, ScrollView, Dimensions, ActivityIndicator, Pressable, Alert, TextInput, Button } from "react-native"
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
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null)
    const [userImageWidth, setUserImageWidth] = useState(0)
    const [userImageHeight, setUserImageHeight] = useState(0)
    const [image, setImage] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [editButtonText, setEditButtonText] = useState('Edit')

    useEffect(() => {
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
        if(editButtonText === 'Save changes')
            Alert.alert(
                'Request for confirmation',
                'If you go back, all changes will be lost. To save your changes, press on the "Save changes" button on the bottom.',
                [
                { text: 'Annulla', },
                { text: 'OK', onPress: () => navigation.goBack() }
                ],
                { cancelable: true }
            )
        else
            navigation.goBack()
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

    function showAlertError(missingData){
        let errorPhrase
        let errorTitle = 'Missing data' 
        if(missingData === 'name') errorPhrase = 'Please enter your name'
        if(missingData === 'Location') errorPhrase = 'Please enter the location of the sighting in the map'
        Alert.alert(
            errorTitle,
            errorPhrase,
            [
              { text: 'OK'}
            ],
            { cancelable: true }
        )
    }

    function controlInputData(){
        if(name.length === 0) showAlertError('name')
        else if(lonUser.length === 0) showAlertError('Location')
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

    function pickColor(headerColor, backgoundColor){
        setGlobalVariable({backgoundColor: backgoundColor, headerColor: headerColor})
    }

    function getUserSettings(){
        return(
            <>
                <ScrollView style={{backgroundColor: globalVariable.backgoundColor}}>
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
                            label='name'
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
                            label='state'
                            multiline={true}
                            value={state}
                            onChangeText={text => setState(text)}
                            maxLength={200}
                            disabled={editButtonText === 'Edit' ? true : false}
                        />
                    </View>
                    <View style={styles.colorsContainer}>
                        <Text style={styles.text}>Select the color of the application:</Text>
                        <View style={styles.rowContainer}>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.colorButtonGrey,
                                    pressed && { opacity: 0.8, backgroundColor: '#929292' }
                                ]} 
                                onPress={() => pickColor('#f2f2f2', '#e9e7e7')}
                                >
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.colorButtonYellow,
                                    pressed && { opacity: 0.8, backgroundColor: '#929292' }
                                ]} 
                                onPress={() => pickColor('#f2e28e', '#f1ebca')}
                                >
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.colorButtonRed,
                                    pressed && { opacity: 0.8, backgroundColor: '#929292' }
                                ]} 
                                onPress={() => pickColor('#ff9a98', '#fdd8d8')}
                                >
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.colorButtonGreen,
                                    pressed && { opacity: 0.8, backgroundColor: '#929292' }
                                ]} 
                                onPress={() => pickColor('#85D2D0', '#e0f2f1')}
                                >
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.colorButtonPurple,
                                    pressed && { opacity: 0.8, backgroundColor: '#929292' }
                                ]} 
                                onPress={() => pickColor('#887BB0', '#dbd4f1')}
                                >
                            </Pressable>
                        </View>
                    </View>
                    <View style={styles.locationContainer}>
                        <Text style={styles.text}>Default location:</Text>
                        <Text>(Press edit to change it)</Text>
                        <View style={styles.mapContainer}>
                            <MapInputComponent latUser={latUser} lonUser={lonUser} sendLocation={getLocationHandler} enablePressing={false}/>
                        </View>
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
        backgroundColor: '#887BB0',
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