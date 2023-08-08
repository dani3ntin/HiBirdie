import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import EncyclopediaPage from './EncyclopediaPage';
import FriendsPage from './FriendsPage';
import LatestSightingsPage from './LatestSightingsPage';

const Tab = createMaterialTopTabNavigator();

export default function Home() {
  return (
    <NavigationContainer>
        <Tab.Navigator>
            <Tab.Screen name="My Encyclopedia" component={EncyclopediaPage}/>
            <Tab.Screen name="Followed" component={FriendsPage}/>
            <Tab.Screen name="Latest Sightings" component={LatestSightingsPage}/>
        </Tab.Navigator>
    </NavigationContainer>
  );
}
