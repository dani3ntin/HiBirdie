import { Text, StyleSheet, Pressable, Alert} from "react-native"
import { useState } from "react"
import { Input } from 'react-native-elements'
import { useGlobalContext } from "../globalContext/GlobalContext"

function ChangePasswordComponent(props) {
    const { globalVariable, setGlobalVariable } = useGlobalContext()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    function changePasswordButtonHandler(){
        const newValue = !props.changinPassword
        if(newValue === true)
            props.setChanginPassword(true)
        else{
            checkNewPasswordData()
        }
    }

    function checkNewPasswordData(){
        if(password === '') showAlert('Missing password', 'Please insert the password')
        else if(confirmPassword === '') showAlert('Missing confirm password', 'Please insert the confirm password')
        else if(password !== confirmPassword) showAlert('Different password and confirm password', 'Password and confirm password are different')
        else changePassword()
    }

    function showAlert(title, message){
        Alert.alert(
            title,
            message,
            [
              { text: 'OK'}
            ],
            { cancelable: true }
        )
    }

    async function changePassword(){
        let formData = new FormData()
        formData.append('password', password)
        formData.append('username', props.username)

        console.log(formData)
        
        try {
            const response = await fetch(globalVariable.API_URL + 'changepassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            })
            const jsonUserData = await response.json()
            if(response.ok){
                showAlert('Password changed', 'Password was successfully changed')
                props.setChanginPassword(false)
                setPassword('')
                setConfirmPassword('')
            }
            console.log(jsonUserData[0])
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <Pressable
                style={({ pressed }) => [
                    styles.changePasswordButton,
                    pressed && { backgroundColor: '#929292' }
                ]} 
                onPress={() => changePasswordButtonHandler()}
                >
                {
                    props.changinPassword ? 
                    <Text style={styles.textPickPhotoPressable}>Confirm new password</Text>
                    :
                    <Text style={styles.textPickPhotoPressable}>Change your password</Text>
                }
            </Pressable>
            {
                props.changinPassword ?
                <>
                    <Pressable
                        style={({ pressed }) => [
                            styles.changePasswordButton,
                            pressed && { backgroundColor: '#929292' }
                        ]} 
                        onPress={() => props.setChanginPassword(false)}
                        >
                        <Text style={styles.textPickPhotoPressable}>Cancel</Text>
                    </Pressable>
                    <Input
                        placeholder='Insert password'
                        errorStyle={{ color: 'red' }}
                        label='Password'
                        multiline={true}
                        value={password}
                        onChangeText={text => setPassword(text)}
                        maxLength={200}
                        disabled={props.changinPassword === true ? false : true}
                    />
                    <Input
                        placeholder='Insert confirm password'
                        errorStyle={{ color: 'red' }}
                        label='Confirm password'
                        multiline={true}
                        value={confirmPassword}
                        onChangeText={text => setConfirmPassword(text)}
                        maxLength={200}
                    />
                </>
                :null
            }
        </>
    )
}

export default ChangePasswordComponent

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

})