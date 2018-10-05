/**
 * JonssonConnect Redeem Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import React, { Component } from 'react';
import { Text, View} from 'react-native';
import { QRCode } from 'react-native-custom-qr-codes';

export default class Redeem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <Text>This is the QR Code page</Text>
                <QRCode
                content='WITH GREAT POWER, COMES GREAT MOKKAI!'
                //ecl = 'M'
                // outerEyeStyle='circle'
                // innerEyeStyle='diamond'
                backgroundColor = '#c75b12'
                //color = '#008542'
                logo={require('../images/temoc_icon.png')}
                />
                </View>
        );
    }
}