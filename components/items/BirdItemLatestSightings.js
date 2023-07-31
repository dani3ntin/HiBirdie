import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Image} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

function BirdItemLatestSightings(props) {
    const [liked, setLiked] = useState(false);

    return (
        <View style={styles.birdItem}>
            <Pressable 
                onPress={() => console.log(props.name)}
                style={({pressed}) => pressed && styles.pressedItem}
            >
                <View style={styles.itemContent}>
                    <Image
                        source={props.icon}
                        style={styles.avatar}
                    />
                    <View style={styles.nameAndAuthor}>
                        <Text style={styles.birdName}>{props.name}</Text>
                        <Text style={styles.author}>{"Photographed by: " + props.author}</Text>
                    </View>
                    <Pressable onPress={() => setLiked((isLiked) => !isLiked)}>
                        <MaterialCommunityIcons
                            name={liked ? "heart" : "heart-outline"}
                            size={32}
                            color={liked ? "red" : "black"}
                        />
                    </Pressable>
                </View>
            </Pressable>
        </View>
    )
}

export default BirdItemLatestSightings

const styles = StyleSheet.create({
    birdItem: {
        flex: 1,
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
    author: {
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
        justifyContent: 'space-between',
        paddingRight: 10,
    },
    nameAndAuthor: {
       flex: 1
    }
})