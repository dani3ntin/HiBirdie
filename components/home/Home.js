import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import EncyclopediaPage from './EncyclopediaPage'
import FollowedPage from './FollowedPage'
import LatestSightingsPage from './LatestSightingsPage'
import { React, useEffect } from 'react'
import { View, StyleSheet, StatusBar, BackHandler } from 'react-native'
import HomeHeaderBar from '../headerBars/HomeHeaderBar'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useGlobalContext } from '../globalContext/GlobalContext'

let Tab
if(Platform.OS == 'ios'){
  Tab = createMaterialBottomTabNavigator()
}else{
  Tab = createMaterialTopTabNavigator();
}
  
export default function Home(props) {
  const { globalVariable, setGlobalVariable } = useGlobalContext()
  const navigation = useNavigation()

useEffect(() => {
  console.log(globalVariable.API_URL + 'getuserbyusername/' + (props.userData ? props.userData.username : '') + '/' + (props.userData ? props.userData.username : '') + globalVariable.randomStringToUpdate)
  console.log(props.userData)
}, [])

useEffect(() => {
  const backHandler = BackHandler.addEventListener(
  'hardwareBackPress',
  handleBackPress
  );

  return () => backHandler.remove()
}, [])

const handleBackPress = () => {
  return true
}

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <HomeHeaderBar userName={props.userData ? props.userData.name : ''} userAvatar={{ uri: globalVariable.API_URL + 'getusericonbyusername/' + (props.userData ? props.userData.username : '') + globalVariable.randomStringToUpdate}} />
      </View>
      <Tab.Navigator
      activeColor='#0008ff'
      barStyle={{ backgroundColor: '#ffffff', borderTopColor: 'blue', borderTopWidth: 2 }}
      >
          <Tab.Screen name="Latest Sightings" options={{
            tabBarLabel: 'Sightings',
            tabBarIcon: ({ color }) => (
              <Icon name="binoculars" color={color} size={26} />
            ),
          }}>
            {() => <LatestSightingsPage username={props.username} userData={props.userData}/>}
          </Tab.Screen>
          <Tab.Screen name="My Encyclopedia" options={{
            tabBarLabel: 'Encyclopedia',
            tabBarIcon: ({ color }) => (
              <Icon name="book-open-blank-variant" color={color} size={26} />
            ),
          }}>{() => <EncyclopediaPage username={props.username}/>}</Tab.Screen>
          <Tab.Screen name="Followed" options={{
            tabBarLabel: 'Followed',
            tabBarIcon: ({ color }) => (
              <Icon name="account-box" color={color} size={26} />
            ),
          }}>{() => <FollowedPage username={props.username}/>}</Tab.Screen>
      </Tab.Navigator>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: '8%'
  },
  container: {
    flex: 1,
  }
});
