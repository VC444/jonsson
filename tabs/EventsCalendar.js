/**
 * JonssonConnect EventsCalendar Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import { CalendarList } from 'react-native-calendars';

import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';

import * as firebase from 'firebase';


//The below 3 imports were used to fix the iterator error
import 'core-js/es6/map'
import 'core-js/es6/symbol'
import 'core-js/fn/symbol/iterator'

const dot_color = { color: 'white' }; // Constant dot color
// var massage = {color: 'blue'};
// var workout = { color: 'green'};
// const blah = { color: 'yellow'};
// const fee = { color: 'black'};


export default class EventsCalendar extends Component {

    constructor(props) {

        super(props);
        this.state = {
            marked: false,
            formattedDate: [],
            userID: 'userID',
            userClassification: 'clasification',
        }
    }

    // Checks if the user is classified as a (student/alumni/admin), and sends that data to gotUserData()
    async componentDidMount() {
        this.setState({ userID: await AsyncStorage.getItem('userID') });
        var classificationRef = firebase.database().ref("Users/" + this.state.userID + "/classification/");
        classificationRef.once('value', this.gotUserData, this.errData);
    }

    // Filters event results based on user classification
    gotUserData = (data) => {
        var userInfo = data.val();
        //console.log('class vc ' + userInfo);
        this.setState({ userClassification: userInfo });
        var dateOfEvent = firebase.database().ref("Events/");

        // If user is an admin, show all events
        if (userInfo == 'admin')
            dateOfEvent.on('value', this.gotData, this.errData);
        else {
            var totalData = [];
            // Get events that match user's classification and push it to totalData
            dateOfEvent.orderByChild('eventClassification').equalTo(this.state.userClassification).once('value', snapshot => {
                snapshot.forEach(snap => {
                    totalData.push(snap.val());
                })
            });

            // Get events that are classified as 'both' and push it to totalData
            dateOfEvent.orderByChild('eventClassification').equalTo('both').once('value', bothEvents => {
                bothEvents.forEach(snap => {
                    totalData.push(snap.val());
                })
            }).then(() => {
                this.gotData(totalData); // send totalData to gotData function
            })
        }
    }

    gotData = (data) => {
        var dates = data;
        var keys = Object.keys(dates)
        var formattedDate = []

        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var date_of_event = dates[k].eventDate;
            var format_res = date_of_event.substring(0, 10);
            formattedDate[i] = format_res
        }

        // Set formattedDate array that is initialized in state to values of local formattedDate array 
        // and then call anotherFunc
        this.setState({ formattedDate }, this.anotherFunc);

        console.log('formatted date in state is ' + this.state.formattedDate);
    }

    errData = (err) => {
        console.log(err);
    }

    // call function after you successfully get value in nextDay array

    anotherFunc = () => {
        var nextDay = this.state.formattedDate;

        console.log(nextDay)



        var sorted_arr = nextDay.slice().sort(); // You can define the comparing function here. 
        // JS by default uses a crappy string compare.
        // (we use slice to clone the array so the
        // original array won't be modified)
        var results = [];
        for (var i = 0; i < sorted_arr.length - 1; i++) {
            if (sorted_arr[i + 1] == sorted_arr[i]) {
                results.push(sorted_arr[i]);
            }
        }

        console.log(results);
        //var orginal_dates = ["2018-11-14", "2019-01-01", "2018-10-18"]

        var b1 = new Set(results);
        var difference = [...new Set([...nextDay].filter(x => !b1.has(x)))];

        console.log(difference);

        var dot_color_array = Array(2).fill(eval('dot_color')) // creating array of variable names

        var obj = results.reduce((c, v) => Object.assign(c, { [v]: { dots: dot_color_array, selected: true, selectedColor: '#c75b12' } }), {});

        var dottom = Array(1).fill(eval('dot_color')) // creating array of variable names

        for (var i = 0; i < difference.length; i++) {
            obj[difference[i]] = { dots: dottom, selected: true, selectedColor: '#c75b12' }
            //Do something
        }



        this.setState({ marked: obj });
    }

    render() {

        const date = new Date()
        var year = date.getFullYear()
        var month = date.getMonth() + 1;
        if (month <= 9)
            month = '0' + month;
        var day = date.getDate();
        if (day <= 9)
            day = '0' + day;
        var fullDate = year + '-' + month + '-' + day;
        var stringDate = fullDate.toString();
        console.log('this is fulldateeeeeee' + stringDate);

        return (
            <View>
                <CalendarList
                    // Max amount of months allowed to scroll to the past. Default = 50
                    pastScrollRange={0}
                    // Max amount of months allowed to scroll to the future. Default = 50
                    futureScrollRange={6}
                    // Enable or disable scrolling of calendar list
                    scrollEnabled={true}
                    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                    minDate={stringDate}
                    // By default, agenda dates are marked if they have at least one item, but you can override this if needed
                    markedDates={this.state.marked}
                    //This attribute enables multiple dots on a single date
                    markingType={'multi-dot'}
                    // callback that gets called on day press
                    onDayPress={(day) => {
                        //if (someVariable == true)
                        //{
                        console.log("STRINGIFY: " + JSON.stringify(day.dateString));
                        var hasEvent = false;
                        for (var date in this.state.marked) {
                            console.log('This is marked state object: ' + date);
                            if (day.dateString == date) {
                                hasEvent = true;
                            }
                        }
                        if (hasEvent) {
                            this.props.navigation.navigate("Agenda", { day });
                        } else {
                            alert('Aw Snap! We don\'t have any events to show for this date. Sorry!');
                        }
                        // var dateString = JSON.stringify(day.dateString)

                        //} 
                    }}
                />
            </View>
        )
    }
}