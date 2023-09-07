import { Text, StyleSheet, Pressable, Alert} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"

function LogoutComponent(props) {
    const navigation = useNavigation()
    
    function logoutAlert(){
        Alert.alert(
            'Confirm logout',
            'Are you sure you want to log out?',
            [
            { text: 'Cancel', },
            { text: 'Yes', onPress: () => logout() }
            ],
            { cancelable: true }
        )
    }

    async function logout(){
        await AsyncStorage.clear()
        navigation.navigate('IntroPage')
    }

    return (
        <>
            <Pressable
                style={({ pressed }) => [
                    styles.logoutButton,
                    pressed && { backgroundColor: '#929292' }
                ]} 
                onPress={() => logoutAlert()}
                >
                <Text style={styles.textPickPhotoPressable}>Logout</Text>
            </Pressable>
        </>
    )
}

export default LogoutComponent

const styles = StyleSheet.create({
    changePasswordButton: {
        backgroundColor: '#dfdfdf',
        borderColor: 'black',
        borderWidth: 2,
        height: 50,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    textPickPhotoPressable: {
        fontSize: 18,
    },
    logoutButton: {
        backgroundColor: '#ffb3b3',
        borderColor: 'black',
        borderWidth: 2,
        height: 50,
        marginLeft: 40,
        marginRight: 40,
        marginBottom: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
})