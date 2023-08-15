import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native'
import UserEncyclopedia from './UserEncyclopedia'
import DetailUserHeaderBar from '../headerBars/DetailUserHeaderBar'
import UserUpperInfos from './UserUpperInfos'
import { Feather } from '@expo/vector-icons'
import { API_URL } from '../../env'
import { useRoute } from "@react-navigation/native"
import { useNavigation } from "@react-navigation/native"

function UserDetailPage(){
  const navigation = useNavigation()
  const route = useRoute()
  const props = route.params

  const [likes, setLikes] = useState(props.likes)
  const [followers, setFollowers] = useState(props.followers)
  const [isLoggedUserFollowing, setIsLoggedUserFollowing] = useState(props.isLoggedUserFollowing)

  useEffect(() => {
    console.log(props)
    setLikes(props.likes)
  }, [props.likes, props.isLoggedUserFollowing])

  useEffect(() => {
    setFollowers(props.followers)
  }, [props.followers])

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
      await fetch(API_URL + 'removefollower', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ usernameFollower: props.loggedUsername, usernameFollowed: props.usernameFollowed })
      });
    }else{
      addFollowerToCounter()
      await fetch(API_URL + 'addfollower', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ usernameFollower: props.loggedUsername, usernameFollowed: props.usernameFollowed })
      });
    }
    setIsLoggedUserFollowing(!isLoggedUserFollowing)
  }

  function getUserDetails(){
    return(
      <>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <DetailUserHeaderBar 
              userName={props.name} 
              userAvatar={{ uri: API_URL + 'getuserbyusername/' + props.loggedUsername + '/' + props.usernameFollowed }} 
              onBackButtonPress={() => navigation.goBack()}
            />
          </View>
          <ScrollView style={styles.scrollViewcontainer}>
            <UserUpperInfos state={props.state} likes={likes} followers={followers}/>
            <UserEncyclopedia 
              username={props.loggedUsername} 
              usernameFollowed={props.usernameFollowed} 
              name={props.name} 
              addLikeToCounter={addLikeToCounter} 
              removeLikeToCounter={removeLikeToCounter}
            />
            <View style={styles.bottomFiller}></View>
          </ScrollView>
          <Pressable 
            style={({ pressed }) => [
              styles.floatingButton,
              pressed && { opacity: 0.8 }
            ]}
            onPress={followAndUnfollowButtonHandler} 
          >
            {
              isLoggedUserFollowing ? 
              <>
                <Text style={styles.buttonText}>Unfollow</Text>
                <Feather
                    name={"user-minus"}
                    size={32}
                    color={"red"}
                    style={styles.heart}
                />
              </>
              :
              <>
                <Text style={styles.buttonText}>Follow</Text>
                <Feather
                    name={"user-plus"}
                    size={32}
                    color={"green"}
                    style={styles.heart}
                />
              </>
            }
          </Pressable>
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
  scrollViewcontainer: {
    backgroundColor: '#e9e7e7',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 40,
    width: 200,
    height: 70,
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