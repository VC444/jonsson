import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { ScrollView, Text, View, Linking, TouchableOpacity} from 'react-native';
import { DrawerActions } from 'react-navigation';
import { Container, Header, Content, Card, CardItem, Thumbnail, List, Icon, ListItem, Item, Input, Title, Button, Left, Body, Right, H1, H2, H3 } from 'native-base';


export default class DrawerScreen extends Component {
  navigateToScreen = (route) => () => {
    console.log('DrawerScreen has been fired');
  }

  render() {

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
            <View style={styles.sidebar}>
              <Text style={styles.date} onPress={this.navigateToScreen()}>
                {month + ' ' + dateNum}
              </Text>
            </View>

            <TouchableOpacity style={styles.sidebar}>
            <Icon type="FontAwesome" name='gift' size={5} />
              <Text style={styles.settingsStyle} onPress={this.navigateToScreen()}>
                Rewards
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebar}
             onPress={ ()=>{ Linking.openURL('https://giving.utdallas.edu/ECS')}}>
              <Icon type="FontAwesome" name='dollar' size={10} />
              <Text style={styles.settingsStyle} onPress={this.navigateToScreen()}>
                Donate Now 
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.sidebar}>
              <Icon name='settings' size={10}/>
              <Text style={styles.settingsStyle} onPress={this.navigateToScreen()}>
                Settings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebar}>
              <Icon name='help-circle' size={10}/>
              <Text style={styles.settingsStyle} onPress={this.navigateToScreen()}>
                Help & Feedback
              </Text>
            </TouchableOpacity>
           
            <TouchableOpacity style={styles.sidebar } 
               transparent onPress={() => navigation.navigate('Profile')
                  }>
                  <Icon style={styles.logOut} type="Ionicons" name='ios-log-out'size={10}  />
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
    padding: 20,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'flex-start'
      
  },
  date: {
    fontWeight: 'bold',
    fontSize: 20, 
    paddingTop: 20
  },
  logOut: {
    color: 'red',
    textAlign: 'auto',
    fontWeight: 'bold'
  },
  logOutText:{
    color: 'red',
    paddingLeft: 10, 
    lineHeight: 25,
    textAlign: 'auto',
    fontWeight: 'bold'
  }, 
  settingsStyle:{
    paddingLeft: 10, 
    textAlign: 'auto'
  }
}