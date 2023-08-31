import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../globalContext/GlobalContext'
import { TouchableOpacity } from 'react-native-gesture-handler';

const HomeHeaderBar = (props) => {
  const { globalVariable, setGlobalVariable } = useGlobalContext()

  const navigation = useNavigation()

  function userPressedHandler(){
    navigation.navigate('UserSettings')
  }
    return (
      <TouchableOpacity onPress={userPressedHandler}>
        <View style={[styles.container, {backgroundColor: globalVariable.headerColor}]}>
          <Image
            source={props.userAvatar}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{props.userName}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  
export default HomeHeaderBar

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: '#f2f2f2',
      width: '100%',
      height: '100%',
    },
    avatar: {
      width: 58,
      height: 58,
      borderRadius: 100,
      marginLeft: 10
    },
    userName: {
      marginLeft: 10,
      fontSize: 18,
      fontWeight: 'bold',
    },
});
  