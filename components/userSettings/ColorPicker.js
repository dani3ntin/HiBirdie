import { View, Text, StyleSheet, ScrollView, Pressable} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useGlobalContext } from "../globalContext/GlobalContext"

function ColorPicker() {
    const { globalVariable, setGlobalVariable } = useGlobalContext()

    async function pickColor(headerColor, backgroundColor, buttonColor){
        setGlobalVariable({backgroundColor: backgroundColor, headerColor: headerColor, buttonColor: buttonColor, API_URL: globalVariable.API_URL, randomStringToUpdate: '?' + (Math.random() * 100)})
        await AsyncStorage.setItem('applicationColor', JSON.stringify({backgroundColor: backgroundColor, headerColor: headerColor, buttonColor: buttonColor, 
            randomStringToUpdate: '?' + (Math.random() * 100)}))
    }

    return (
        <>
            <Text style={styles.text}>Select the color of the application:</Text>
            <View style={styles.rowContainer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.colorButtonPurple,
                        pressed && { backgroundColor: '#929292' }
                    ]} 
                    onPress={() => pickColor('#b8bdff', '#deeeff', '#bcc9ff')}
                    >
                </Pressable>
                <Pressable
                    style={({ pressed }) => [
                        styles.colorButtonGrey,
                        pressed && { backgroundColor: '#929292' }
                    ]} 
                    onPress={() => pickColor('#f2f2f2', '#d1cfcf', '#f3f3f3')}
                    >
                </Pressable>
                <Pressable
                    style={({ pressed }) => [
                        styles.colorButtonYellow,
                        pressed && { backgroundColor: '#929292' }
                    ]} 
                    onPress={() => pickColor('#f2e28e', '#f1ebca', '#f5d4be')}
                    >
                </Pressable>
                <Pressable
                    style={({ pressed }) => [
                        styles.colorButtonRed,
                        pressed && { backgroundColor: '#929292' }
                    ]} 
                    onPress={() => pickColor('#ff9a98', '#fdd8d8', '#fcb6b6')}
                    >
                </Pressable>
                <Pressable
                    style={({ pressed }) => [
                        styles.colorButtonGreen,
                        pressed && { backgroundColor: '#929292' }
                    ]} 
                    onPress={() => pickColor('#85D2D0', '#e0f2f1', '#acb9f3')}
                    >
                </Pressable>
            </View>
        </>
    )
}

export default ColorPicker

const shadowStyle = Platform.select({
    ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    android: {
        elevation: 8,
    },
    default: {},
})

const colorButton = StyleSheet.create({
    height: 40,
    width: 40,
    borderRadius: 50,
    borderColor: 'black',
    borderWidth: 5,
})

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
    },
    rowContainer: {
        flex: 1,
        marginTop: 20,
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'space-between',
    },
    colorButtonPurple: {
        ...colorButton,
        backgroundColor: '#b8bdff',
    },
    colorButtonGrey: {
        ...colorButton,
        backgroundColor: '#e9e7e7',
    },
    colorButtonYellow: {
        ...colorButton,
        backgroundColor: '#f2e28e',
    },
    colorButtonRed: {
        ...colorButton,
        backgroundColor: '#ff9a98',
    },
    colorButtonGreen: {
        ...colorButton,
        backgroundColor: '#85D2D0',
    },
})