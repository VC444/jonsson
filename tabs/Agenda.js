/**
 * JonssonConnect Events Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import React, { Component } from 'react';

import { Alert, ActivityIndicator, Image, ListView, FlatList, StyleSheet, View, Linking, RefreshControl, TextInput, ImageBackground, TouchableHighlight, TouchableOpacity, Button } from 'react-native';

//import { createBottomTabNavigator, createStackNavigator } from "react-navigation";
import { Container, Header, Content, Card, CardItem, Thumbnail, List, ListItem, Icon, Item, Input, Text, Title, Left, Body, Right, H1, H2, H3 } from 'native-base';
//import * as firebase from 'firebase';

//import firebaseApp from './EventDetails';
//import config from './EventDetails';
import { createBottomTabNavigator, createStackNavigator } from "react-navigation";
import * as firebase from 'firebase';

import firebaseApp from './EventDetails';
import config from './EventDetails';


export default class Events extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
    }
  }

  componentDidMount() {
    console.log("This is Date string from EventCalendar.js in componentDID: " + this.props.navigation.state.params.day.dateString)
    var hardcodeDate = this.props.navigation.state.params.day.dateString
    var dateOfEvent = firebase.database().ref("Events/").orderByChild("eventDate").startAt(hardcodeDate).endAt(hardcodeDate + "\uf8ff");


    dateOfEvent.on('value', this.gotData, this.errData);
  }



  gotData = (data) => {
    const { goBack } = this.props.navigation;
    var dates = data.val()
    // ErrorUtils.setGlobalHandler(function () {
    //   // your handler here
    //   Alert.alert(
    //     'Aw Snap!',
    //     "We don't have any events to show for this date. Sorry! \t :(",
    //     [


    //       { text: 'Back to Calendar', onPress: () => goBack(null) }
    //     ],
    //     { cancelable: false }
    //   )
    // });
    console.log("The Dates by child: " + JSON.stringify(dates))
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.setState({
      isLoading: false,
      dataSource: ds.cloneWithRows(dates),
    }, function () {
      // do something with new state
    });
  }

  errData = (err) => {
    console.log(err);
  }

  rsvpPressed = () => {
    console.log('rsvp button pressed');
    this.props.navigation.navigate("Rsvp");
  }

  qrCodePressed = () => {
    console.log('qrcode button pressed');
    this.props.navigation.navigate('Qrcode');
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return (
      <Container style={styles.containerStyle}>
        <Content
        >
          <View style={styles.container2}>
            <ImageBackground
              style={styles.backdrop}
              blurRadius={0}
              source={require('../images/image4.jpg')}
            >
              <View style={styles.backdropView}>
                {/* <Text style={{ fontSize: 35, fontWeight: '200', color: '#FFFFFF' }}>Comet Calendar</Text> */}
              </View>
            </ImageBackground>
          </View>
          <Content>
            <Card>
              <CardItem>
                <Body>
                  <Text style={{ color: '#c75b12', fontSize: 22, fontWeight: '800' }}><Icon name='ios-flame' style={{ fontSize: 32, color: '#c75b12' }} />    Jonsson|Calendar</Text>
                </Body>
                <TouchableHighlight onPress={this.qrCodePressed}>
                  <Icon type="Ionicons" name='md-qr-scanner' />
                </TouchableHighlight>
              </CardItem>
            </Card>
          </Content>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) => {
              const { uri } = rowData;
              return (
                <Content>
                  <List style={{ backgroundColor: '#FFFFFF' }}>
                    <ListItem>
                      <Left>
                        <Body>
                          <Text style={{ fontWeight: '800', fontSize: 16 }}>{rowData.eventTitle}</Text>
                          <Text style={{ fontWeight: '200', fontSize: 12, paddingTop: 5 }}>
                            <Icon name='ios-calendar-outline' style={{ fontSize: 12, color: '#5d5d5d' }} /> {monthNames[parseInt(rowData.eventDate.toString().substr(5, 5).substr(0, 2)) - 1]} {parseInt(rowData.eventDate.toString().substr(8, 2))}, {rowData.eventDate.toString().substr(0, 4)}
                          </Text>
                          <Text style={{ fontWeight: '100', fontSize: 12, color: '#757575', paddingTop: 5 }}><Icon name='ios-pin-outline' style={{ fontSize: 12, color: '#5d5d5d' }} /> {rowData.eventLocation}</Text>
                          <Text style={{ fontWeight: '800', fontSize: 22 }}></Text>
                          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "row", paddingTop: 5 }}>
                            <Text style={{ fontSize: 12, fontWeight: '100', paddingBottom: 5, paddingTop: 5, paddingLeft: 2, color: '#343d46' }}>
                              <Icon name='ios-people' style={{ fontSize: 25, color: '#f37735' }} /> {rowData.rsvpCount} people attending
                            </Text>
                          </View>
                          <TouchableHighlight
                            onPress={
                              () => this.props.navigation.navigate("EventDetails", { rowData })}
                          >
                            <Image
                              style={{ height: 200, width: null, borderRadius: 10, position: 'relative', resizeMode: 'stretch' }}
                              source={{ uri: rowData.eventImageURL }}
                            />
                          </TouchableHighlight>
                        </Body>
                      </Left>
                    </ListItem>
                  </List>
                </Content>
              )
            }}
          />
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: null,
    backgroundColor: '#FFFFFF'
  },
  backdrop: {
    height: 120,
  },
  backdropView: {
    paddingTop: 40,
    width: 400,
    backgroundColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listStyle: {
    backgroundColor: '#FFFFFF',
  },
  bigHeader: {
    fontSize: 18,
    fontWeight: '800',
    paddingTop: 10,
    paddingLeft: 15,
  },
  colorHeader: {
    fontSize: 18,
    fontWeight: '800',
    paddingTop: 10,
    paddingLeft: 15,
    color: '#008542',
  },
  containerStyle: {
    backgroundColor: '#FFFFFF',
  },
  buttonStyle: {
    fontSize: 12,
  },
  search: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 1,
  },
  searchbarColor: {
    backgroundColor: '#0039A6',
  },
  searchButton: {
    fontSize: 12,
    color: '#ffffff',
  },
  textInput: {
    height: 30,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginBottom: 5,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  hostStyle: {
    fontWeight: '800',
    fontSize: 14,
  },
  nameStyle: {
    fontWeight: '600',
    fontSize: 14,
  },
  eventNameStyle: {
    fontSize: 14,
    fontWeight: '800'
  },
  eventDescriptionStyle: {
    fontSize: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginTop: 5,
  },
  buttonText: {
    color: '#E98300',
    fontSize: 16,
    // borderWidth: 0.5,
    // borderRadius: 10,
    // padding: 10
  },
});
