import { View, Text, StyleSheet, Image} from "react-native"
import { approximateNumberOfDays, calculateDifferenceBetweenTwoDates } from "../items/itemsUtils/FriendItemUtils"

function AuthorPressable(props) {

    const today = new Date()

    return (
        <View style={styles.friendItem}>
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
        </View>
    )
}

export default AuthorPressable

const styles = StyleSheet.create({
    friendItem: {
        borderRadius: 6,
        backgroundColor: '#e9e7e7',
        height: 70,
        borderBlockColor: 'black',
        borderWidth: 1,
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
        alignItems: 'center',
    }
})