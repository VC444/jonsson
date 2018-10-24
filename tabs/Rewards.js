/**
 * JonssonConnect Rewards Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, Linking, Dimensions, TouchableOpacity, ImageBackground, ListView, ScrollView, ActivityIndicator, AsyncStorage} from 'react-native';
import { Container, List } from 'native-base';
import * as firebase from 'firebase';

import firebaseApp from './EventDetails';
import config from './EventDetails'

export default class Rewards extends Component {

    constructor(props) {
        super(props);
        const ev = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            isLoading: true, 
            refreshing: false,
            dataSource: ev.cloneWithRows([]),
            points: 0,
            numOfEvents: 0
         };
        this.renderRow = this.renderRow.bind(this)
    }


    async componentDidMount() {

        this.setState({
            userID: await AsyncStorage.getItem('userID'),
            isLoading: false
          });

        var rewardRefString = 'Rewards/' + this.state.userID;
        console.log('rewardsRefString is ' + rewardRefString);
        var rewardsRef = firebase.database().ref(rewardRefString);
        console.log('rewardsRef is ' + rewardsRef);
        rewardsRef.once('value', data => {
            var rewardsData = data.val();
            var points = rewardsData.points;
            var numOfEvents = rewardsData.numOfEvents;
            console.log('rewardsData is ' + points);
            this.setState({points});
            this.setState({numOfEvents});
        });
        
        return fetch('https://jonssonconnect.firebaseio.com/Events.json')
          .then((response) => response.json())
          .then((responseJson) => {
              //console.log(responseJson);
              var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            this.setState({
              isLoading: false,
              dataSource: ds.cloneWithRows(responseJson),
              data: responseJson.Events,
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
          this.props.navigation.navigate('Redeem');
      }




    render() {

        if (this.state.isLoading) {
            return (
              <View style={{ flex: 1, paddingTop: 20 }}>
                <ActivityIndicator />
              </View>
            );
          }
          console.log('this is user id from rewards component' + this.state.userID);

        return(
    <ScrollView> 
        <ImageBackground
              style={{width: null, height: 130}}
              blurRadius={0}
              source={require('../images/image6.jpg')}>
              <View style={{ paddingTop: 10, width: 400, backgroundColor: 'rgba(0,0,0,0)',
               paddingLeft: 15,  alignItems: 'center', justifyContent: 'center',}}/>
        </ImageBackground>

        <View style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap : 'wrap',
            borderColor: '#008542',
        }}>
    
            <View style={{
                width: '50%', height: '16%', backgroundColor: 'white'}}>
                <Text style={{
                    textAlign:'center', 
                    fontSize: 17, 
                    paddingTop: 15,
                    color: '#008542',
                    fontWeight: 'bold'}}>
                    {this.state.points} {"\n"}{"\n"}
                    Whoosh Bits</Text>
            </View>

            <View style={{
                width: '50%', height: '16%', backgroundColor: 'white'}}>
                
                <Text style={{
                    textAlign:'center', 
                    fontSize: 17, 
                    paddingTop:15,
                    color: '#008542',
                    fontWeight: 'bold'
                }}> {this.state.numOfEvents} {"\n"}{"\n"}
                Events attended </Text>
            </View>
            
        <TouchableOpacity onPress={this.onRedeemPressed}
        style={{
            width: '100%', height: '14%', backgroundColor: 'white'}}>
            <Text style={{
                    textAlign:'center', 
                    fontSize: 32, 
                    padding: 25,
                    color: '#c75b12',
                    fontWeight: 'bold'}}>
                    Redeem Rewards!
            </Text>
        </TouchableOpacity>

                
        <View style={{width: '100%'}}>{
            <ListView 
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)} />
        }
        </View>

      </View>

    </ScrollView> 
        ); //return
        
    } //Render
    
    renderRow(events){
        return(
                   
            <View style={
                {
                    display: "flex",
                    flexDirection: "row",
                    borderBottomWidth: .5,
                    borderColor: '#d3d3d3',
                    width: '100%',
                    backgroundColor: 'white',
                    paddingTop:15,
                    paddingBottom: 15, 
                    paddingLeft: 8
                }
            }>
        <ScrollView>
            <View style={{width: '100%',flexGrow:1}}>
                <Text style={{color: '#008542'}}>{events.eventTitle}</Text>
                <Text style={{color: '#008542', paddingTop:10}}>{events.eventDate}</Text>
            </View>
            <View style={{marginTop: 15, paddingLeft: 300, flex:0, width: '100%'}}>
                <Text style={{color: '#008542',fontWeight: 'bold', fontSize: 16}}>{events.attandingCount}</Text>
            </View>
        </ScrollView>
        </View>
        );
    }

    
} //Class

