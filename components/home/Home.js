import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { NavigationContainer } from '@react-navigation/native'
import EncyclopediaPage from './EncyclopediaPage'
import FollowedPage from './FollowedPage'
import LatestSightingsPage from './LatestSightingsPage'
import { React, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, StyleSheet, StatusBar } from 'react-native'
import HomeHeaderBar from '../headerBars/HomeHeaderBar'
import { API_URL } from '../../env'

const Tab = createMaterialTopTabNavigator();

export default function Home(props) {

  return (
    <>
      <View style={styles.headerContainer}>
        <HomeHeaderBar userName={props.userData ? props.userData.name : ''} userAvatar={{ uri: API_URL + 'getuserbyusername/' + (props.userData ? props.userData.username : '') + '/' + (props.userData ? props.userData.username : '') }} />
      </View>
      <Tab.Navigator>
          <Tab.Screen name="Latest Sightings">{() => <LatestSightingsPage username={props.username}/>}</Tab.Screen>
          <Tab.Screen name="My Encyclopedia">{() => <EncyclopediaPage username={props.username}/>}</Tab.Screen>
          <Tab.Screen name="Followed">{() => <FollowedPage username={props.username}/>}</Tab.Screen>
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
