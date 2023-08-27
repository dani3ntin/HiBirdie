import { View, Text, StyleSheet, Image, ActivityIndicator, Pressable} from "react-native"
import { useState, useEffect } from "react"
import { useNavigation } from "@react-navigation/native"
import { useGlobalContext } from "../globalContext/GlobalContext"


function AuthorPressable(props) {
    const { globalVariable, setGlobalVariable } = useGlobalContext()
    const [nFollowersAuthor, setNFollowersAuthor] = useState(0)
    const [authorData, setAuthorData] = useState([])
    const [isLoadingItems, setIsLoadingItems] = useState(true)

    const navigation = useNavigation()

    useEffect(() => {
        fetchAuthorData()
    }, [])

    async function fetchAuthorData(){
        const responseAuthor = await fetch(globalVariable.API_URL + 'getuserbyusername/' + props.loggedUsername + '/' + props.authorUsername)
        if (!responseAuthor.ok) {
            throw new Error('Network response was not ok')
        }
        const imageMetadataAuthor = JSON.parse(responseAuthor.headers.get('imageInfos'))
        setAuthorData(imageMetadataAuthor)
        const responseAuthorFollowers = await fetch(globalVariable.API_URL + 'getfollowersbyusername/' + props.authorUsername)
        const responseDataAuthorFollowers = await responseAuthorFollowers.json()
        setNFollowersAuthor(responseDataAuthorFollowers.length)
        setIsLoadingItems(false)
    }

    function onFollowerPressedHandler(usernameFollowed, nameFollowed, stateFollowed, likesFollowed, nOfFollowersFollowed, isLoggedUserFollowing){
        navigation.navigate('UserDetailPage', {usernameFollowed: usernameFollowed, name: nameFollowed, state: stateFollowed, likes: likesFollowed,
            followers: nOfFollowersFollowed, isLoggedUserFollowing: isLoggedUserFollowing, loggedUsername: props.loggedUsername})
    }

    return (
        <>
            {
                isLoadingItems ?
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large"  color="#ff0000"/>
                </View>
                :
                <Pressable
                    onPress={() => onFollowerPressedHandler(authorData.username, authorData.name, authorData.state, authorData.likes, authorData.followers, authorData.isLoggedUserFollowing)}
                    style={({pressed}) => pressed && styles.pressedItem}
                >
                <View style={styles.friendItem}>
                        <View style={styles.itemContent}>
                            <Image
                                source={{ uri: globalVariable.API_URL + 'getuserbyusername/' + props.loggedUsername + '/' + props.authorUsername }}
                                style={styles.avatar}
                            />
                            <View>
                                <Text style={styles.friendName}>{authorData.name}</Text>
                                <Text style={styles.friendState}>{"Followers: "+ nFollowersAuthor}</Text>
                            </View>
                        </View>
                </View>
                </Pressable>
            }
        </>
    )
}

export default AuthorPressable

const styles = StyleSheet.create({
    friendItem: {
        borderRadius: 6,
        backgroundColor: '#e9e7e7',
        borderBlockColor: 'black',
        borderWidth: 1,
    },
    friendName: {
        color: 'black',
        paddingTop: 8,
        paddingLeft: 8,
        fontSize: 19,
        fontWeight: 'bold',
    },
    friendState: {
        color: 'black',
        paddingLeft: 8,
        fontSize: 15,
    },
    pressedItem: {
        opacity: 0.5,
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 100,
        marginLeft: 5,
        marginTop: 5,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pressedItem: {
        opacity: 0.5,
    },
})