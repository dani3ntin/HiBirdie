import { Modal, View, Text, Dimensions, TouchableWithoutFeedback, StyleSheet } from "react-native"
import react from "react"

function FilterLatestSightingsPage(props){
    function closeModal(){
        props.closeModal()
    }

    return(
        <Modal visible={props.visible} animationType='fade' transparent={true} onRequestClose={closeModal}>
              <View style={styles.background}>
                {this.renderOutide}
            </View>
        </Modal>
    )
}

export default FilterLatestSightingsPage

const styles = StyleSheet.create({
    background: {
        flex: 1, 
        backgroundColor: '#000000AA', 
        justifyContent: 'flex-end'
    },
})