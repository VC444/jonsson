import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';
import PropTypes from 'prop-types';
import {ScrollView, Text, View} from 'react-native';
import { DrawerActions } from 'react-navigation';

export default class DrawerScreen extends Component {
  navigateToScreen = (route) => () => {
    console.log('DrawerScreen has been fired');
  }

  render () {
    return (
      <View>
        <ScrollView>
          <View>
            <View>
              <Text onPress={this.navigateToScreen()}>
                Home
              </Text>
            </View>
            <View>
              <Text onPress={this.navigateToScreen()}>
               Jobs
              </Text>
            </View>
            <View>
              <Text onPress={this.navigateToScreen()}>
              Events
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