/**
 * JonssonConnect DrawerScreen Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { ScrollView, Text, View, Linking, TouchableOpacity, ActivityIndicator, AsyncStorage } from 'react-native';
import { DrawerActions } from 'react-navigation';
import { Container, Header, Content, Card, CardItem, Thumbnail, List, Icon, ListItem, Item, Input, Title, Button, Left, Body, Right, H1, H2, H3 } from 'native-base';


export default class DrawerScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    }
  }

  navigateToScreen = (route) => () => {
    console.log('DrawerScreen has been fired');
  }

  navigateToRewardsPage = () => {
    console.log('navigateToRewardsPage has been executed');
    this.props.navigation.navigate("Rewards");
  }
  navigateToSettingsPage = () => {
    console.log('navigateToSettingsPage has been executed');
    this.props.navigation.navigate("Settings");
  }
  navigateToHelpPage = () => {
    console.log('navigateToHelpPage has been executed');
    this.props.navigation.navigate("Help");
  }

  // componentDidMount = async() => {
  //   this.setState({
  //     firstName: await AsyncStorage.getItem('firstName'),
  //     lastName: await AsyncStorage.getItem('lastName'),
  //     userPhoto: await AsyncStorage.getItem('userPhoto'),
  //     headline: await AsyncStorage.getItem('headline'),
  //     location: await AsyncStorage.getItem('location'),
  //     industry: await AsyncStorage.getItem('industry'),
  //   }, this.setState({ isLoading: false }));
  // }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    this.setState({
      firstName: await AsyncStorage.getItem('firstName'),
      lastName: await AsyncStorage.getItem('lastName'),
      userPhoto: await AsyncStorage.getItem('userPhoto'),
      headline: await AsyncStorage.getItem('headline'),
      location: await AsyncStorage.getItem('location'),
      industry: await AsyncStorage.getItem('industry'),
    });
  }

  render() {

    if (!this.state.firstName) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

    console.log('These are all the state values' + this.state.firstName + this.state.lastName);

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
      "Saturday"
    ]

    const date = new Date();
    let day = days[date.getDay()]
    var month = monthNames[date.getMonth()]
    var dateNum = date.getDate()
    console.log(month + ' ' + dateNum);

    return (
      <View>
        <ScrollView>
          <View>
            <View style={styles.photo} >
              <Thumbnail large source={{ uri: this.state.userPhoto.toString() }} />
            </View>

            <View style={styles.userInfo}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF'}} >{this.state.firstName.toString()} {this.state.lastName.toString()}</Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={{ fontSize: 14, fontWeight: '300', color: '#FFFFFF'}} > <Icon name='ios-pin' style={{ fontSize: 14, color: '#FFFFFF' }} /> {this.state.location.toString().replace(/{"name":"/g, '').replace(/"}/g, '')}</Text>
            </View>

            <View style={styles.industryInfo}>
              <Text style={{ fontSize: 14, fontWeight: '300', color: '#FFFFFF'}} > <Icon name='ios-globe' style={{ fontSize: 14, color: '#FFFFFF' }} /> {this.state.industry.toString()}</Text>
            </View>


            <View style={styles.sidebarDate}>
              <Text style={styles.date} onPress={this.navigateToScreen()}>
                {day + ', ' + month + ' ' + dateNum}
              </Text>
            </View>

            <TouchableOpacity style={styles.sidebar}>
              <Icon type="FontAwesome" name='gift' size={5} />
              <Text style={styles.settingsStyle} onPress={() => this.navigateToRewardsPage()}>
                Rewards
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebar}
              onPress={() => { Linking.openURL('https://giving.utdallas.edu/ECS') }}>
              <Icon type="FontAwesome" name='dollar' size={10} />
              <Text style={styles.settingsStyle} onPress={this.navigateToScreen()}>
                Donate Now
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebar}>
              <Icon name='settings' size={10} />
              <Text style={styles.settingsStyle} onPress={() => this.navigateToSettingsPage()}>
                Settings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebar}>
              <Icon name='help-circle' size={10} />
              <Text style={styles.settingsStyle} onPress={() => this.navigateToHelpPage()}>
                Help & Feedback
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebar}
              transparent onPress={() => navigation.navigate('Profile')
              }>
              <Icon style={styles.logOut} type="Ionicons" name='ios-log-out' size={10} />
              <Text style={styles.logOutText} onPress={this.navigateToScreen()}>
                Log Out
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </View>
    );
  }
}

DrawerScreen.propTypes = {
  navigation: PropTypes.object
};

const styles = {
  sidebar: {

    padding: 14,
    paddingLeft: 20,

    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'

  },
  date: {
    fontWeight: 'bold',
    fontSize: 17,
    paddingTop: 20
  },
  logOut: {
    color: 'red',
    textAlign: 'auto',
    fontWeight: 'bold'
  },
  logOutText: {
    color: 'red',
    paddingLeft: 10,
    lineHeight: 25,
    textAlign: 'auto',
    fontWeight: 'bold',
    fontSize: 18
  },
  settingsStyle: {
    paddingLeft: 10,
    textAlign: 'auto'
  },
  sidebarDate: {
    padding: 20,

    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  backdropView: {
    paddingTop: 10,
    width: 400,
    backgroundColor: 'rgba(0,0,0,0)',
    paddingLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    paddingBottom: 5,
    backgroundColor: '#393e44',
  },
  userInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 7,
    backgroundColor: '#393e44',
  },
  industryInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    paddingBottom: 15,
    backgroundColor: '#393e44',
  }
}