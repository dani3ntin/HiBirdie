import { Modal, View, Text, Pressable, StyleSheet, TextInput, FlatList,KeyboardAvoidingView, Platform } from 'react-native'
import { useState } from 'react'
import FollowedItem from '../items/FollowedItem'
import { useNavigation } from '@react-navigation/native'
import { useGlobalContext } from '../globalContext/GlobalContext'

function SearchUsers(props) {
  const navigation = useNavigation()
  const [searchText, setSearchText] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const { globalVariable, setGlobalVariable } = useGlobalContext()

  function closeModal() {
      props.closeModal();
  }

  function handleModalPress(e) {
      e.stopPropagation();
  }

  async function textChangedHandler(text){
    if(text===''){
      setSearchResult([])
      setSearchText('')
    }else{
      setSearchText(text)
      const response = await fetch( globalVariable.API_URL + 'searchuserbyusername/' + text + '/' + props.loggedUsername)
      const jsonData = await response.json()
      setSearchResult(jsonData)
    }
  }

  function onFollowerPressedHandler(usernameFollowed, nameFollowed, stateFollowed, likesFollowed, nOfFollowersFollowed, isLoggedUserFollowing){
    navigation.navigate('UserDetailPage', {usernameFollowed: usernameFollowed, nameFollowed: nameFollowed, stateFollowed: stateFollowed, likesFollowed: likesFollowed,
      nOfFollowersFollowed: nOfFollowersFollowed, isLoggedUserFollowing: isLoggedUserFollowing, loggedUsername: props.loggedUsername})
    console.log(props.loggedUsername)
    closeModal()
  }

  const renderItem = ({item}) => (
    <FollowedItem 
      username={item.username}
      name={item.name} 
      profilePic={{ uri: globalVariable.API_URL + 'getusericonbyusername/' + item.username }}
      onFollowerPressed={() => onFollowerPressedHandler(item.username, item.name, item.state, item.likes, item.followers, item.isLoggedUserFollowing)}
    />
  )

  return (
    <Modal
      visible={props.visible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <Pressable style={styles.modalContainer} onPress={closeModal}>
        <View style={styles.overlay} />
        <FlatList
          data={searchResult}
          renderItem={renderItem}
          keyExtractor={item => item.username}
          inverted
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContent}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={handleModalPress}>
            <View style={styles.inputContainer}>
              <Text style={styles.text}>Search a user:</Text>
              <View style={styles.rowContainer}>
                <Text style={styles.at}>@</Text>
                  <TextInput
                      placeholder='Insert username'
                      errorStyle={{ color: 'red' }}
                      label='User name'
                      value={searchText}
                      onChangeText={text => textChangedHandler(text)}
                      maxLength={20}
                      style={styles.searchTextInput}
                  />
              </View>
            </View>
          </View>
          <Pressable 
            style={({ pressed }) => [
                styles.closeButton,
                {backgroundColor: globalVariable.buttonColor},
                pressed && { backgroundColor: '#929292' }
            ]}
            onPress={closeModal}
          >
            <Text style={styles.text}>Close</Text>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

export default SearchUsers

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black color
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  inputContainer: {
    paddingBottom: 20,
  },
  searchTextInput: {
    fontSize: 18,
    backgroundColor: '#edebeb',
    borderRadius: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 5,
    width: '90%'
  },
  text: {
    fontSize: 18
  },
  at: {
    paddingTop: 10,
    fontSize: 18,
  },
  rowContainer: {
    paddingTop: 10,
    flexDirection: 'row',
  },
  closeButton: {
    bottom: 20,
    width: 150,
    height: 70,
    borderWidth: 2,
    paddingVertical: 10,
    borderColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
});