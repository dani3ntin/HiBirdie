import React, { useState, useEffect } from 'react'
import { View, Modal, StyleSheet, ScrollView } from 'react-native'
import UserEncyclopedia from './UserEncyclopedia'
import DetailUserHeaderBar from '../headerBars/DetailUserHeaderBar'
import UserUpperInfos from './UserUpperInfos'

function UserDetailPage(props){

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
          <ScrollView style={styles.scrollViewcontainer}>
            <UserUpperInfos state={props.state} likes={props.likes} followers={props.followers}/>
            <UserEncyclopedia username={props.loggedUsername} usernameFollowed={props.usernameFollowed} name={props.name}/>
          </ScrollView>
        </View>
      </>
    )
  }

  return(
      <Modal visible={props.visible} animationType='slide' onRequestClose={closeModal}>
      {
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
  scrollViewcontainer: {
    backgroundColor: '#e9e7e7',
},
})