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
                    backgroundColor: pressed ? '#f56d6d' : '#facbcb',
                    padding: 10,
                    borderRadius: 10,
                    width: '80%',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    borderWidth: 3,
                    borderColor: 'black',
                    height: 70,
                },]}
            >
                {({ pressed }) => (
                <Text style={{ color: pressed ? 'black' : 'black', fontSize: 18 }}>
                    Delete this bird
                </Text>
                )}
            </Pressable>
        </View>
    )
}

export default DeleteBirdButton
