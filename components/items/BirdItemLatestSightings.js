import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image, Button} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { approximateNumberOfDays, calculateDifferenceBetweenTwoDates } from "./itemsUtils/FriendItemUtils"
import { changeDateFormatYYYYDDMM } from "../utils/utils";

function BirdItemLatestSightings(props) {
    const today = new Date()
    const [liked, setLiked] = useState(props.userPutLike)
    const [likeNumber, setLikeNumber] = useState(props.likes)
    const APIPrefix = 'http://192.168.1.249:8000/api/'

    useEffect(() => {
        setLiked(props.userPutLike)
        setLikeNumber(props.likes)
    }, [props.userPutLike, props.likes])

    async function onPressLikeHandler(){
        const newValue = !liked
        setLiked(newValue)
        if(newValue === true){
            setLikeNumber(likeNumber + 1)
            await fetch(APIPrefix + 'addlike', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: props.loggedUsername, bird: props.id })
            });
        }else{
            setLikeNumber(likeNumber - 1)
            await fetch(APIPrefix + 'removelike', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: props.loggedUsername, bird: props.id })
            });
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
                        <Text style={styles.text}>{approximateNumberOfDays(calculateDifferenceBetweenTwoDates(today, changeDateFormatYYYYDDMM(props.sightingDate)))}</Text>
                        <Text style={styles.text}>{props.distance} km away from you</Text>
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
        marginBottom: 10,
        borderRadius: 6,
        backgroundColor: 'white',
        height: 70,
    },
    birdName: {
        color: 'black',
        paddingTop: 8,
        paddingLeft: 8,
        fontSize: 19,
        fontWeight: 'bold',
    },
    text: {
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
        paddingTop: 10,
        flexDirection: 'row',
    },
    likesNumber: {
        fontSize: 17,
        paddingRight: 4,
        paddingTop: 3,
    }
})