import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { QRCode } from 'react-native-custom-qr-codes';


export default class CodeDisplay extends Component {


  render() {
    return (
      <View >
        <Text >
          Change code in the editor and watch it change on your phone! Save to get a shareable url.
        </Text>
        <QRCode content='https://reactnative.com'/>
      </View>
    );
  }
}
