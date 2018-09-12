import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { ScrollView, Text, View } from 'react-native';
import { DrawerActions } from 'react-navigation';

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
            <View style={styles.sidebar}>
              <Text onPress={this.navigateToScreen()}>
                Rewards
              </Text>
            </View>
            <View style={styles.sidebar}>
              <Text onPress={this.navigateToScreen()}>
                Donate
              </Text>
            </View>
            <View style={styles.sidebar}>
              <Text onPress={this.navigateToScreen()}>
                Settings
              </Text>
            </View>
            <View style={styles.sidebar}>
              <Text onPress={this.navigateToScreen()}>
                Help and Feedback
              </Text>
            </View>
            <View style={styles.sidebar}>
              <Text style={styles.logOut} onPress={this.navigateToScreen()}>
                Log Out
              </Text>
            </View>
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
    borderColor: '#d6d7da'
  },
  date: {
    fontWeight: 'bold',
    fontSize: 20
  },
  logOut: {
    color: 'red'
  }
}