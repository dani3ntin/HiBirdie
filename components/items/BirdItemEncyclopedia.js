import { View, Text, StyleSheet, Pressable, Image} from "react-native"

function BirdItemEncyclopedia(props) {
    return (
        <View style={styles.birdItem}>
            <Pressable 
                style={({pressed}) => pressed && styles.pressedItem}
            >
                <View style={styles.itemContent}>
                    <Image
                        source={props.icon}
                        style={styles.avatar}
                    />
                    <View>
                        <Text style={styles.birdName}>{props.name}</Text>
                        <Text style={styles.birdPhotoDate}>{"Photographed on: " + props.date}</Text>
                    </View>
                </View>
            </Pressable>
        </View>
    )
}

export default BirdItemEncyclopedia

const styles = StyleSheet.create({
    birdItem: {
        margin: 5,
        borderRadius: 6,
        backgroundColor: 'white',
        height: 60,
    },
    birdName: {
        color: 'black',
        paddingTop: 8,
        paddingLeft: 8,
        fontSize: 19,
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