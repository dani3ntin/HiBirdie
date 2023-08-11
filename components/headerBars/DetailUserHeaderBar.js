import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'

const DetailUserHeaderBar = (props) => {
    const CustomIcon = ({ name, size, color }) => {
        const IconComponent = Icon;
        return <IconComponent name={name} size={size} color={color} />;
    }

    function backButtonPressedHandler(){
        props.onBackButtonPress()
    }

    return (
        <View style={styles.container}>
            <Pressable style={({pressed}) => pressed && styles.pressedBackButton} onPress={backButtonPressedHandler}>
                <View style={styles.backIcon}>
                    <CustomIcon name="left" size={35} color="black" />
                </View>
            </Pressable>
            <Image
                source={props.userAvatar}
                style={styles.avatar}
            />
          <Text style={styles.userName}>{props.userName}</Text>
        </View>
    );
  };
  
export default DetailUserHeaderBar

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: '#f2f2f2',
      width: '100%',
      height: '100%'
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 100,
      marginLeft: 10
    },
    userName: {
      marginLeft: 10,
      fontSize: 18,
      fontWeight: 'bold',
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
});
  