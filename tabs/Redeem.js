/**
 * JonssonConnect Redeem Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, Button, TouchableOpacity, Alert } from 'react-native';
import { Container, Header, Content, Accordion, Form, Item, Input, Label } from "native-base";
import CodeDisplay from './CodeDisplay';

export default class Redeem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            generateQRdata: '',
            redeemWhooshBits: false,
            whooshBitsValue: '0',
            redeemPressed: false,
        };
    }

    redeemPointsUpdater(w) {
        this.setState({
            whooshBitsValue: w
        })
    }

    displayQRCode() {
        var woosh = this.state.whooshBitsValue;
        console.log("FROM REDEEM PAGE: " + woosh);
        this.props.navigation.navigate('CodeDisplay',{woosh});
    }

    whooshBitsRedeemed = () => {
        // Alert.alert("Your QR code has been generated!");
        this.setState({
            isLoading: true,
            redeemPressed: true
        })
    }

    render() {
        return (
            <ScrollView style={styles.masterView}>
                <View style={styles.infoStyle}>
                    <Text style={fontWeight = "bold"}>Redeem Whoosh Bits!</Text>
                    <Text>Go ahead and enter the number of points you want to redeem below and then hit the redeem button!</Text>
                    <Text>Then, show the QR code to an attendant to approve your redeem points request!</Text>
                </View>
                
                <Form style={styles.formView}>
                    <Item stackedLabel>
                        <Label>Whoosh Bits to Redeem?</Label>
                        <Input onChangeText={(w)=>{(this.redeemPointsUpdater(w))}} name="whooshBits" />
                        {console.log('Whoosh Bits value entered: ' + this.state.whooshBitsValue)}
                    </Item>
                    <TouchableOpacity
                        onPress={() => this.displayQRCode()}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>{this.state.isLoading ? 'Redeeming...' : 'Redeem Whoosh Bits!'}</Text>
                    </TouchableOpacity>
                </Form>
            </ScrollView>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginTop: 50,
        padding: 20,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 30,
    },
    buttonText: {
        color: '#E98300',
        fontSize: 16,
        fontWeight: '200'
    },
    masterView: {
        backgroundColor: '#FFFFFF',
    },
    formView: {
        paddingTop: 40,
    },
    infoStyle: {
        textAlign: "center",
    }
});