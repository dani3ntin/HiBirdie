import { View, Text, StyleSheet, Pressable, Image} from "react-native"
import { approximateNumberOfDays, calculateDifferenceBetweenTwoDates } from "./itemsUtils/FriendItemUtils"

function FriendItem(props) {
    const today = new Date()

    return (
        <View style={styles.friendItem}>
            <Pressable
                onPress={() => console.log(today)}
                style={({pressed}) => pressed && styles.pressedItem}
            >
                <View style={styles.itemContent}>
                    <Image
                        source={props.icon}
                        style={styles.avatar}
                    />
                    <View>
                        <Text style={styles.friendName}>{props.name}</Text>
                        <Text style={styles.friendState}>{"Last sighting: " + approximateNumberOfDays(calculateDifferenceBetweenTwoDates(today, props.dateLastSighting))}</Text>
                    </View>
                </View>
            </Pressable>
        </View>
    )
}

export default FriendItem

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