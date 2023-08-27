import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { useGlobalContext } from '../globalContext/GlobalContext';

const DetailUserHeaderBar = (props) => {
  const { globalVariable, setGlobalVariable } = useGlobalContext()
    const CustomIcon = ({ name, size, color }) => {
        const IconComponent = Icon;
        return <IconComponent name={name} size={size} color={color} />;
    }

    function backButtonPressedHandler(){
        props.onBackButtonPress()
    }

    return (
        <View style={[styles.container, {backgroundColor: globalVariable.headerColor}]}>
          <Pressable style={({pressed}) => pressed && styles.pressedButton} onPress={backButtonPressedHandler}>
              <View style={styles.backIcon}>
                  <CustomIcon name="left" size={35} color="black" />
              </View>
          </Pressable>
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
      width: '100%',
      height: '100%'
    },
    name: {
      marginLeft: 10,
      fontSize: 22,
      fontWeight: 'bold',
    },
    userName: {
      fontSize: 16,
      marginLeft: 10,
      color:'#0004ff'
    },
    columnContainer:{
      flexDirection: 'column',
    },
    backIcon: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      paddingLeft: 17,
      paddingRight: 17,
    },
    pressedButton: {
        opacity: 0.3,
    },
});
  