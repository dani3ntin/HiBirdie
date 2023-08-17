import React from 'react'
import { View, Text, Pressable, StyleSheet, BackHandler } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { useGlobalContext } from '../globalContext/GlobalContext'

const RegisterHeaderBar = (props) => {
  const { globalVariable, setGlobalVariable } = useGlobalContext()
  const CustomIcon = ({ name, size, color }) => {
    const IconComponent = Icon;
    return <IconComponent name={name} size={size} color={color} />;
  }

  function backButtonPressedHandler(){
    props.onBackButtonPress()
  }



  return (
      <View style={styles.container}>
        <View style={styles.backButton}>
          <Pressable style={({pressed}) => pressed && styles.pressedBackButton} onPress={backButtonPressedHandler}>
            <View style={styles.backIcon}>
              <CustomIcon name="left" size={35} color="black" />
            </View>
          </Pressable>
        </View>
        <Text style={styles.title}>Register</Text>
      </View>
  );
};
  
export default RegisterHeaderBar

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#adb2fc',
      width: '100%',
      height: '100%',
    },
    title: {
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
});
  