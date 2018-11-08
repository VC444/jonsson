import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, Button, TouchableOpacity, Alert } from 'react-native';
import { Container, Header, Content, Accordion, Form, Item, Input, Label } from "native-base";
import * as firebase from 'firebase';
import Axios from 'axios';


const dataArray = [
    { title: "What is Jonsson Connect?", content: "Jonsson Connect is an app for UTD Engineering and Computer Science students and alumni." },
    { title: "How can I get whoosh bits?", content: "Attend events and scan the qr code in the end!" },
    { title: "Who are eligible to get rewards?", content: "UTD alumni and current students." }
];

export default class Help extends Component {

    constructor(props) {
        super(props);
        this.state = {
            giveFeedback: false,
            email : '',
            message : '',
            isLoading : false 
        };
        this.feedbackSubmitted = this.feedbackSubmitted.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.postFeedback = this.postFeedback.bind(this);
    }
    handleEmailChange(e){
        this.setState({
            email : e
        });
    }
    handleMessageChange(e){
        this.setState({
            message : e
        })
    }
    /****************************************/
    postFeedback = (email, message, emailClear, messageClear) =>{
        if(this.state.message!=null){
            if(!this.state.isLoading){
                const self = this;
            fetch('https://jonssonconnect.firebaseio.com/Feedback.json?auth=qKeO1eylfWgscqfLFVGMv298g6KlHo0BRN8E2kFb', {
                method: 'POST',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({
                    "email": email, 
                    "message": message,
                })
            })
            .then((response) => response.json() )
            .then((responseData) => {
                if(!responseData.error){
                    self.setState({
                        email: '', message: '',
                        isSubmited: true,
                        giveFeedback : false,
                        isLoading : false 
                    })
                }
                else {
                    Alert.alert(
                        responseData.error,
                        [
                            {text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},

                        ],
                        { cancelable: false}
                    )
                }
            })
            .catch((err)=>{
                
            })
             
        }
        }
        else {
            Alert.alert(
                'Oops!',
                'Press the SUBMIT button after entering your message.',
                [
                    {text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                {cancelable: false}
            )
        }
    };


    giveFeedbackPressed = () => {
        this.setState({ giveFeedback: true });
    }

    feedbackSubmitted = () => {
        Alert.alert("Feedback has been submitted! Thank you");
        this.setState({
            isLoading :true
        })
        this.postFeedback(this.state.email, this.state.message);
    }

    render() {
        if (this.state.giveFeedback == false) {
            return (
                <ScrollView style={styles.masterView}>
                    <View>
                        <Accordion
                            dataArray={dataArray}
                            headerStyle={{ backgroundColor: "#FFFFFF" }}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={this.giveFeedbackPressed}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Give Feedback</Text>
                    </TouchableOpacity>


                </ScrollView>
            );
        } else {
            return (
                <ScrollView style={styles.masterView}>
                    <View>
                        <Accordion
                            dataArray={dataArray}
                            headerStyle={{ backgroundColor: "#FFFFFF" }}
                        />
                    </View>

                    <Form style={styles.formView}>
                        <Item stackedLabel>
                            <Label>Email ID (@utdallas.edu is preferred!)</Label>
                            <Input value={this.state.email} onChangeText={(e)=>{this.handleEmailChange(e)}} name="email"/>
                        </Item>
                        <Item stackedLabel>
                            <Label>How can we improve?</Label>
                            <Input value={this.state.message} onChangeText={(e)=>{this.handleMessageChange(e)}} name="message"/>
                        </Item>
                        
                        <TouchableOpacity
                            onPress={this.feedbackSubmitted}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>{this.state.isLoading?'Submitting... Give Us A Sec!':'Submit'}</Text>
                        </TouchableOpacity>

                    </Form>

                </ScrollView>
            );
        }
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
        // borderWidth: 0.5,
        // borderRadius: 10,
        // padding: 10
    },
    masterView: {
        backgroundColor: '#FFFFFF',
    },
    formView: {
        paddingTop: 40,
    }
});