import { View, Text, StyleSheet, ScrollView} from "react-native"
import { useIsFocused } from '@react-navigation/native'
import FollowedItem from "../items/FollowedItem"
import { useState, useEffect } from "react"
import { ActivityIndicator } from "react-native"
import UserDetailPage from "../userDetail/UserDetailPage"

function FollowedPage(props) {
    const isFocused = useIsFocused()
    const [followersData, setFollowersData] = useState([])
    const [isLoadingItems, setIsLoadingItems] = useState(true)
    const [detailFollowerModalIsVisible, setDetailFollowerModalIsVisible] = useState(false)
    const [followerUsernameForDetailUserModal, setFollowerUsernameForDetailUserModal] = useState('')
    const [followerNameForDetailUserModal, setFollowerNameForDetailUserModal] = useState('')
    const [followerStateForDetailUserModal, setFollowerStateForDetailUserModal] = useState('')
    const [followerlikesForDetailUserModal, setFollowerLikesForDetailUserModal] = useState('')
    const [followerNumOfFollowersForDetailUserModal, setFollowerNumOfFollowersForDetailUserModal] = useState('')

    useEffect(() => {
        if(isFocused){
            fetchData()
        } 
    }, [isFocused, props.username])


    const fetchData = async () => {
        try {
          const response = await fetch('http://192.168.1.249:8000/api/getfollowedbyusername/' + props.username)
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

    function onFollowerPressedHandler(usernameFollowed, nameFollowed, stateFollowed, likesFollowed, nOfFollowersFollowed){
        setFollowerUsernameForDetailUserModal(usernameFollowed)
        setFollowerNameForDetailUserModal(nameFollowed)
        setFollowerStateForDetailUserModal(stateFollowed)
        setFollowerLikesForDetailUserModal(likesFollowed)
        setFollowerNumOfFollowersForDetailUserModal(nOfFollowersFollowed)
        setDetailFollowerModalIsVisible(true)
    }

    function closeUserDetailModal(){
        setDetailFollowerModalIsVisible(false)
        fetchData()
    }

    function editState(state){
        if(state.length > 35){
            const truncatedState = state.slice(0, 30)
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
                closeUserDetailModal={closeUserDetailModal}
                usernameFollowed={followerUsernameForDetailUserModal}
                name={followerNameForDetailUserModal}
                state={followerStateForDetailUserModal}
                likes={followerlikesForDetailUserModal}
                followers={followerNumOfFollowersForDetailUserModal}
                username={props.username}
                isLoggedUserFollowing={true}
                loggedUsername={props.username}
            />
            <ScrollView style={styles.container}>
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
                                profilePic={{ uri: 'http://192.168.1.249:8000/api/getuserbyusername/' + item.usernameFollowed }} 
                                state={editState(item.state)}
                                onFollowerPressed={() => onFollowerPressedHandler(item.usernameFollowed, item.name, item.state, item.likes, item.followers)}
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
    }
})