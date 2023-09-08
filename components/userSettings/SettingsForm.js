import { StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Input } from 'react-native-elements'

function SettingsForm(props) {
    const navigation = useNavigation()

    return (
        <>
            {
                props.editButtonText === 'Edit' ?
                <Input
                    errorStyle={{ color: 'red' }}
                    label='Username (uneditable)'
                    multiline={true}
                    value={props.username}
                    maxLength={200}
                    disabled
                />
                : null
            }
            <Input
                placeholder='Insert your name'
                errorStyle={{ color: 'red' }}
                label='Name'
                value={props.name}
                onChangeText={text => props.setName(text)}
                maxLength={30}
                disabled={props.editButtonText === 'Edit' ? true : false}
            />
            {
                props.editButtonText === 'Edit' ?
                <Input
                    errorStyle={{ color: 'red' }}
                    label='Email (uneditable)'
                    multiline={true}
                    value={props.email}
                    maxLength={200}
                    disabled
                />
                : null
            }
            <Input
                placeholder='Insert your state'
                errorStyle={{ color: 'red' }}
                label='State'
                multiline={true}
                value={props.state}
                onChangeText={text => props.setState(text)}
                maxLength={200}
                disabled={props.editButtonText === 'Edit' ? true : false}
            />
        </>
    )
}

export default SettingsForm

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