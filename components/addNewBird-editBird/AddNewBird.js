import { View, StyleSheet, Modal, Text, Image, ScrollView, Dimensions, ActivityIndicator, Pressable, Alert, TextInput, Button } from "react-native"
import { useEffect, useState } from "react"
import { calculateOptimizedLocalImageSize } from "../imageSizesOptimizer/imageSizesOptimizer"
import { Input } from 'react-native-elements'
import AsyncStorage from "@react-native-async-storage/async-storage"
import AddBirdHeaderBar from "../headerBars/AddBirdHeaderBar"
import MapInputComponent from "./MapInputComponent"
import * as ImagePicker from 'expo-image-picker'
import DatePicker from 'react-native-modern-datepicker'
import { formatDateToString } from "../utils/utils"
import { stringToDate } from "../utils/utils"
import { API_URL } from "../../env"
import { useNavigation } from "@react-navigation/native"

const windowWidth = Dimensions.get('window').width

function AddNewBird(props){
    const [birdName, setBirdName] = useState('')
    const [personalNotes, setPersonalNotes] = useState('')
    const [latUser, setLatUser] = useState(setLatitude(props.coordinates))
    const [lonUser, setLonUser] = useState(setLongitude(props.coordinates))
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null)
    const [birdImageWidth, setBirdImageWidth] = useState(0)
    const [birdImageHeight, setBirdImageHeight] = useState(0)
    const [image, setImage] = useState(null)
    const [isUploadingBird, setIsUploadingBird] = useState(false)
    
    const navigation = useNavigation()

    function setLatitude(coordinate){
        if(coordinate == null) return 0
        else return props.coordinates.latitude
    }

    function setLongitude(coordinate){
        if(coordinate == null) return 0
        else return props.coordinates.longitude
    }

    useEffect(() => {
        calculateOptimizedLocalImageSize(image, 80, setBirdImageWidth, setBirdImageHeight)
    }, [image])

    useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
            setHasGalleryPermission(galleryStatus.status === 'granted')
        })()
    }, [])

    function closePageAlert(){
        Alert.alert(
            'Request for confirmation',
            'If you go back, all data entered will be lost',
            [
              { text: 'Annulla', },
              { text: 'OK', onPress: () => navigation.goBack() }
            ],
            { cancelable: true }
        )
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
        width: birdImageWidth || 200,
        height: birdImageHeight || 200,
    }

    function showAlertError(missingData){
        let errorPhrase
        let errorTitle = 'Missing data' 
        if(missingData === 'Bird name') errorPhrase = 'Please enter the bird name'
        if(missingData === 'Personal notes') errorPhrase = 'Please enter your personal notes'
        if(missingData === 'Sighting date') errorPhrase = 'Please enter the day of the sighting'
        if(missingData === 'Invalid date') {errorPhrase = 'Please enter a valid date, the date must not exceed today\'s day'; errorTitle='Invalid date'}
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
        if(birdName.length === 0) showAlertError('Bird name')
        else if(selectedDate.length === 0) showAlertError('Sighting date')
        else if(stringToDate(selectedDate.replace(/\//g, "-")) > new Date()) showAlertError('Invalid date')
        else if(lonUser.length === 0) showAlertError('Location')
        else if(!image || image[0].uri === ''){
            Alert.alert(
                'Missing bird image',
                'You have not uploaded the bird photo, a default image will be used',
                [
                  { text: 'Annulla', },
                  { text: 'OK', onPress: () => uploadBird() }
                ],
                { cancelable: true }
            )
        }else{ uploadBird() }
    }

    async function uploadBird(){
        setIsUploadingBird(true)
        let formData = new FormData()
        if(image){
            formData.append('photo', {
                uri: image[0].uri,
                type: 'image/jpeg',
                name: 'my_image.jpg',
            })
        }

        formData.append('name', birdName)
        formData.append('sightingDate', selectedDate.replace(/\//g, "-"))
        formData.append('personalNotes', personalNotes)
        formData.append('xPosition', latUser)
        formData.append('yPosition', lonUser)
        formData.append('user', props.loggedUsername)
        
        try {
            const response = await fetch(API_URL + 'addbird', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            })
            console.log(response.status)
            navigation.goBack()
        } catch (error) {
            console.error(error);
        }
        setIsUploadingBird(false)
    }
      
    function getAddBird(){
        return(
            <>
                <ScrollView style={styles.scrollViewcontainer}>
                    <View style={styles.imageContainer}>
                        {image && <Image source={{ uri: image[0].uri }} style={[styles.birdImage, imageSizeStyle]} />}
                        {!image && <Text>Press the button and pick a bird photo from your gallery!</Text>}
                        <Pressable
                            style={({ pressed }) => [
                                styles.imageButtonPicker,
                                pressed && { opacity: 0.8, backgroundColor: '#929292' }
                            ]} 
                            onPress={() => pickImage()}
                            >
                            <Text style={styles.textPickPhotoPressable}>Pick the bird photo</Text>
                        </Pressable>
                    </View>
                    <View style={styles.locationContainer}>
                        <Text style={styles.text}>Enter the location of the sighting:</Text>
                        <View style={styles.mapContainer}>
                            <MapInputComponent latUser={latUser} lonUser={lonUser} sendLocation={getLocationHandler}/>
                        </View>
                    </View>
                    <View style={styles.ItemsContainer}>
                        <Input
                            placeholder='Bird name'
                            errorStyle={{ color: 'red' }}
                            label='Bird name'
                            value={birdName}
                            onChangeText={text => setBirdName(text)}
                            maxLength={50}
                        />
                        <Input
                            placeholder='Personal notes'
                            errorStyle={{ color: 'red' }}
                            label='Personal notes'
                            multiline={true}
                            value={personalNotes}
                            onChangeText={text => setPersonalNotes(text)}
                            maxLength={2000}
                        />
                        <Text style={styles.calendarText}>Sighting date:</Text>
                        <DatePicker 
                            mode="calendar"
                            options={{
                                borderColor: 'black'
                            }}
                            onSelectedChange={date => setSelectedDate(date)}
                            selected={formatDateToString(new Date())}
                            current={formatDateToString(new Date())}
                        />
                    </View>
                    <Pressable
                        style={({ pressed }) => [
                            styles.uploadPressable,
                            pressed && { opacity: 0.8, backgroundColor: '#929292' }
                        ]}
                        onPress={() => controlInputData()}
                        >
                            {
                                isUploadingBird ? 
                                <ActivityIndicator size="large" color="#000000"/>
                                :
                                <Text style={styles.textUploadPressable}>Add this bird to your encyclopedia</Text>
                            }
                    </Pressable>
                </ScrollView>
            </>

        )
    }

    return (
        <>
            <View style={styles.headerContainer}>
                <AddBirdHeaderBar onBackButtonPress={closePageAlert}/>
            </View>
            {
                getAddBird()
            }
        </>
      )
}

export default AddNewBird

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
    birdImage: {
        borderRadius: 10,
        width: windowWidth - 50, 
        height: windowWidth - 110, // L'altezza sarà il 50% della larghezza per mantenere l'aspect ratio
        borderRadius: 10,
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
        ...shadowStyle
    },
    imageContainer: {
        marginLeft: 20,
        marginRight: 20,
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
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 13,
        padding: 20,
        ...shadowStyle
    },
    scrollViewcontainer: {
        backgroundColor: '#e9e7e7',
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
    textPickPhotoPressable: {
        fontSize: 18,
    },
})