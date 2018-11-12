import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, AsyncStorage } from 'react-native';
import { Constants, BarCodeScanner, Permissions } from 'expo';
import * as firebase from 'firebase';

export default class Qrcode extends Component {
  state = {
    hasCameraPermission: null,
    isBarcodeRead: true,
    mode: '',
    secretKey: '',
    whooshBits: '0',
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

  checkBarcodeRead = (data) => {
      // this.setState({isBarcodeRead: false});
      this._handleBarCodeRead(data)
    
  }

  _handleBarCodeRead = data => {
    
    var temp = JSON.stringify(data);
    var temp2 = temp.split(':');
    var temp3 = temp2[2].split('\"');
    console.log("TEMP3 DATA[1]: " + temp3[1]);
    var splitData = temp3[1].split(',');
    console.log("Mode (app/web): " + splitData[0]);
    console.log("Secret Key: " + splitData[1]);
    console.log("Whoosh Bits: " + splitData[2]);
    this.state.mode = splitData[0];
    this.state.secretKey = splitData[1];
    this.state.whooshBits = splitData[2];

    var data1 = 'userID: ' + this.props.navigation.state.params.theUserID.toString();  //COMES FROM Agenda.js
    var data2 = 'Whoosh Bits: ' + this.state.whooshBits;

     if (this.state.mode == 'app') //YET TO ADD CHECK FOR FIREBASE FOR ADMIN
     {
      Alert.alert(
        'Admin Approval!',
        'Please approve the following redeem request: \n' + data1 + '\n ' + data2,  
        [
          
          {text: 'Deny', style: 'cancel', onPress: () => this.denyWhooshBitsRedeem()},
          {text: 'Approve', onPress: () => this.approveWhooshBitsRedeem()},
        ],
        { cancelable: false }
      )
     }
    else if (this.state.mode == 'web')
    {

      Alert.alert(
        this.state.whooshBits + ' Whoosh Bits Redeemed!',
        'Thanks for attending! \n \nWe look forward to seeing you again!' ,  
        [
          {text: 'Thanks!', onPress: () => this.addWhooshBitsToUser()},
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

  approveWhooshBitsRedeem() {
    console.log("WHOOSH BITS APPROVED!"); 
  }

  denyWhooshBitsRedeem() {
    console.log("WHOOSH BITS DENIED!");
  }

  addWhooshBitsToUser() {
    console.log("ADDING WHOOSH BITS TO USER")
    console.log('USER ID FROM QR CODE PAGE: ' + this.props.navigation.state.params.theUserID.toString())

    let numEventRef = firebase.database().ref('Users/' + this.props.navigation.state.params.theUserID.toString() + '/numOfEvents/');
    let pointsRef = firebase.database().ref('Users/' + this.props.navigation.state.params.theUserID.toString() + '/points/');

    numEventRef.transaction(function(numOfEvents) {
      return (numOfEvents || 0) + 1;
    }).then(function () {
        console.log('NUMBER OF EVENTS UPDATED IN FIREBASE!');
      })
      .catch(function (error) {
        console.log('NUMBER OF EVENTS NOT UPDATED: ' + error);
      });
        console.log('WHOOSH BITS TRANSACTION: ' + this.state.whooshBits);
        console.log('POINTS TRANSACTION TYPE: ' + typeof(parseInt(this.state.whooshBits)));
        var jack = parseInt(this.state.whooshBits);
      pointsRef.transaction(function(points) {
        return (points || 0) + jack;
      }).then(function () {
          console.log('POINTS UPDATED IN FIREBASE!');
        })
        .catch(function (error) {
          console.log('POINTS NOT UPDATED: ' + error);
        });
  }

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.titleText}>Scan QR Code Here</Text>
        {this.state.hasCameraPermission === null ?
          <Text>Requesting permission to use camera ...</Text> :
          this.state.hasCameraPermission === false ?
            <Text>Camera permission is not granted</Text> :
            <BarCodeScanner
              onBarCodeRead = {this.checkBarcodeRead}
              style={{ height: 400, width: 400 }}
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