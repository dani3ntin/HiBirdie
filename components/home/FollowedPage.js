import { View, Text, StyleSheet, ScrollView} from "react-native"
import { useIsFocused } from '@react-navigation/native'
import FollowedItem from "../items/FollowedItem"
import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ActivityIndicator } from "react-native"
import UserDetailPage from "../userDetail/UserDetailPage"

function FollowedPage(props) {
    const isFocused = useIsFocused()
    const [username, setUsername] = useState(null)
    const [followersData, setFollowersData] = useState([])
    const [isLoadingItems, setIsLoadingItems] = useState(true)
    const [detailFollowerModalIsVisible, setDetailFollowerModalIsVisible] = useState(false)
    const [followerIdForDetailBirdModal, setFollowerIdForDetailBirdModal] = useState(-1)

    useEffect(() => {
        if(isFocused){
            settingUsername()
            fetchData()
        } 
    }, [isFocused, username])

    async function settingUsername(){
        const storedUserData = await AsyncStorage.getItem('userData')
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData)
          setUsername(parsedUserData.username)
        }
    }

    const fetchData = async () => {
        try {
          const response = await fetch('http://192.168.1.249:8000/api/getfollowedbyusername/' + username)
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          const jsonData = await response.json()
          setFollowersData(jsonData)
          setIsLoadingItems(false)
          
        } catch (error) {
          console.error('Error on getting the datas:', error)
          setIsLoadingItems(false)
        }
    }

    function onFollowerPressedHandler(usernameFollowed){
        setFollowerIdForDetailBirdModal(usernameFollowed)
        setDetailFollowerModalIsVisible(true)
    }

    function closeUserDetailModal(){
        setDetailFollowerModalIsVisible(false)
    }

    function editState(state){
        if(state.length > 35){
            const truncatedState = state.slice(0, 35)
            return truncatedState + "..."
        }
        return state
    }
    
    return (
        isLoadingItems ?
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large"  color="#0000ff"/>
            </View>
        :
        <>
            <UserDetailPage 
                visible={detailFollowerModalIsVisible} 
                closeModal={closeUserDetailModal}
                username={followerIdForDetailBirdModal}
            />
            <ScrollView style={styles.container}>
                {
                    <View style={styles.ItemsContainer}>
                        {followersData.map((item) => (
                        <View key={item.id}>
                            <FollowedItem 
                                username={item.usernameFollowed}
                                name={item.name} 
                                profilePic={{ uri: 'http://192.168.1.249:8000/api/getuserbyusername/' + item.usernameFollowed }} 
                                state={editState(item.state)}
                                onFollowerPressed={() => onFollowerPressedHandler(item.usernameFollowed)}
                            />
                        </View>
                        ))}
                    </View>
                }
            </ScrollView>
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
})