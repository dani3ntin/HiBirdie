import { View, Text, Pressable } from 'react-native'

function EditBirdButton(props){

    function onDeletePress(){
        props.handleDeletePress()
    }

    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 20}}>
            <Pressable
                onPress={onDeletePress}
                style={({ pressed }) => [
                {
                    backgroundColor: pressed ? '#697ef5' : '#cbd2fa',
                    padding: 10,
                    borderRadius: 10,
                    width: '80%',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    borderWidth: 3,
                    borderColor: 'black',
                },]}
            >
                {({ pressed }) => (
                <Text style={{ color: pressed ? 'black' : 'black', fontSize: 15 }}>
                    Edit this bird
                </Text>
                )}
            </Pressable>
        </View>
    )
}

export default EditBirdButton
