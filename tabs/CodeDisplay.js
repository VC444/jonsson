import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { QRCode } from 'react-native-custom-qr-codes';



export default class CodeDisplay extends Component {

render() {
  return(
      <View>
          <Text>This is the QR Code page</Text>
          <QRCode
          content = {this.props.navigation.state.params.woosh.toString()}
          //ecl = 'M'
          outerEyeStyle='circle'
          //innerEyeStyle='diamond' - NOT WORKING
          //backgroundColor = '#c75b12'
          color = '#c75b12'
          //logo={require('../images/temoc_icon.png')}
          //logoSize='12'
          />
          </View>
  );
}
}