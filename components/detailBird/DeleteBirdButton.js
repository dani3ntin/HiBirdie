import { View, Text, Pressable } from 'react-native'

function DeleteBirdButton(props){

    function onDeletePress(){
        props.handleDeletePress()
    }

    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 20}}>
            <Pressable
                onPress={onDeletePress}
                style={({ pressed }) => [
                {
                    backgroundColor: pressed ? 'red' : '#fddddd',
                    padding: 10,
                    borderRadius: 10,
                    width: 200,
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    borderWidth: 3,
                    borderColor: 'red',
                },]}
            >
                {({ pressed }) => (
                <Text style={{ color: pressed ? 'black' : 'red', fontSize: 15 }}>
                    Delete this bird
                </Text>
                )}
            </Pressable>
        </View>
    )
}

export default DeleteBirdButton
