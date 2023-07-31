import { View, Text, StyleSheet, Pressable, Image} from "react-native"

function BirdItem(props) {
    return (
        <View style={styles.goalItem}>
            <Pressable 
                style={({pressed}) => pressed && styles.pressedItem}
            >
                <View style={styles.itemContent}>
                    <Image
                        source={props.icon}
                        style={styles.avatar}
                    />
                    <View>
                        <Text style={styles.birdName}>{props.text}</Text>
                        <Text style={styles.birdPhotoDate}>{"Photographed on: " + props.date}</Text>
                    </View>
                </View>
            </Pressable>
        </View>
    )
}

export default BirdItem

const styles = StyleSheet.create({
    goalItem: {
        margin: 5,
        borderRadius: 6,
        backgroundColor: 'white',
        height: 60,
    },
    BirdInfo: {
        flexDirection: 'column'
    },
    birdName: {
        color: 'black',
        paddingTop: 8,
        paddingLeft: 8,
        fontSize: 20,
        fontWeight: 'bold',
    },
    birdPhotoDate: {
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