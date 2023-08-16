import React from 'react'
import { useState, useEffect } from 'react'
import { View, Text, Pressable, StyleSheet, BackHandler } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { API_URL } from '../../env'
import { useGlobalContext } from '../globalContext/GlobalContext'

const DetailBirdHeaderBar = (props) => {
  const { globalVariable, setGlobalVariable } = useGlobalContext()
  const [liked, setLiked] = useState(props.userPutLike)
  const [likeNumber, setLikeNumber] = useState(props.likes)

  useEffect(() => {
    setLiked(props.userPutLike)
    setLikeNumber(props.likes)
  }, [props.userPutLike, props.likes])

  const CustomIcon = ({ name, size, color }) => {
    const IconComponent = Icon;
    return <IconComponent name={name} size={size} color={color} />;
  }

  function backButtonPressedHandler(){
    props.onBackButtonPress()
  }

  function addLikeHandler(){
    if(props.addLike)//This function is used to add the like also in the detail user page. If the user is not coming from the detail user page, I do nothing
      props.addLike()
  }

  function removeLikeHandler(){
    if(props.removeLike)//This function is used to remove the like also in the detail user page. If the user is not coming from the detail user page, I do nothing
      props.removeLike()
  }

  async function onPressLikeHandler(){
    const newValue = !liked
    setLiked(newValue)
    if(newValue === true){
      addLikeHandler()
      setLikeNumber(likeNumber + 1)
      await fetch(API_URL + 'addlike', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: props.loggedUsername, bird: props.id })
      });
    }else{
      removeLikeHandler()
      setLikeNumber(likeNumber - 1)
      await fetch(API_URL + 'removelike', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: props.loggedUsername, bird: props.id })
      });
    }
}

  return (
      <View style={[styles.container, {backgroundColor: globalVariable.headerColor}]}>
        <View style={styles.backButton}>
          <Pressable style={({pressed}) => pressed && styles.pressedBackButton} onPress={backButtonPressedHandler}>
            <View style={styles.backIcon}>
              <CustomIcon name="left" size={35} color="black" />
            </View>
          </Pressable>
        </View>
        <Text style={styles.birdName}>{props.birdName}</Text>
        <View style={styles.likesContainer}>
            <Text style={styles.likesText}>{likeNumber}</Text>
            <Pressable onPress={() => onPressLikeHandler()}>
                <MaterialCommunityIcons
                    name={liked ? "heart" : "heart-outline"}
                    size={32}
                    color={liked ? "red" : "black"}
                />
            </Pressable>
        </View>
      </View>
  );
};
  
export default DetailBirdHeaderBar

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f2f2f2',
      width: '100%',
      height: '100%',
    },
    birdName: {
      marginLeft: 10,
      fontSize: 22,
      fontWeight: 'bold',
      flex: 1,
    },
    backButton: {
      width: 70,
      height: 70,
    },
    backIcon: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      padding: 17,
    },
    pressedBackButton: {
      opacity: 0.3,
    },
    likesContainer: {
      flexDirection: 'row',
      paddingRight: 25,
    },
    likesText: {
      paddingRight: 5,
      paddingTop: 3,
      fontSize: 18
    }
});
  