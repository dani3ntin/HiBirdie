import { Modal, View, Text, Pressable, StyleSheet, TextInput } from 'react-native'
import { useState } from 'react'

function SearchUsers(props) {
  const [searchText, setSearchText] = useState('')

  function closeModal() {
      props.closeModal();
  }

  function handleModalPress(e) {
      e.stopPropagation();
  }

  return (
    <Modal
      visible={props.visible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <Pressable style={styles.modalContainer} onPress={closeModal}>
        <View style={styles.overlay} />
        <View style={styles.modalContent} onStartShouldSetResponder={handleModalPress}>
            <View style={styles.maximumSightingDays}>
                <Text>Search a user:</Text>
                <TextInput
                    placeholder='Bird name'
                    errorStyle={{ color: 'red' }}
                    label='Bird name'
                    value={searchText}
                    onChangeText={text => setSearchText(text)}
                    maxLength={20}
                />
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
  }
});
