import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, AsyncStorage } from 'react-native';
import { Constants, BarCodeScanner, Permissions, Location } from 'expo';
import * as firebase from 'firebase';

export default class Qrcode extends Component {
  state = {
    hasCameraPermission: null,
    isBarcodeRead: true,
    mode: '',
    ourEventID: '',
    secretKey: '',
    whooshBits: '0',
    hasRedeemed: false,
    usrLinkedInID: '',
  };

  async componentDidMount() {
    this._requestCameraPermission();

    this.setState({
      emailID: await AsyncStorage.getItem('email'),
      //emailLoading: false,
    });
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
    console.log("Event ID: " + splitData[1]);
    console.log("Secret Key: " + splitData[2]);
    console.log("Whoosh Bits: " + splitData[3]);
    this.state.mode = splitData[0];
    this.state.ourEventID = splitData[1];
    this.state.secretKey = splitData[2];
    this.state.whooshBits = splitData[3];
    console.log("EMAIL ID FROM QRCODE.JS: " + this.state.emailID)

    var data1 = 'userID: ' + this.props.navigation.state.params.theUserID.toString();  //COMES FROM Agenda.js
    this.state.usrLinkedInID = this.props.navigation.state.params.theUserID.toString();
    var data2 = 'Whoosh Bits: ' + this.state.whooshBits;

    if (this.state.mode == 'app') //YET TO ADD CHECK FOR FIREBASE FOR ADMIN
    {
      Alert.alert(
        'Admin Approval!',
        'Please approve the following redeem request: \n' + data1 + '\n ' + data2,
        [

          { text: 'Deny', style: 'cancel', onPress: () => this.denyWhooshBitsRedeem() },
          { text: 'Approve', onPress: () => this.approveWhooshBitsRedeem() },
        ],
        { cancelable: false }
      )
     }
    else if (this.state.mode == 'web' && (!this.state.hasRedeemed))
    {
      //this.state.hasRedeemed = true;
      let userHasAttendedRef = firebase.database().ref('Events/' + this.state.ourEventID + '/usersAttended/');
      //var usersAttended = {usrLinkedInID: this.state.emailID};
      // let userRef = firebase.database().ref('Users/' + userID);
      // userRef.set({
      //   notificationToken: token
      // }).then(function () {
      //   console.log('Synchronization succeeded');
      // })
      //   .catch(function (error) {
      //     console.log('Synchronization failed' + error);
      //   });
      var jabba = this.state.usrLinkedInID;
      userHasAttendedRef.set({
        //usersAttended
        [jabba]: this.state.emailID
      }).then(function () {
        console.log('User added to attended list!');
      })
        .catch(function (error) {
          console.log('User not added to attended list!' + error);
        });

      // userHasAttendedRef.transaction(function(usrLinkedInID) {
      //   return this.state.emailID ;
      // }).then(function () {
      //     console.log('USER EMAIL ID UPDATED IN FIREBASE!');
      //   })
      //   .catch(function (error) {
      //     console.log('USER EMAIL ID NOT UPDATED: ' + error);
      //   });



      Alert.alert(
        this.state.whooshBits + ' Whoosh Bits Redeemed!',
        'Thanks for attending! \n \nWe look forward to seeing you again!',
        [
          { text: 'Thanks!', onPress: () => this.addWhooshBitsToUser() },
        ],
        { cancelable: false }
      )
    }
    else {
      Alert.alert(
        'Aw Snap!',
        'To redeem Whoosh Bits, please show the QR code to an approved event coordinator.',
        [
          { text: 'OK' },
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

  getEventData = (data) => {
    var eventsObject = data.val()
    var eventID = Object.keys(eventsObject)
    console.log(eventID[0]);
    console.log(eventID[1]);
}

errData = (err) => {
    console.log(err);
}

  addWhooshBitsToUser() {
    console.log("ADDING WHOOSH BITS TO USER")
    console.log('USER ID FROM QR CODE PAGE: ' + this.props.navigation.state.params.theUserID.toString())

    var eventObjectData = firebase.database().ref("Events/");
    eventObjectData.on('value', this.getEventData, this.errData);

    let numEventRef = firebase.database().ref('Users/' + this.props.navigation.state.params.theUserID.toString() + '/numOfEvents/');
    let pointsRef = firebase.database().ref('Users/' + this.props.navigation.state.params.theUserID.toString() + '/points/');

    numEventRef.transaction(function (numOfEvents) {
      return (numOfEvents || 0) + 1;
    }).then(function () {
      console.log('NUMBER OF EVENTS UPDATED IN FIREBASE!');
    })
      .catch(function (error) {
        console.log('NUMBER OF EVENTS NOT UPDATED: ' + error);
      });
    console.log('WHOOSH BITS TRANSACTION: ' + this.state.whooshBits);
    console.log('POINTS TRANSACTION TYPE: ' + typeof (parseInt(this.state.whooshBits)));
    var jack = parseInt(this.state.whooshBits);
    pointsRef.transaction(function (points) {
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
              onBarCodeRead={this.checkBarcodeRead}
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