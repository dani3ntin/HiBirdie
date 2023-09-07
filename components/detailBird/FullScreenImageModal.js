import { View, StyleSheet, Pressable, Text, Image, Modal} from "react-native"
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view"
import { useGlobalContext } from "../globalContext/GlobalContext"

function FullScreenImageModal(props) {
    const { globalVariable, setGlobalVariable } = useGlobalContext()

    return (
        <Modal
            visible={true}
            transparent={false}
            onRequestClose={() => props.closeModal()}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                <ReactNativeZoomableView
                    maxZoom={5}
                    minZoom={1}
                    zoomStep={0.5}
                    initialZoom={1}
                    bindToBorders={true}
                    captureEvent
                >
                    <Image
                        source={{ uri: props.image }}
                        style={{ width: props.width, height: props.height }}
                    />
                </ReactNativeZoomableView>
                <Pressable 
                    style={({ pressed }) => [
                        styles.floatingButton,
                        {backgroundColor: globalVariable.buttonColor},
                        pressed && { backgroundColor: '#929292' }
                    ]} 
                    onPress={() => props.closeModal()} 
                    >
                    <Text style={styles.buttonText}>Close full screen image</Text>
                </Pressable>
            </View>
        </Modal>
        )
}

export default FullScreenImageModal

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: 20,
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
    },
})