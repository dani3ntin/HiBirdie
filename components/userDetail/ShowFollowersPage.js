import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView, Pressable, Text, BackHandler, ActivityIndicator } from 'react-native'
import GeneralPurposeHeaderBar from '../headerBars/GeneralPurposeHeaderBar'
import { useRoute } from "@react-navigation/native"
import { useNavigation } from "@react-navigation/native"
import { useGlobalContext } from '../globalContext/GlobalContext'
import FollowedItem from '../items/FollowedItem'

function ShowLikesPage(){
    const { globalVariable, setGlobalVariable } = useGlobalContext()
    const navigation = useNavigation()
    const route = useRoute()
    const props = route.params
    const [isLoadingItems, setIsLoadingItems] = useState(true)
    const [followersData, setFollowersData] = useState(true)

    useEffect(() => {
        fetchData()
        console.log(props)
    }, [])

    async function fetchData(){
        try {
            const response = await fetch( globalVariable.API_URL + 'getfollowersbyusername/' + props.usernameFollowed + '/' + props.loggedUsername)
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

    function editState(state){
        if(state !== null){
            if(state.length > 35){
                const truncatedState = state.slice(0, 30)
                return truncatedState + "..."
            }
        }
        return state
    }

    function onFollowerPressedHandler(usernameFollowed, nameFollowed, stateFollowed, likesFollowed, nOfFollowersFollowed, isLoggedUserFollowing){
        navigation.replace('UserDetailPage', {usernameFollowed: usernameFollowed, nameFollowed: nameFollowed, stateFollowed: stateFollowed, likesFollowed: likesFollowed,
            nOfFollowersFollowed: nOfFollowersFollowed, isLoggedUserFollowing: isLoggedUserFollowing, loggedUsername: props.loggedUsername})
    }

    function getHeaderBarText(){
        if(props.usernameFollowed === props.loggedUsername) return 'My followers'
        else return props.nameFollowed + '\'s followers'
    }

  function getUserDetails(){
    return(
        <View style={[styles.container, {backgroundColor: globalVariable.backgroundColor}]}>
            <View style={styles.headerContainer}>
                <GeneralPurposeHeaderBar text={getHeaderBarText()}
                onBackButtonPress={() => navigation.goBack()}
                />
            </View>
            {
                isLoadingItems ?
                    <View style={[styles.loadingContainer, {backgroundColor: globalVariable.backgroundColor}]}>
                        <ActivityIndicator size="large"  color="#0000ff"/>
                    </View>
                :  
                <>
                    <View style={[styles.container, {backgroundColor: globalVariable.backgroundColor}]}>
                        <ScrollView style={[styles.container, {backgroundColor: globalVariable.backgroundColor}]}>
                            {
                                followersData.length === 0 ?
                                    <View style={styles.textContainer}>
                                        <Text style={styles.text}>No one is following!</Text>
                                    </View>
                                :
                                <View style={styles.ItemsContainer}>
                                    {followersData.map((item) => (
                                    <View key={item.id}>
                                        <FollowedItem 
                                            username={item.usernameFollowed}
                                            name={item.name} 
                                            profilePic={{ uri: globalVariable.API_URL + 'getuserbyusername/' + item.usernameFollowed + '/' + item.username + globalVariable.randomStringToUpdate }} 
                                            state={editState(item.state)}
                                            onFollowerPressed={() => onFollowerPressedHandler(item.username, item.name, item.state, item.likes, item.followers, item.isLoggedUserFollowing)}
                                        />
                                    </View>
                                    ))}
                                </View>
                            }
                        </ScrollView>
                    </View>
                </>
            }
        </View>
    )
  }

    return(
        <>
        {
            getUserDetails()
        }
        </>
    )
}

export default ShowLikesPage

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  container: {
    flex: 1,
  },
  headerContainer: {
    height: '8%'
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingLeft: 30,
    paddingRight: 30,
},
  floatingButton: {
    position: 'absolute',
    bottom: 40,
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
    flexDirection: 'row',
  },
})