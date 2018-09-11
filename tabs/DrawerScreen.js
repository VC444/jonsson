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
    return (
      <View>
        <ScrollView>
          <View>
            <View style={styles.sidebar}>
              <Text onPress={this.navigateToScreen()}>
                Today's Date
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
              <Text onPress={this.navigateToScreen()}>
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
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#d6d7da'
  }

}