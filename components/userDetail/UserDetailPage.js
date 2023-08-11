import React, { useState, useEffect } from 'react'
import { View, Text, Modal, StyleSheet, ActivityIndicator } from 'react-native'
import BirdDetailPage from '../detailBird/BirdDetailPage'
import UserEncyclopedia from './UserEncyclopedia'
import DetailUserHeaderBar from '../headerBars/DetailUserHeaderBar'

function UserDetailPage(props){
  const [isLoadingFollowerData, setIsLoadingFollowerData] = useState(true)
  const [userInfo, setUserInfo] = useState([])

  useEffect(() => {
    fetchData()
  }, [props.username])


  const fetchData = async () => {
    if(props.username !== ''){
      try {
        const response = await fetch('http://192.168.1.249:8000/api/getuserbyusername/' + props.username)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const imageMetadata = JSON.parse(response.headers.get('imageInfos'))
        setUserInfo(imageMetadata)
        setIsLoadingFollowerData(false)
        
      } catch (error) {
        console.error('Error on getting the datas:', error)
        setIsLoadingFollowerData(false)
      }
    }
  }

  function closeModal(){
    props.closeUserDetailModal()
  }

  function getUserDetails(){
    return(
      <>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <DetailUserHeaderBar userName={props.name} userAvatar={{ uri: 'http://192.168.1.249:8000/api/getuserbyusername/' + (props.usernameFollowed) }} onBackButtonPress={closeModal}/>
          </View>
          <UserEncyclopedia username={props.username} usernameFollowed={props.usernameFollowed} name={props.name} state={props.state}/>
        </View>
      </>
    )
  }

  return(
      <Modal visible={props.visible} animationType='slide' onRequestClose={closeModal}>
      {
        isLoadingFollowerData ?
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large"  color="#0000ff"/>
        </View>
        :
        getUserDetails()
      }
    </Modal>
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
})