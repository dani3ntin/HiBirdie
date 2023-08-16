import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import EncyclopediaPage from './EncyclopediaPage'
import FollowedPage from './FollowedPage'
import LatestSightingsPage from './LatestSightingsPage'
import { React, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, StyleSheet, StatusBar } from 'react-native'
import HomeHeaderBar from '../headerBars/HomeHeaderBar'
import { API_URL } from '../../env'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Platform } from 'react-native'

let Tab
if(Platform.OS == 'ios'){
  Tab = createMaterialBottomTabNavigator()
}else{
  Tab = createMaterialTopTabNavigator();
}
  
export default function Home(props) {

  return (
    <>
      <View style={styles.headerContainer}>
        <HomeHeaderBar userName={props.userData ? props.userData.name : ''} userAvatar={{ uri: API_URL + 'getuserbyusername/' + (props.userData ? props.userData.username : '') + '/' + (props.userData ? props.userData.username : '') }} />
      </View>
      <Tab.Navigator
      activeColor='#0008ff'
      barStyle={{ backgroundColor: '#ffffff', borderTopColor: 'blue', borderTopWidth: 2 }}
      >
          <Tab.Screen name="Latest Sightings" options={{
            tabBarLabel: 'Latest',
            tabBarIcon: ({ color }) => (
              <Icon name="binoculars" color={color} size={26} />
            ),
          }}>
            {() => <LatestSightingsPage username={props.username}/>}
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
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: '8%'
  }
});
