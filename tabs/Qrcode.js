import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, AsyncStorage } from 'react-native';
import { Constants, BarCodeScanner, Permissions, Location } from 'expo';
import * as firebase from 'firebase';
import Geocoder from 'react-native-geocoding';

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
    attendedFlag: false,
  };

  async componentDidMount() {
    this._requestCameraPermission();

    this.setState({
      emailID: await AsyncStorage.getItem('email'),
      //emailLoading: false,
    });
  }

  distance = (lat1, lon1, lat2, lon2, unit) => {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") { dist = dist * 1.609344 }
      if (unit == "N") { dist = dist * 0.8684 }
      return dist;
    }
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

  async _handleBarCodeRead(data) {
    var temp = JSON.stringify(data);
    var temp2 = temp.split(':');
    var temp3 = temp2[2].split('\"');
    var eventId;
    console.log("TEMP3 DATA[1]: " + temp3[1]);
    var splitData = temp3[1].split(',');
    console.log("Mode (app/web): " + splitData[0]);
    console.log("Event ID: " + splitData[1]);
    console.log("Secret Key: " + splitData[2]);
    console.log("Whoosh Bits: " + splitData[3]);
    eventId = splitData[1];
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
    else if (this.state.mode == 'web' && (!this.state.hasRedeemed)) {
      let userId = this.props.navigation.state.params.theUserID.toString();
      var userHasAttended;

      //this.state.hasRedeemed = true;
      var jill = this.state.usrLinkedInID;
      console.log("RAP SONG USER ID: " + this.props.navigation.state.params.theUserID.toString())
      let userHasAttendedRef = firebase.database().ref('Events/' + this.state.ourEventID + '/usersAttended/');
      // let attendedFlag = firebase.database().ref('Events/' + this.state.ourEventID + '/usersAttended/').snapshot();
      var testing = firebase.database().ref('Events/' + this.state.ourEventID + '/usersAttended/');
      testing.child(userId).once('value', function (snapshot) {
        var exists = (snapshot.val() !== null)
        console.log("DOES EXISTS:" + exists)
        userHasAttended = exists;
      });
      {
        console.log('User inside loop attended!')
      }
      //  {
      //   // this.state.attendedFlag = snapshot.ref(this.state.emailID).exists();
      //   console.log('User inside loop attended: ' + this.state.attendedFlag);
      // });
      console.log('outside loop: ' + this.state.attendedFlag);
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

      Geocoder.init('AIzaSyAb53PEyP1lP9m4X4BUTpBUbA-7hxAcPmc'); // use a valid API key

      let eventRef = firebase.database().ref('Events/' + this.state.ourEventID);
      let eventLocation;
      eventRef.once('value', function (snapshot) {
        let data = snapshot.val();
        console.log('Event Address: ' + data.eventLocation);
        eventLocation = data.eventLocation;
      });

      let outerDist = 0;

      Geocoder.from(eventLocation)
        .then(json => {
          var eventLat, eventLng;
          var userLat, userLng;

          var location = json.results[0].geometry.location;
          console.log('Event address coords: ' + location.lat + ' ' + location.lng);
          eventLat = location.lat;
          eventLng = location.lng;

          navigator.geolocation.getCurrentPosition(position => {
            userLat = position.coords.latitude;
            userLng = position.coords.longitude;
            console.log('userLat is ' + userLat);
            console.log('userLng is ' + userLng);

            let dist = this.distance(userLat, userLng, eventLat, eventLng, 'M');
            outerDist = dist;

            if (dist < 0.2) {
              if (userHasAttended) {
                Alert.alert(
                  'You have already scanned the QR code for this event.',
                  'Do not try to cheat the system bruh. \n \nLololol',
                  [
                    { text: 'Damn It', onPress: () => console.log('User tried to cheat the system') },
                  ],
                  { cancelable: false }
                )
                this.props.navigation.navigate('Agenda');
              } else {

                Alert.alert(
                  this.state.whooshBits + ' Whoosh Bits Redeemed!',
                  'Thanks for attending! \n \nWe look forward to seeing you again!',
                  [
                    { text: 'Thanks!', onPress: () => this.addWhooshBitsToUser() },
                  ],
                  { cancelable: false }
                )
                this.props.navigation.navigate('Agenda');
              }
              console.log('Distance between user and event: ' + dist + ' miles');
            } else {
              Alert.alert(
                'Gotta come to the event to rake the points dawg.',
                'You should be at least 50 yards within the event location. \n \nGood try tho',
                [
                  { text: 'Damn It', onPress: () => console.log('User tried to cheat the system') },
                ],
                { cancelable: false }
              )
              this.props.navigation.navigate('Agenda');
              console.log('Distance between user and event: ' + dist + ' miles');
            }
          });
        })
        .catch(error => console.warn(error));

      console.log('lat is ' + userlat);
      console.log('long is ' + userlng);

      console.log('Event lat is: ' + eventLat);
      console.log('Event long is: ' + eventLng);


      if (userHasAttended) {
        Alert.alert(
          'You have already scanned the QR code for this event.',
          'Do not try to cheat the system bruh. \n \nLololol',
          [
            { text: 'Damn It', onPress: () => console.log('User tried to cheat the system') },
          ],
          { cancelable: false }
        )
      } else {

        Alert.alert(
          this.state.whooshBits + ' Whoosh Bits Redeemed!',
          'Thanks for attending! \n \nWe look forward to seeing you again!',
          [
            { text: 'Thanks!', onPress: () => this.addWhooshBitsToUser() },
          ],
          { cancelable: false }
        )
      }

      // userHasAttendedRef.transaction(function(usrLinkedInID) {
      //   return this.state.emailID ;
      // }).then(function () {
      //     console.log('USER EMAIL ID UPDATED IN FIREBASE!');
      //   })
      //   .catch(function (error) {
      //     console.log('USER EMAIL ID NOT UPDATED: ' + error);
      //   });
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