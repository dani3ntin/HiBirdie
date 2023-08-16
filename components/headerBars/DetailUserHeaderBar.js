import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { Feather } from '@expo/vector-icons'

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
          <Pressable style={({pressed}) => pressed && styles.pressedButton} onPress={backButtonPressedHandler}>
              <View style={styles.backIcon}>
                  <CustomIcon name="left" size={35} color="black" />
              </View>
          </Pressable>
          <Image
              source={props.userAvatar}
              style={styles.avatar}
          />
          <View style={styles.columnContainer}>
            <Text style={styles.name}>{props.name}</Text>
            <Text style={styles.userName}>@{props.username}</Text>
          </View>
        </View>
    );
  };
  
export default DetailUserHeaderBar

const styles = StyleSheet.create({
    container: {
      flex: 1,
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
    name: {
      marginLeft: 10,
      fontSize: 22,
      fontWeight: 'bold',
      paddingRight: 100,
    },
    userName: {
      fontSize: 16,
      marginLeft: 10,
      color:'#0685c0'
    },
    columnContainer:{
      flexDirection: 'column',
    },
    backIcon: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      padding: 17,
    },
    pressedButton: {
        opacity: 0.3,
    },
});
  