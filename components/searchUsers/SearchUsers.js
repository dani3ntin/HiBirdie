import { Modal, View, Text, Pressable, StyleSheet, TextInput, FlatList } from 'react-native'
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

  function editState(state){
    if(state !== null){
        if(state.length > 35){
            const truncatedState = state.slice(0, 30)
            return truncatedState + "..."
        }
    }
    return state
}

  async function textChangedHandler(text){
    if(text===''){
      setSearchResult([])
      setSearchText('')
    }else{
      setSearchText(text)
      const response = await fetch( globalVariable.API_URL + 'searchuserbyusername/' + text)
      const jsonData = await response.json()
      setSearchResult(jsonData)
    }
  }

  function onFollowerPressedHandler(usernameFollowed, nameFollowed, stateFollowed, likesFollowed, nOfFollowersFollowed, isLoggedUserFollowing){
    navigation.navigate('UserDetailPage', {usernameFollowed: usernameFollowed, name: nameFollowed, state: stateFollowed, likes: likesFollowed,
    followers: nOfFollowersFollowed, isLoggedUserFollowing: isLoggedUserFollowing, loggedUsername: props.loggedUsername})
    console.log(props.loggedUsername)
    closeModal()
  }

  const renderItem = ({item}) => (
    <FollowedItem 
      username={item.username}
      name={item.name} 
      profilePic={{ uri: globalVariable.API_URL + 'getuserbyusername/' + item.username + '/' + item.username }}
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
        <View style={styles.modalContent} onStartShouldSetResponder={handleModalPress}>
          <View style={styles.maximumSightingDays}>
            <Text style={styles.text}>Search a user:</Text>
            <View style={styles.rowContainer}>
              <Text style={styles.text}>@</Text><TextInput
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
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  maximumSightingDays: {
    paddingBottom: 20
  },
  searchTextInput: {
    fontSize: 18
  },
  text: {
    fontSize: 18
  },
  rowContainer: {
    flexDirection: 'row',
},
});