import { CalendarList } from 'react-native-calendars';

import React, { Component } from 'react';
import { View } from 'react-native';

import * as firebase from 'firebase';


//The below 3 imports were used to fix the iterator error
import 'core-js/es6/map'
import 'core-js/es6/symbol'
import 'core-js/fn/symbol/iterator'

const dot_color = {color: 'white'}; // Constant dot color
// var massage = {color: 'blue'};
// var workout = { color: 'green'};
// const blah = { color: 'yellow'};
// const fee = { color: 'black'};


export default class EventsCalendar extends Component {

    constructor(props) {

        super(props);
        this.state = {
            disableTouchEvent: true,
            marked: false,
            formattedDate: [],
        }
    }

    componentWillMount = () => {
        // When you press calendar symbol, it logs the event dates formatted in the form of "formattedDate" list.
        /******************************************************************************************************** */
        var dateOfEvent = firebase.database().ref("Events/");
        dateOfEvent.on('value', this.gotData, this.errData);
        /************************************************************************************************** */
    }

    gotData = (data) => {
        var dates = data.val()
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
var orginal_dates = ["2018-11-14", "2019-01-01", "2018-10-18"]

var b1 = new Set(results);
var difference = [...new Set([...nextDay].filter(x => !b1.has(x)))];

console.log(difference);

        var dot_color_array = Array(2).fill(eval('dot_color')) // creating array of variable names
        
        var obj = results.reduce((c, v) => Object.assign(c, { [v]: {dots: dot_color_array, selected: true,selectedColor: 'red'} }), {});
        
        var dottom = Array(1).fill(eval('dot_color')) // creating array of variable names

        for (var i = 0; i < difference.length; i++) 
        {
            obj[difference[i]] = {dots: dottom, selected: true, selectedColor: 'blue'}
            //Do something
        }


        
        this.setState({ marked: obj });
    }

    render() {
        const date = new Date()
        var month = date.getMonth() + 1;
        var year = date.getFullYear()
        var day = date.getDate()
        var fullDate = year + '-' + month + '-' + day;
        console.log(fullDate);

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
                    minDate={fullDate}
                    // By default, agenda dates are marked if they have at least one item, but you can override this if needed
                    markedDates={this.state.marked}
                    //This attribute enables multiple dots on a single date
                    markingType={'multi-dot'}
                    // callback that gets called on day press
                    onDayPress={() => { 
                        //if (someVariable == true)
                        //{
                            this.props.navigation.navigate("Agenda")
                        //} 
                    }}
                />
            </View>
        )
    }
}