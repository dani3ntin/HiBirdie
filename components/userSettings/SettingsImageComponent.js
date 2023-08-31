import { Text, StyleSheet, Pressable, View, Image } from "react-native"
import { useState } from "react"
import { useGlobalContext } from "../globalContext/GlobalContext"
import { useEffect } from "react"
import { calculateOptimizedImageSize } from "../imageSizesOptimizer/imageSizesOptimizer"
import * as ImagePicker from 'expo-image-picker'

function SettingsImageComponent(props) {
    const { globalVariable, setGlobalVariable } = useGlobalContext()
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null)
    const [userImageWidth, setUserImageWidth] = useState(0)
    const [userImageHeight, setUserImageHeight] = useState(0)

    useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
            setHasGalleryPermission(galleryStatus.status === 'granted')
        })()
    }, [])

    useEffect(() => {
        calculateOptimizedImageSize(globalVariable.API_URL + 'getuserbyusername/' + props.username + '/' + props.username, 80, setUserImageWidth, setUserImageHeight)
    }, [])

    useEffect(() => {
        if(props.image){
            calculateOptimizedImageSize(props.image[0].uri, 80, setUserImageWidth, setUserImageHeight)
        }
    }, [props.image])

    const imageSizeStyle = {
        width: userImageWidth || 200,
        height: userImageHeight || 200,
    }

    function getUserImage(){
        if(!props.image) return <Image source={{ uri: globalVariable.API_URL + 'getuserbyusername/' + props.username + '/' + props.username + globalVariable.randomStringToUpdate}} style={[styles.userImage, imageSizeStyle]} />
        return props.image && <Image source={{ uri: props.image[0].uri }} style={[styles.userImage, imageSizeStyle]} />
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        })

        if(!result.canceled){
            props.setImage(result.assets)
        }
    }

    return (
        <>
            <View style={styles.centered}>
                {
                    getUserImage()
                }
            </View>

            {
                props.editButtonText === 'Save changes'
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
        </>  
    )
}

export default SettingsImageComponent

const styles = StyleSheet.create({
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
    textPickPhotoPressable: {
        fontSize: 18,
    },
    centered:{
        alignItems: 'center',
        justifyContent: 'center',
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

})