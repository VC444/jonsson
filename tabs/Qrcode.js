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
    userLatitude: '',
    userLongitude: '',
    eventLatitude: '',
    eventLongitude: '',
    ourDistance: 0,
    withinFiftyYards: false,
    isValidSecretKey: ''
  };

  async componentDidMount() {
    this._requestCameraPermission();

    this.setState({
      emailID: await AsyncStorage.getItem('email'),
    });
  }

  successGeolocation = (position) => {
    console.log("POSITION VARIABLE DATA (OUTSIDE): " + JSON.stringify(position));
    if (position) {
      console.log("POSITION VARIABLE DATA (INSIDE): " + JSON.stringify(position));
      var userLat = position.coords.latitude;
      var userLong = position.coords.longitude;
      this.state.userLatitude = userLat;
      this.state.userLongitude = userLong;

      Geocoder.init('AIzaSyAb53PEyP1lP9m4X4BUTpBUbA-7hxAcPmc');
      let eventRef = firebase.database().ref('Events/' + this.state.ourEventID + '/');
      let eventLocation;
      eventRef.once('value', function (snapshot) {
        let data = snapshot.val();
        console.log('Event Address: ' + data.eventLocation);
        eventLocation = data.eventLocation;
      });
      Geocoder.from(eventLocation)
        .then(json => {
          //var location = json.results[0].geometry.location; //EVENT LOCATOIN
          var eventLat = json.results[0].geometry.location.lat;
          var eventLng = json.results[0].geometry.location.lng;

          this.state.eventLatitude = eventLat;
          this.state.eventLongitude = eventLng;

          console.log("USER LATITUDE: " + this.state.userLatitude);
          console.log("USER LONGITUDE: " + this.state.userLongitude);
          console.log("EVENT LATITUDE: " + this.state.eventLatitude);
          console.log("EVENT LONGITUDE: " + this.state.eventLongitude);

          var lat1 = this.state.userLatitude;
          var lon1 = this.state.userLongitude;
          var lat2 = this.state.eventLatitude;
          var lon2 = this.state.eventLongitude;

          console.log("1 USER LATITUDE: " + lat1);
          console.log("1 USER LONGITUDE: " + lon1);
          console.log("1 EVENT LATITUDE: " + lat2);
          console.log("1 EVENT LONGITUDE: " + lon2);



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
          
          this.state.ourDistance = dist;
          console.log("DIST Between User & Event: " + this.state.ourDistance + " miles!");
          if (this.state.ourDistance < 0.02841) {

            this.state.withinFiftyYards = true;
            // console.log("OUR DISTANCE (IF) STATEMENT VALUE: " + dist + " miles!");
            console.log("OUR (IF) WITHIN FIFTY YARDS VALUE: " + this.state.withinFiftyYards);

          }
          else {
            this.state.withinFiftyYards = false;
            // console.log("OUR DISTANCE (ELSE) STATEMENT VALUE: " + dist + " miles!");
            console.log("OUR (ELSE) WITHIN FIFTY YARDS VALUE: " + this.state.withinFiftyYards);
          }
        })
        .catch(error => console.log(error));
    }
    else {
      console.log("*****INAVLID COORDINATES RECIEVED!***** \n" + position)
      this.failedGeolocation();
    }
  }

  failedGeolocation = () => {
    Alert.alert(
      'Oh oh!',
      'Sorry dude. We didn\'t get your location. Could ya try again?',
      [

        { text: 'Fo Sure!', onPress: () => console.log('COULDN\'T GET LOCATION') },
      ],
      { cancelable: false }
    )
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

  secretKeyData = (data) => {
    var secretKey = data.val()
    console.log("The secrey KEY is " + secretKey)

    this.state.isValidSecretKey = secretKey
  }

  errData = (err) => {
    console.log(err);
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

    ////////////////////////////////////////////
    //var isAdminCheck
    // isAdmin read from firebase
    // If true, set isAdminCheck to true, else set to false.

    ///////////////////////////////////////////

    if (this.state.mode == 'app') //YET TO ADD CHECK IN FIREBASE FOR ADMIN ==> USE isAdmin IN FIREBASE UNDER USERID UNDER USERS
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

      console.log("RAP SONG USER ID: " + this.props.navigation.state.params.theUserID.toString())
      let userHasAttendedRef = firebase.database().ref('Events/' + this.state.ourEventID + '/usersAttended/');

      userHasAttendedRef.child(userId).on('value', function (snapshot) {
        var exists = (snapshot.val() !== null)
        console.log("Has User Already Attended?:" + exists)
        userHasAttended = exists;
      });


      var secretKeyRef = firebase.database().ref("Events/" + this.state.ourEventID + "/eventSecretKey/");
      secretKeyRef.on('value', this.secretKeyData, this.errData);


      console.log("IS VALID SECRET KEY:" + this.state.isValidSecretKey)

      var isValidSecretKeyCheck = false;

      if (this.state.secretKey === this.state.isValidSecretKey) {
        isValidSecretKeyCheck = true;
      }
      else {
        isValidSecretKeyCheck = false;
      }

      Geocoder.init('AIzaSyAb53PEyP1lP9m4X4BUTpBUbA-7hxAcPmc');

      let eventRef = firebase.database().ref('Events/' + this.state.ourEventID + '/');
      let eventLocation;
      eventRef.once('value', function (snapshot) {
        let data = snapshot.val();
        console.log('Event Address: ' + data.eventLocation);
        eventLocation = data.eventLocation;
      });

      navigator.geolocation.getCurrentPosition(this.successGeolocation);  //USER LOCATION

      var finalAttendedCheck = true;
      var finalGeoLocationCheck = true;
      var finalValidSecretKeyCheck = true;

      if (userHasAttended) {
        Alert.alert(
          'You have already scanned the QR code for this event.',
          'Do not try to cheat the system bruh. \n \nLololol',
          [
            { text: 'Damn It', onPress: () => console.log('User tried to cheat the system') },
          ],
          { cancelable: false }
        )
        finalAttendedCheck = false;
        this.props.navigation.goBack(null);
      }

      else if (!isValidSecretKeyCheck)   //    !this.state.validSecretKey
      {
        Alert.alert(
          'INVALID SECRET KEY!',
          'YOU TRYIN TO USE FAKE QR CODE??!. \n \nGood try tho',
          [
            { text: 'But...But...How?', onPress: () => console.log('User tried to cheat the system') },
          ],
          { cancelable: false }
        )
        finalValidSecretKeyCheck = false;
        this.props.navigation.goBack(null);
      }

      else if (!(this.state.withinFiftyYards)) {    //this.state.ourDistance < 0.02841
        Alert.alert(
          'Gotta come to the event to rake the points dawg.',
          'You should be at least 50 yards within the event location. \n \nGood try tho',
          [
            { text: 'Damn It', onPress: () => console.log('User tried to cheat the system') },
          ],
          { cancelable: false }
        )
        finalGeoLocationCheck = false;
        this.props.navigation.goBack(null);

      }
      else if (finalAttendedCheck && finalValidSecretKeyCheck && finalGeoLocationCheck) {
        Alert.alert(
          this.state.whooshBits + ' Whoosh Bits Redeemed!',
          'Thanks for attending! \n \nWe look forward to seeing you again!',
          [
            { text: 'Thanks!', onPress: () => this.addWhooshBitsToUser() },
          ],
          { cancelable: false }
        )
        this.props.navigation.goBack(null);
      }
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
  }

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
    console.log("ADDING WHOOSH BITS TO USER & ATTDING USER TO ATTENDED LIST")

    let userHasAttendedRef = firebase.database().ref('Events/' + this.state.ourEventID + '/usersAttended/');
    var linkedInID = this.state.usrLinkedInID;
    userHasAttendedRef.child(linkedInID).set(this.state.emailID).then(function () {
      console.log('User added to attended list!');
    })
      .catch(function (error) {
        console.log('User not added to attended list!' + error);
      });

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