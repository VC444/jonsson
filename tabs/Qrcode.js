import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, AsyncStorage } from 'react-native';
import { Constants, BarCodeScanner, Permissions } from 'expo';

export default class Qrcode extends Component {
  state = {
    hasCameraPermission: null
  };

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = data => {
    
    var temp = JSON.stringify(data);
    var splitData = temp.split(',');
    console.log("Mode (app/web): " + splitData[1]);
    console.log("Secret Key: " + splitData[2]);
    console.log("Whoosh Bits: " + splitData[3]);

     if (splitData[0] == '"web') //YET TO ADD CHECK FOR FIREBASE FOR ADMIN
     {
       var data1 = 'userID: someUserID';  //YET TO USE ASYNCSTORAGE HERE
      var data2 = 'Whoosh Bits: ' + splitData[2];
      Alert.alert(
        'Admin Approval',
        'Please approve the following redeem request: \n' + data1 + '\n ' + data2,  //
        [
          
          {text: 'Deny', style: 'cancel', onPress: () => this.denyWhooshBitsRedeem()},
          {text: 'Approve', onPress: () => this.approveWhooshBitsRedeem()},
        ],
        { cancelable: false }
      )
     }
    else
    {
      Alert.alert(
        'Aw Snap!',
        'To redeem Whoosh Bits, please show the QR code to an approved event coordinator.',
        [
          {text: 'OK'},
        ],
        { cancelable: false }
      )
    }
    

  };

  approveWhooshBitsRedeem = whooshBits => {
    console.log("WHOOSH BITS APPROVED!");
  }

  denyWhooshBitsRedeem = whooshBits => {
    console.log("WHOOSH BITS DENIED!");
  }

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.titleText}>Scan QR code here</Text>
        {this.state.hasCameraPermission === null ?
          <Text>Requesting for camera permission</Text> :
          this.state.hasCameraPermission === false ?
            <Text>Camera permission is not granted</Text> :
            <BarCodeScanner
              onBarCodeRead={this._handleBarCodeRead}
              style={{ height: 300, width: 300 }}
            />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#C75B12',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});