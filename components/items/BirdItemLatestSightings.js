import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Image} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

function BirdItemLatestSightings(props) {
    const [liked, setLiked] = useState(false)
    const [likeNumber, setLikeNumber] = useState(props.likes)
    const APIPrefix = 'http://192.168.1.249:8000/api/'

    async function onPressLikeHandler(){
        const newValue = !liked
        setLiked(newValue)
        if(newValue === true){
            setLikeNumber(likeNumber + 1)
            await fetch(APIPrefix + 'addlikebyid/' + props.id)
            console.log('like aggiunto')
        }else{
            setLikeNumber(likeNumber - 1)
            await fetch(APIPrefix + 'deletelikebyid/' + props.id)
            console.log('like tolto')
        }
    }

    function onBirdPressedHandler(){
        props.onBirdPressed(props.id)
    }

    return (
        <View style={styles.birdItem}>
            <Pressable 
                style={({pressed}) => pressed && styles.pressedItem}
                onPress={onBirdPressedHandler}
            >
                <View style={styles.itemContent}>
                    <Image
                        source={props.image}
                        style={styles.avatar}
                    />
                    <View style={styles.nameAndAuthor}>
                        <Text style={styles.birdName}>{props.name}</Text>
                        <Text style={styles.author}>{"Photographed by: " + props.author}</Text>
                    </View>
                    <View style={styles.heartContainer}>
                        <Text style={styles.likesNumber}>{likeNumber}</Text>
                        <Pressable onPress={() => onPressLikeHandler()}>
                            <MaterialCommunityIcons
                                name={liked ? "heart" : "heart-outline"}
                                size={32}
                                color={liked ? "red" : "black"}
                            />
                        </Pressable>
                    </View>
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
    }, 
    heartContainer : {
        flexDirection: 'row',
    },
    likesNumber: {
        fontSize: 17,
        paddingRight: 4,
        paddingTop: 3,
    }
})