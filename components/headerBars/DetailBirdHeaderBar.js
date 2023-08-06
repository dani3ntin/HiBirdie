import React from 'react';
import { View, Text, Pressable, StyleSheet, BackHandler  } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'

const DetailBirdHeaderBar = (props) => {

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
        <Text style={styles.birdName}>{props.birdName}</Text>
      </View>
  );
};
  
export default DetailBirdHeaderBar

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: '#f2f2f2',
      width: '100%',
      height: '100%',
    },
    birdName: {
      marginLeft: 10,
      fontSize: 22,
      fontWeight: 'bold',
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
  }
});
  