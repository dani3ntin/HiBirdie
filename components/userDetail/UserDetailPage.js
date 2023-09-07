import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView, Pressable, Text, BackHandler } from 'react-native'
import UserEncyclopedia from './UserEncyclopedia'
import DetailUserHeaderBar from '../headerBars/DetailUserHeaderBar'
import UserUpperInfos from './UserUpperInfos'
import { Feather } from '@expo/vector-icons'
import { useRoute } from "@react-navigation/native"
import { useNavigation } from "@react-navigation/native"
import { useGlobalContext } from '../globalContext/GlobalContext'

function UserDetailPage(){
  const { globalVariable, setGlobalVariable } = useGlobalContext()
  const navigation = useNavigation()
  const route = useRoute()
  const props = route.params

  const [likes, setLikes] = useState(props.likesFollowed)
  const [followers, setFollowers] = useState(props.nOfFollowersFollowed)
  const [isLoggedUserFollowing, setIsLoggedUserFollowing] = useState(props.isLoggedUserFollowing)
  const followButton = getFollowButton()

  useEffect(() => {
      const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
      );
      return () => backHandler.remove()
  }, [])
    
  const handleBackPress = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true
      }
      return false
  }


  function followersButtonPressedHandler(){
    navigation.navigate('ShowFollowersPage', {usernameFollowed: props.usernameFollowed, nameFollowed: props.nameFollowed, loggedUsername: props.loggedUsername})
  }

  function likesButtonPressedHandler(){
    navigation.navigate('ShowLikesPage', {usernameFollowed: props.usernameFollowed, nameFollowed: props.nameFollowed, loggedUsername: props.loggedUsername})
  }

  useEffect(() => {
    console.log(props)
    setLikes(props.likesFollowed)
  }, [props.likesFollowed, props.isLoggedUserFollowing])

  useEffect(() => {
    setFollowers(props.nOfFollowersFollowed)
  }, [props.nOfFollowersFollowed])

  useEffect(() => {
    setIsLoggedUserFollowing(props.isLoggedUserFollowing)
  }, [props.isLoggedUserFollowing])

  function addLikeToCounter(){
    setLikes(likes + 1)
  }

  function removeLikeToCounter(){
    setLikes(likes - 1)
  }

  function addFollowerToCounter(){
    setFollowers(followers + 1)
  }

  function removeFollowerToCounter(){
    setFollowers(followers - 1)
  }

  async function followAndUnfollowButtonHandler(){
    if(isLoggedUserFollowing === true){
      removeFollowerToCounter()
      await fetch(globalVariable.API_URL + 'removefollower', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ usernameFollower: props.loggedUsername, usernameFollowed: props.usernameFollowed })
      });
    }else{
      addFollowerToCounter()
      await fetch(globalVariable.API_URL + 'addfollower', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ usernameFollower: props.loggedUsername, usernameFollowed: props.usernameFollowed })
      });
    }
    setIsLoggedUserFollowing(!isLoggedUserFollowing)
  }

  function getFollowButton(){
    if(props.loggedUsername !== props.usernameFollowed)
      if(isLoggedUserFollowing){
        return(
          <Pressable 
            style={({ pressed }) => [
              styles.floatingButton,
              pressed && { opacity: 0.8 }
            ]}
            onPress={followAndUnfollowButtonHandler} 
          >
            <Text style={styles.buttonText}>Unfollow</Text>
            <Feather
                name={"user-minus"}
                size={32}
                color={"red"}
                style={styles.heart}
            />
          </Pressable>
        )
      }
      else{
        return (
          <Pressable 
            style={({ pressed }) => [
              styles.floatingButton,
              pressed && { opacity: 0.8 }
            ]}
            onPress={followAndUnfollowButtonHandler} 
          >
          <Text style={styles.buttonText}>Follow</Text>
          <Feather
              name={"user-plus"}
              size={32}
              color={"green"}
              style={styles.heart}
          />
          </Pressable>
        )
      }
    else
      return null
  }

  function getUserDetails(){
    return(
      <>
        <View style={[styles.container, {backgroundColor: globalVariable.backgroundColor}]}>
          <View style={styles.headerContainer}>
            <DetailUserHeaderBar 
              username={props.usernameFollowed}
              name={props.nameFollowed} 
              userAvatar={{ uri: globalVariable.API_URL + 'getusericonbyusername/' + props.usernameFollowed }} 
              onBackButtonPress={() => navigation.goBack()}
            />
          </View>
          <ScrollView>
            <UserUpperInfos state={props.stateFollowed} likes={likes} followers={followers} loggedUsername={props.loggedUsername} usernameFollowed={props.usernameFollowed} 
            includeImage={true} followersButtonPressed={followersButtonPressedHandler} likesButtonPressed={likesButtonPressedHandler}/>
            <UserEncyclopedia 
              username={props.loggedUsername} 
              usernameFollowed={props.usernameFollowed} 
              name={props.nameFollowed} 
              addLikeToCounter={addLikeToCounter} 
              removeLikeToCounter={removeLikeToCounter}
            />
            <View style={styles.bottomFiller}></View>
          </ScrollView>
          {
            followButton
          }
        </View>
      </>
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

export default UserDetailPage

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
  container: {
    flex: 1,
  },
  headerContainer: {
    height: '8%'
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
  buttonText: {
    color: 'black',
    fontSize: 20,
    paddingRight: 10,
    fontWeight:'bold',
  },
  bottomFiller: {
    height: 120
  },
})