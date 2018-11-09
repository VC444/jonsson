import React, { Component } from 'react';
import { Text, View, AsyncStorage } from 'react-native';
import { QRCode } from 'react-native-custom-qr-codes';



export default class CodeDisplay extends Component {
    
render() {

  console.log('USER ID from CodeDisplay.js is ' + this.props.navigation.state.params.ourUserID.toString());
  return(

    
      <View>
          <Text>This is the QR Code page</Text>
          <QRCode
          content = {'app,' + this.props.navigation.state.params.ourUserID.toString() + ',' + this.props.navigation.state.params.woosh.toString()}
          //ecl = 'M'
          outerEyeStyle='circle'
          //innerEyeStyle='diamond'
          //backgroundColor = '#c75b12'
          color = '#c75b12'
          //logo={require('../images/temoc_icon.png')}
          //logoSize='12'
          />
          </View>
  );
}
}