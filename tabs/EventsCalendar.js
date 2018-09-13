import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

import React, { Component } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput } from 'react-native';

import * as firebase from 'firebase';


//The below 3 imports were used to fix the iterator error
import 'core-js/es6/map'
import 'core-js/es6/symbol'
import 'core-js/fn/symbol/iterator'


export default class EventsCalendar extends Component {
    constructor(props) {


        // When you press calendar symbol, it logs the event dates formatted in the form of "formattedDate" list.

        /******************************************************************************************************** */
        var dateOfEvent = firebase.database().ref("Events/");
        dateOfEvent.on('value', gotData, errData)

        function gotData(data) {
            var dates = data.val()
            var keys = Object.keys(dates)
            var formattedDate = []

            for (var i = 0; i < keys.length; i++) {
                var k = keys[i];
                var date_of_event = dates[k].eventDate;

                var format_res = date_of_event.substring(0, 10);

                formattedDate[i] = format_res

            }
            console.log(formattedDate)


        }

        function errData(err) {
            console.log(err)
        }
        /************************************************************************************************** */



        super(props);
        this.state = {
        }


    }

    render() {

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ]
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
            "Saturday"
        ]

        const date = new Date()
        var month = date.getMonth() + 1;
        var year = date.getFullYear()
        var day = date.getDate()
        var fullDate = year + '-' + month + '-' + day;
        console.log(fullDate);
        let fullDateString = fullDate.toString();

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
                    //*********************************************************************************************************************************************
                    markedDates={{
                        fullDate: { selected: true, marked: true }, //NOT YET WORKING!!!!
                        '2018-09-13': { marked: true },
                        '2018-09-14': { marked: true },
                        '2018-09-15': { marked: true }
                    }}
                    // callback that gets called on day press
                    onDayPress={(day) => { }}
                    // the list of items that have to be displayed in agenda. If you want to render item as empty date
                    // the value of date key kas to be an empty array []. If there exists no value for date key it is
                    // considered that the date in question is not yet loaded
                    //*********************************************************************************************************************************************
                    items={ //NOT YET WORKING!!!!
                        {
                            '2018-09-12': [{ text: 'item 1 - any js object' }],
                            '2018-09-13': [{ text: 'item 2 - any js object' }],
                            '2018-09-14': [],
                            '2018-09-15': [{ text: 'item 3 - any js object' }, { text: 'any js object' }],
                        }}
                />

                {/* <Agenda
                    // the list of items that have to be displayed in agenda. If you want to render item as empty date
                    // the value of date key kas to be an empty array []. If there exists no value for date key it is
                    // considered that the date in question is not yet loaded
                    items={
                        {
                            // '2018-09-12': [{ text: 'item 1 - any js object' }],
                            // '2018-09-13': [{ text: 'item 2 - any js object' }],
                            // '2018-09-14': [],
                            // '2018-09-15': [{ text: 'item 3 - any js object' }, { text: 'any js object' }],
                        }}
                    // callback that gets called when items for a certain month should be loaded (month became visible)
                    loadItemsForMonth={(month) => { console.log('trigger items loading') }}
                    // callback that fires when the calendar is opened or closed
                    onCalendarToggled={(calendarOpened) => { console.log(calendarOpened) }}

                    // callback that gets called when day changes while scrolling agenda list
                    onDayChange={(day) => { console.log('day changed') }}
                    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                    minDate={'2018-08-12'}
                    // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                    maxDate={'2018-12-31'}
                    // Max amount of months allowed to scroll to the past. Default = 50
                    pastScrollRange={0}
                    // Max amount of months allowed to scroll to the future. Default = 50
                    futureScrollRange={6}
                    // specify how each item should be rendered in agenda
                    renderItem={(item, firstItemInDay) => { return (<View />); }}
                    // specify how each date should be rendered. day can be undefined if the item is not first in that day.
                    renderDay={(day, item) => { return (<View />); }}
                    // specify how empty date content with no items should be rendered
                    renderEmptyDate={() => { return (<View />); }}
                    // specify how agenda knob should look like
                    renderKnob={() => { return (<View />); }}
                    // specify what should be rendered instead of ActivityIndicator
                    renderEmptyData={() => { return (<View />); }}
                    // specify your item comparison function for increased performance
                    rowHasChanged={(r1, r2) => { return r1.text !== r2.text }}
                    // Hide knob button. Default = false
                    hideKnob={true}
                    // By default, agenda dates are marked if they have at least one item, but you can override this if needed
                    markedDates={{
                        '2012-05-16': { selected: true, marked: true },
                        '2012-05-17': { marked: true },
                        '2012-05-18': { disabled: true }
                    }}
                    // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
                    onRefresh={() => console.log('refreshing...')}
                    // Set this true while waiting for new data from a refresh
                    refreshing={false}
                    // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView.
                    refreshControl={null}
                    // agenda theme
                    theme={{
                        agendaDayTextColor: 'yellow',
                        agendaDayNumColor: 'green',
                        agendaTodayColor: 'red',
                        agendaKnobColor: 'blue'
                    }}
                    // agenda container style
                    style={{}}
                /> */}
            </View>
        )
    }
}