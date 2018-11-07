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
            whooshBitsValue: '69',
            redeemPressed: false,
        };
    }

    redeemPointsHandler(w) {
        this.setState({
            whooshBitsValue: w
        })
    }

    redeemWhooshBitsPressed = () => {
        this.setState({ redeemWhooshBits: true });
    }

    whooshBitsRedeemed = () => {
        Alert.alert("Your QR code has been generated!");
        this.setState({
            isLoading: true,
            redeemPressed: true
        })
        // this.redeemPointsHandler();
        //var whooshBitsString = whooshBits;
    }

    render() {
        if (this.state.redeemPressed == true) {
            return (
                <CodeDisplay whooshBitsValue={this.state.whooshBitsValue} />
            )
        }
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
                        <Input onChangeText={(points => this.redeemPointsHandler(points))} name="whooshBits" />
                        {console.log('Whoosh Bits value entered: ' + this.state.whooshBitsValue)}
                    </Item>
                    <TouchableOpacity
                        onPress={this.whooshBitsRedeemed}
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
        // borderWidth: 0.5,
        // borderRadius: 10,
        // padding: 10
    },
    masterView: {
        backgroundColor: '#FFFFFF',
    },
    formView: {
        paddingTop: 40,
    },
    infoStyle: {
        textAlign: "center",
        textColor: "#000000"
    }
});