import { StyleSheet, View, Text, Image, Dimensions } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Feather } from '@expo/vector-icons'
import { useGlobalContext } from "../globalContext/GlobalContext"
import { useState, useEffect } from "react"
import { calculateOptimizedImageSize } from "../imageSizesOptimizer/imageSizesOptimizer"

const windowWidth = Dimensions.get('window').width

function UserUpperInfos(props){
    const { globalVariable, setGlobalVariable } = useGlobalContext()
    const [userImageWidth, setUserImageWidth] = useState(110)
    const [userImageHeight, setUserImageHeight] = useState(110)

    useEffect(() => {
        if(props.includeImage)
            calculateOptimizedImageSize(globalVariable.API_URL + 'getuserbyusername/' + props.loggedUsername + '/' + props.usernameFollowed + '?' + Math.random(), 80, setUserImageWidth, setUserImageHeight)
    }, [])

    function getUserImage(){
        return <Image source={{ uri: globalVariable.API_URL + 'getuserbyusername/' + props.loggedUsername + '/' + props.usernameFollowed + '?' + Math.random()}} style={[styles.userImage, imageSizeStyle]} />
    }

    const imageSizeStyle = {
        width: userImageWidth || 200,
        height: userImageHeight || 200,
    }

    return(
        <>
            {
                props.includeImage ?
                <View style={styles.imageContainer}>
                {
                    getUserImage()
                }
                </View>
                : null
            }
            <View style={styles.rowContainer}>
                <View style={[styles.container, styles.flexContainer]}>
                    <Text style={styles.likesText}>Likes: {props.likes}</Text>
                    <MaterialCommunityIcons
                        name={"heart"}
                        size={32}
                        color={"red"}
                        style={styles.heart}
                    />
                </View>
                <View style={[styles.container, styles.flexContainer]}>
                    <Text style={styles.followersText}>Followers: {props.followers}</Text>
                    <Feather
                        name={"user"}
                        size={32}
                        color={"blue"}
                        style={styles.heart}
                    />
                </View>
            </View>
            {
                props.state === '' || props.state === null ?
                null
                :
                <View style={styles.container}>
                    <Text style={styles.text}>{props.state}</Text>
                </View>
            }
        </>
    )
}

export default UserUpperInfos

const shadowStyle = Platform.select({
    ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    android: {
        elevation: 8,
    },
    default: {},
})

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
    },
    likesText: {
        paddingTop: 2,
        fontSize: 18,
        flex: 1,
    },
    followersText: {
        paddingTop: 2,
        fontSize: 18,
        flex: 1
    },
    container: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 13,
        padding: 20,
        flexDirection: 'row',
        ...shadowStyle
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    flexContainer: {
        flex: 1, 
    },
    heart: {
        marginBottom: 0,
    },
    imageContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 13,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20,
        ...shadowStyle
    },
    userImage: {
        borderRadius: 10,
        width: windowWidth - 50, 
        height: windowWidth - 110, // L'altezza sarà il 50% della larghezza per mantenere l'aspect ratio
        borderRadius: 10,
    }, 
})