import { View, Text, StyleSheet, Pressable, Image} from "react-native"

function FollowedItem(props) {
    const today = new Date()

    function onFollowerPressedHandler(){
        props.onFollowerPressed(props.id)
    }

    return (
        <View style={styles.friendItem}>
            <Pressable
                onPress={onFollowerPressedHandler}
                style={({pressed}) => pressed && styles.pressedItem}
            >
                <View style={styles.itemContent}>
                    <Image
                        source={props.profilePic}
                        style={styles.avatar}
                    />
                    <View>
                        <Text style={styles.friendName}>{props.name}</Text>
                        {
                            props.state !== undefined ?
                            <Text style={styles.friendState}>{props.state}</Text>
                            :
                            <Text style={styles.friendUsername}>@{props.username}</Text>
                        }
                    </View>
                </View>
            </Pressable>
        </View>
    )
}

export default FollowedItem

const styles = StyleSheet.create({
    friendItem: {
        margin: 5,
        borderRadius: 6,
        backgroundColor: 'white',
        height: 60,
    },
    friendName: {
        color: 'black',
        paddingTop: 8,
        paddingLeft: 8,
        fontSize: 19,
        fontWeight: 'bold',
    },
    friendState: {
        color: 'black',
        paddingLeft: 8,
        fontSize: 15,
    },
    friendUsername: {
        color:'#0685c0',
        paddingLeft: 8,
        fontSize: 15,
    },
    pressedItem: {
        opacity: 0.5,
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 100,
        marginLeft: 5,
        marginTop: 5,
    },
    itemContent: {
        flexDirection: 'row',
    }
})