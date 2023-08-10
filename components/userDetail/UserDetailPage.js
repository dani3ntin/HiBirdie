import React, { useState } from 'react'
import { View, Text, Modal, StyleSheet, ActivityIndicator } from 'react-native'

function UserDetailPage(props){
    const [isLoadingFollowerData, setIsLoadingBirdData] = useState(true)

    function closeModal(){
      props.closeUserDetailModal()
    }

    return(
        <Modal visible={props.visible} animationType='slide' onRequestClose={closeModal}>
        {
          isLoadingFollowerData ?
          <View style={styles.loadingContainer}>
              <ActivityIndicator size="large"  color="#0000ff"/>
          </View>
          :
          getBirdDetails()
        }
      </Modal>
    )
}

export default UserDetailPage

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
})