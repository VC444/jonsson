import React, { Component } from 'react';
import { Text, View} from 'react-native';

export default class Help extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View><Text>This is the Help & Feedback component</Text></View>
        );
    }
}