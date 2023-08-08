import { View, Text, StyleSheet, Image, ActivityIndicator} from "react-native"
import { useState, useEffect } from "react"


function AuthorPressable(props) {
    const APIPrefix = 'http://192.168.1.249:8000/api/'
    const authorAPIRequest = 'http://192.168.1.249:8000/api/getuserbyusername/' + props.username

    const [nFollowersAuthor, setNFollowersAuthor] = useState(0)
    const [authorData, setAuthorData] = useState([])
    const [isLoadingItems, setIsLoadingItems] = useState(true)

    useEffect(() => {
        fetchAuthorData()
    }, [])

    async function fetchAuthorData(){
        const responseAuthor = await fetch(authorAPIRequest)
        if (!responseAuthor.ok) {
            throw new Error('Network response was not ok')
        }
        const imageMetadataAuthor = JSON.parse(responseAuthor.headers.get('imageInfos'))
        setAuthorData(imageMetadataAuthor)
        const responseAuthorFollowers = await fetch(APIPrefix + 'getfollowersbyusername/' + props.username)
        const responseDataAuthorFollowers = await responseAuthorFollowers.json()
        setNFollowersAuthor(responseDataAuthorFollowers.length)
        setIsLoadingItems(false)
    }

    return (
        <>
        {
            isLoadingItems ?
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large"  color="#ff0000"/>
            </View>
            :
            <View style={styles.friendItem}>
                    <View style={styles.itemContent}>
                        <Image
                            source={{ uri: authorAPIRequest }}
                            style={styles.avatar}
                        />
                        <View>
                            <Text style={styles.friendName}>{authorData.name}</Text>
                            <Text style={styles.friendState}>{"Followers: "+ nFollowersAuthor}</Text>
                        </View>
                    </View>
            </View>
        }
        </>
    )
}

export default AuthorPressable

const styles = StyleSheet.create({
    friendItem: {
        borderRadius: 6,
        backgroundColor: '#e9e7e7',
        height: 70,
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
    }
})