import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { ActivityIndicator } from 'react-native'
import { useGlobalContext } from '../globalContext/GlobalContext'

const UserSettingHeaderBar = (props) => {
  const { globalVariable, setGlobalVariable } = useGlobalContext()
  const CustomIcon = ({ name, size, color }) => {
    const IconComponent = Icon;
    return <IconComponent name={name} size={size} color={color} />;
  }

  function backButtonPressedHandler(){
    props.onBackButtonPress()
  }

  function onEditButtonPressHandler(){
    props.onEditButtonPress()
  }

  function getEditButtonIcon(){
    if(props.editButtonText === 'Edit')
      return <CustomIcon name="edit" size={30} color="#1900ff"/>
    return <CustomIcon name="save" size={30} color="#1900ff"/>
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
        <Text style={styles.title}>Settings</Text>
        {
          props.isSaving ? 
            <Text style={styles.edit}><ActivityIndicator size="large" color="#1900ff'"/></Text>
          :
          <Pressable style={({pressed}) => pressed && styles.pressedBackButton} onPress={onEditButtonPressHandler}>
            <View style={styles.editButton}>
              <Text style={styles.edit}>{props.editButtonText}</Text>
              {
                getEditButtonIcon()
              }
            </View>
          </Pressable>
        }
      </View>
  );
};
  
export default UserSettingHeaderBar

const styles = StyleSheet.create({
  editButton: {
    flexDirection: 'row',
    marginRight: 20,
    color: '#1900ff',
    borderColor: '#1900ff',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    width: '100%',
    height: '100%',
  },
  title: {
    marginLeft: 10,
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  edit: {
    paddingTop: 2,
    color: '#1900ff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingRight: 5,
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
  