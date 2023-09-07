import { View, StyleSheet, Text, Image, ScrollView, Dimensions, ActivityIndicator, Pressable, Alert, BackHandler, Button } from "react-native"
import { useEffect, useState } from "react"
import UserSettingHeaderBar from "../headerBars/UserSettingHeaderBar"
import MapInputComponent from "../addNewBird-editBird/MapInputComponent"
import { useNavigation } from "@react-navigation/native"
import UserUpperInfos from "../userDetail/UserUpperInfos"
import { useGlobalContext } from "../globalContext/GlobalContext"
import ColorPicker from "./ColorPicker"
import ChangePasswordComponent from "./ChangePasswordComponent"
import LogoutComponent from "./LogoutComponent"
import SettingsForm from "./SettingsForm"
import SettingsImageComponent from "./SettingsImageComponent"


const windowWidth = Dimensions.get('window').width

function UserSettings(props){
    const navigation = useNavigation()
    const { globalVariable, setGlobalVariable } = useGlobalContext()

    const [name, setName] = useState(props.userData.name)
    const [state, setState] = useState(props.userData.state)
    const [latUser, setLatUser] = useState(props.userData.xPosition ? props.userData.xPosition : 0)
    const [lonUser, setLonUser] = useState(props.userData.yPosition ? props.userData.yPosition : 0)
    const [image, setImage] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [editButtonText, setEditButtonText] = useState('Edit')
    const [changinPassword, setChanginPassword] = useState(false)

    const email = props.userData.email
    const likes = props.userData.likes
    const followers = props.userData.followers

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
        );
    
        return () => backHandler.remove()
    }, [])
      
    const handleBackPress = () => {
        if (navigation.canGoBack()) {
            closePageAlert()
        }
        return true
    }

    function followersButtonPressedHandler(){
        navigation.navigate('ShowFollowersPage', {usernameFollowed: props.userData.username, nameFollowed: props.userData.name, loggedUsername: props.userData.username})
    }

    function likesButtonPressedHandler(){
        navigation.navigate('ShowLikesPage', {usernameFollowed: props.userData.username, nameFollowed: props.userData.name, loggedUsername: props.userData.username})
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


    function getLocationHandler(coordinate){
        setLatUser(coordinate.latitude)
        setLonUser(coordinate.longitude)
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

        console.log(latUser, lonUser)
        
        try {
            const response = await fetch(globalVariable.API_URL + 'edituser', {
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

    function getUserSettings(){
        return(
            <>
                <ScrollView style={{backgroundColor: globalVariable.backgroundColor}}>
                    <UserUpperInfos 
                        likes={likes} 
                        followers={followers} 
                        state={''}
                        includeImage={false} 
                        followersButtonPressed={followersButtonPressedHandler}
                        likesButtonPressed={likesButtonPressedHandler}
                        loggedUsername={props.userData.username} 
                        usernameFollowed={props.userData.username} 
                    />
                    <View style={styles.imageContainer}>
                        <SettingsImageComponent username={props.userData.username} editButtonText={editButtonText} image={image} setImage={setImage}/>
                    </View>
                    <View style={styles.ItemsContainer}>
                        <SettingsForm 
                            username={props.userData.username}
                            name={name}
                            email={email}
                            state={state}
                            setName={setName}
                            setState={setState}
                            editButtonText={editButtonText}
                        />
                    </View>
                    <View style={styles.changePasswordContainer}>
                        <ChangePasswordComponent changinPassword={changinPassword} setChanginPassword={setChanginPassword} username={props.userData.username}/>
                    </View>
                    <View style={styles.colorsContainer}>
                        <ColorPicker />
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
                        <LogoutComponent />
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
                getUserSettings()
            }
        </>
      )
}

export default UserSettings

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
    changePasswordContainer: {
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
        textPickPhotoPressable: {
        fontSize: 18,
    },
})