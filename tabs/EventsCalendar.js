import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import React, { Component } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput } from 'react-native';

export default class EventsCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <View><Text>Hello this is EventsCalendar.js</Text></View>
        )
    }
}