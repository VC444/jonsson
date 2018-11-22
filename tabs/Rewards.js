/**
 * JonssonConnect Rewards Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, Linking, Dimensions, TouchableOpacity, ImageBackground, ListView, ScrollView, ActivityIndicator, AsyncStorage } from 'react-native';
import { Container, List, Right } from 'native-base';
import * as firebase from 'firebase';

import firebaseApp from './EventDetails';
import config from './EventDetails'
import moment from 'moment';

export default class Rewards extends Component {

    constructor(props) {
        super(props);
        const ev = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            isLoading: true,
            refreshing: false,
            dataSource: ev.cloneWithRows([]),
            points: 0,
            numOfEvents: 0
        };
        this.renderRow = this.renderRow.bind(this)
    }

    numOfEventsUpdate = (data) => {
        var eventsAttendedValue = data.val();
        console.log("REWARDS PAGE # EVENTS ATTENDED: " + eventsAttendedValue);
        this.state.numOfEvents = eventsAttendedValue
    }

    whooshBitsUpdate = (data) => {
        var whooshBitsValue = data.val();
        console.log("REWARDS PAGE # WHOOSH BITS: " + whooshBitsValue);
        this.state.points = whooshBitsValue
    }

    numOfEventsUpdateErr = (err) => {
        console.log("AN ERROR OCCURED WHEN FETCHING numOfEvents FROM FIREBASE: " + err);
    }

    whooshBitsUpdateErr = (err) => {
        console.log("AN ERROR OCCURED WHEN FETCHING points FROM FIREBASE: " + err);
    }


    async componentDidMount() {

        this.setState({
            userID: await AsyncStorage.getItem('userID'),
            isLoading: false
        });

        return fetch('https://jonssonconnect.firebaseio.com/Events.json')
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log(responseJson);
                var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
                var userId = this.state.userID;
                var pointsCount = 0;
                for (var key in responseJson) {
                    if (responseJson.hasOwnProperty(key)) {
                        //console.log('users',responseJson[key].usersRsvp)
                        if (responseJson[key].usersAttended) {
                            if (responseJson[key].usersAttended.hasOwnProperty(userId)) {
                                pointsCount += Number(responseJson[key].whooshBits);
                            } else {
                                delete responseJson[key]
                            }
                        } else {
                            delete responseJson[key]
                        }
                    }
                }
                console.log(responseJson)
                this.setState({
                    isLoading: false,
                    dataSource: ds.cloneWithRows(responseJson),
                    data: responseJson.Events,
                    numOfEvents: Object.keys(responseJson).length,
                    points: pointsCount
                }, function () {
                    // do something with new state
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        return fetch('https://jonssonconnect.firebaseio.com/Events.json')
            .then((response) => response.json())
            .then((responseJson) => {
                let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
                this.setState({
                    isLoading: false,
                    dataSource: ds.cloneWithRows(responseJson),
                    refreshing: false,
                }, function () {
                });
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                    networkFailed: true,
                })
            });
    }

    onRedeemPressed = () => {
        var localPoints = this.state.points
        this.props.navigation.navigate('Redeem', {localPoints});
    }

    utcToLocal = (time) => {
        var localTime = moment(time).local().format("MMMM Do YYYY, h:mm a");
        return localTime;
    }

    render() {

        var numOfEventsRef = firebase.database().ref("Users/" + this.state.userID + "/numOfEvents/");
        var whooshBitsRef = firebase.database().ref("Users/" + this.state.userID + "/points/");
        numOfEventsRef.on('value', this.numOfEventsUpdate, this.numOfEventsUpdateErr);
        whooshBitsRef.on('value', this.whooshBitsUpdate, this.whooshBitsUpdateErr);
        console.log("********** EVENTS ATTENDED: " + this.state.numOfEvents);
        console.log("********** WHOOSH BITS: " + this.state.points);

        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, paddingTop: 20 }}>
                    <ActivityIndicator />
                </View>
            );
        }
        console.log('this is user id from rewards component' + this.state.userID);

        return (
            <ScrollView>
                <ImageBackground
                    style={{ width: null, height: 130 }}
                    blurRadius={0}
                    source={require('../images/image6.jpg')}>
                    <View style={{
                        paddingTop: 10, width: 400, backgroundColor: 'rgba(0,0,0,0)',
                        paddingLeft: 15, alignItems: 'center', justifyContent: 'center',
                    }} />
                </ImageBackground>

                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    borderColor: '#008542',
                }}>

                    <View style={{
                        width: '50%', height: '20%', backgroundColor: 'white'
                    }}>
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 17,
                            paddingTop: 15,
                            color: '#008542',
                            fontWeight: 'bold'
                        }}>
                            {this.state.points} {"\n"}{"\n"}
                            Whoosh Bits</Text>
                    </View>

                    <View style={{
                        width: '50%', height: '20%', backgroundColor: 'white'
                    }}>

                        <Text style={{
                            textAlign: 'center',
                            fontSize: 17,
                            paddingTop: 15,
                            color: '#008542',
                            fontWeight: 'bold'
                        }}> {this.state.numOfEvents} {"\n"}{"\n"}
                            Events attended </Text>
                    </View>

                    <TouchableOpacity onPress={this.onRedeemPressed}
                        style={{
                            width: '100%', backgroundColor: 'white'
                        }}>
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 20,
                            paddingTop: 25,
                            //paddingBottom: 30,
                            color: '#c75b12',
                            fontWeight: 'bold'
                        }}>
                            Tap here to
            </Text>
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 30,
                            paddingBottom: 30,
                            color: '#c75b12',
                            fontWeight: 'bold'
                        }}>
                            Redeem Whoosh Bits!
            </Text>
                    </TouchableOpacity>


                    <View style={{
                        width: '100%',
                        paddingBottom: 30,
                    }}>
                        {
                            <ListView
                                dataSource={this.state.dataSource}
                                renderRow={this.renderRow.bind(this)} />
                        }
                    </View>

                </View>

            </ScrollView>
        ); //return

    } //Render

    renderRow(events) {
        return (

            <View style={
                {
                    display: "flex",
                    flexDirection: "row",
                    borderBottomWidth: .5,
                    borderColor: '#d3d3d3',
                    width: '100%',
                    backgroundColor: 'white',
                    paddingTop: 15,
                    paddingBottom: 15,
                    paddingLeft: 8
                }
            }>


                <ScrollView>
                    <View style={{ width: '100%', flexGrow: 1 }}>
                        <Text style={{ color: '#008542' }}>{events.eventTitle}</Text>
                        <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={{ color: '#008542' }}>{this.utcToLocal(events.eventDate.toString())} </Text>
                            <Text style={{ color: '#008542' }}>{events.whooshBits} </Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 15, paddingLeft: 300, flex: 0, width: '100%' }}>
                        <Text style={{ color: '#008542', fontWeight: 'bold', fontSize: 16 }}>{events.attandingCount}</Text>
                    </View>
                </ScrollView>



            </View>
        );
    }


} //Class


