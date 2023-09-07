import { View, Text, StyleSheet, ScrollView, Pressable} from "react-native"
import { useIsFocused } from '@react-navigation/native'
import FollowedItem from "../items/FollowedItem"
import { useState, useEffect } from "react"
import { ActivityIndicator } from "react-native"
import UserDetailPage from "../userDetail/UserDetailPage"
import SearchUsers from "../searchUsers/SearchUsers"
import { useNavigation } from "@react-navigation/native"
import { useGlobalContext } from "../globalContext/GlobalContext"

function FollowedPage(props) {
    const { globalVariable, setGlobalVariable } = useGlobalContext()
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const [followersData, setFollowersData] = useState([])
    const [isLoadingItems, setIsLoadingItems] = useState(true)
    const [searchUsersModalIsVisible, setsearchUsersModalIsVisible] = useState(false)

    useEffect(() => {
        if(isFocused){
            fetchData()
        } 
    }, [isFocused, props.username])


    const fetchData = async () => {
        try {
          const response = await fetch( globalVariable.API_URL + 'getfollowedbyusername/' + props.username)
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          const jsonData = await response.json()
          setFollowersData(jsonData)
          setIsLoadingItems(false)
          
        } catch (error) {
          console.error('Followed page Error on getting the datas:', error)
          setIsLoadingItems(false)
        }
    }

    function onFollowerPressedHandler(usernameFollowed, nameFollowed, stateFollowed, likesFollowed, nOfFollowersFollowed){
        navigation.navigate('UserDetailPage', {usernameFollowed: usernameFollowed, nameFollowed: nameFollowed, stateFollowed: stateFollowed, likesFollowed: likesFollowed,
            nOfFollowersFollowed: nOfFollowersFollowed, isLoggedUserFollowing: true, loggedUsername: props.username})
    }

    function editState(state){
        if(state !== null){
            if(state.length > 35){
                const truncatedState = state.slice(0, 30)
                return truncatedState + "..."
            }
        }
        return state
    }

    function openSearchUsersModal(){
        setsearchUsersModalIsVisible(true)
    }

    function closeSearchUsersModal(){
        setsearchUsersModalIsVisible(false)
    }
    
    return (
        isLoadingItems ?
            <View style={[styles.loadingContainer, {backgroundColor: globalVariable.backgroundColor}]}>
                <ActivityIndicator size="large"  color="#0000ff"/>
            </View>
        :  
        <>
            <SearchUsers 
                    visible={searchUsersModalIsVisible}
                    closeModal={closeSearchUsersModal}
                    loggedUsername={props.username}
                />
            <ScrollView style={[styles.container, {backgroundColor: globalVariable.backgroundColor}]}>
                {
                    followersData.length === 0 ?
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>You don't follow anyone!</Text>
                        </View>
                    :
                    <View style={styles.ItemsContainer}>
                        {followersData.map((item) => (
                        <View key={item.id}>
                            <FollowedItem 
                                username={item.usernameFollowed}
                                name={item.name} 
                                profilePic={{ uri: globalVariable.API_URL + 'getusericonbyusername/' + item.usernameFollowed + globalVariable.randomStringToUpdate }} 
                                state={editState(item.state)}
                                onFollowerPressed={() => onFollowerPressedHandler(item.usernameFollowed, item.name, item.state, item.likes, item.followers)}
                            />
                        </View>
                        ))}
                    </View>
                }
            </ScrollView>
            <View style={[styles.bottomFiller, {backgroundColor: globalVariable.backgroundColor}]}></View>
            <Pressable 
                style={({ pressed }) => [
                    styles.floatingButton,
                    {backgroundColor: globalVariable.buttonColor},
                    pressed && { opacity: 0.8, backgroundColor: '#929292' }
                ]} 
                onPress={() => openSearchUsersModal()} 
                >
                <Text style={styles.buttonText}>Search Users</Text>
            </Pressable>
        </>
    )
}

export default FollowedPage

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
    container: {
        backgroundColor: '#e9e7e7',
        flex: 1
    },
    bottomFiller: {
        height: 70,
    },
    ItemsContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 13,
        ...shadowStyle
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
        paddingLeft: 30,
        paddingRight: 30,
    },
    text: {
        fontSize: 18,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        width: 200,
        borderWidth: 2,
        paddingVertical: 10,
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        elevation: 3,
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
    },
})