/**
 * JonssonConnect Application - Akshay
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, Image, ListView, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator, createStackNavigator, createSwitchNavigator, createDrawerNavigator } from "react-navigation";
import { Container, Header, Content, Card, CardItem, Thumbnail, Icon, Text, Title, Button, Left, Body, Right, H1, H2, H3 } from 'native-base';

//import ComputerScience from './tabs/ComputerScience'
//import Profile from './tabs/Profile'
import Home from './tabs/Home';
import Jobs from './tabs/Jobs';
import Events from './tabs/Events';
import Login from './tabs/Login';
import EventDetails from './tabs/EventDetails';
import JobsDetails from './tabs/JobsDetails';
import ArticleDetails from './tabs/ArticleDetails';
import EventsCalendar from './tabs/EventsCalendar';
import DrawerScreen from './tabs/DrawerScreen';
import Rewards from './tabs/Rewards';
import Settings from './tabs/Settings';
import Help from './tabs/Help';
import Agenda from './tabs/Agenda';
import Qrcode from './tabs/Qrcode';
import Rsvp from './tabs/Rsvp';

import * as firebase from 'firebase';

console.disableYellowBox = true

// Initialize Firebase
export var config = {
  apiKey: "TODO",
  authDomain: "jonssonconnect.firebaseapp.com",
  databaseURL: "https://jonssonconnect.firebaseio.com",
  projectId: "jonssonconnect",
  storageBucket: "jonssonconnect.appspot.com",
};

export const firebaseApp = firebase.initializeApp(config);

export const HomeFeedStack = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: ({ navigation }) => ({
      title: "News Feed",
      headerStyle: { paddingRight: 10, paddingLeft: 10, backgroundColor: '#C75B12', borderBottomWidth: 1 },
      headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
    })
  },
  ArticleDetails: { screen: ArticleDetails },
  Rewards: {
    screen: Rewards,
    navigationOptions: ({ navigation }) => ({
      title: "Rewards",
      headerStyle: { paddingRight: 10, paddingLeft: 10, backgroundColor: '#C75B12' },
      headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
    })
  },
  Settings: { screen: Settings },
  Help: {
    screen: Help,
    navigationOptions: ({ navigation }) => ({
      title: "FAQ",
      headerStyle: { paddingRight: 10, paddingLeft: 10, backgroundColor: '#C75B12', borderBottomWidth: 1 },
      headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
    })
  }
});

export const EventsFeedStack = createStackNavigator({
  EventsTab: {
    screen: EventsCalendar,
    navigationOptions: ({ navigation }) => ({
      title: "Events Calendar",
      headerStyle: { paddingRight: 10, paddingLeft: 10, backgroundColor: '#C75B12', borderBottomWidth: 1 },
      headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
    })
  },
  EventDetails: { screen: EventDetails },
  EventsCalendar: { screen: EventsCalendar },
  Agenda: { screen: Agenda },
  Qrcode: { screen: Qrcode },
  Rsvp: { screen: Rsvp }
});

export const JobsFeedStack = createStackNavigator({
  JobsTab: {
    screen: Jobs,
    navigationOptions: ({ navigation }) => ({
      title: "Job Listings",
      headerStyle: { paddingRight: 10, paddingLeft: 10, backgroundColor: '#C75B12', borderBottomWidth: 1 },
      headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
    })
  },
  JobsDetails: { screen: JobsDetails },
});

export const AppScreenNavigator = createMaterialTopTabNavigator({
  Home: { screen: HomeFeedStack },
  Jobs: { screen: JobsFeedStack },
  Events: { screen: EventsFeedStack },
},
  {
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#FFFFFF',
      labelStyle: {
        fontSize: 15,
      },
      style: {
        backgroundColor: '#008542', // UTD Color
      },
    }
  });

export const DrawerNavigator = createDrawerNavigator({
  AppScreenNavigator: {
    screen: AppScreenNavigator
  }
}, {
    //initialRouteName: 'HomeFeedStack',
    contentComponent: DrawerScreen,
    drawerWidth: 300
  });

const MenuImage = ({ navigation }) => {
  if (!navigation.state.isDrawerOpen) {
    return <Text>Not Open</Text>
  } else {
    return <Text>Drawer is Open</Text>
  }
}

// Main navigator for the app
const AppNavigator = createSwitchNavigator({
  // Login: {
  //   screen: Login,
  //   navigationOptions: ({ navigation }) => ({
  //     header: null
  //   })
  // },
  DrawerNavigator: {
    screen: DrawerNavigator
  }
}, {
    navigationOptions: ({ navigation }) => ({
      title: 'ReactNavigation',  // Title to appear in status bar
      headerLeft:
        <TouchableOpacity onPress={() => { navigation.dispatch(DrawerActions.toggleDrawer()) }}>
          <MenuImage style="styles.bar" navigation={navigation} />
        </TouchableOpacity>,
      headerStyle: {
        backgroundColor: '#333',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },

    })
  });

AppScreenNavigator.navigationOptions = {
  title: "App"
};

export default AppNavigator
//export default AppScreenNavigator
