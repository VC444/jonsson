import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Accordion, Form, Item, Input, Label } from "native-base";


const dataArray = [
    { title: "What is Jonsson Connect?", content: "Jonsson Connect is an app for UTD Engineering and Computer Science students and alumni." },
    { title: "How can I get whoosh bits?", content: "Attend events and scan the qr code in the end!" },
    { title: "Who are eligible to get rewards?", content: "UTD alumni and current students." }
];

export default class Help extends Component {

    constructor(props) {
        super(props);
        this.state = {
            giveFeedback: false
        }
    }

    giveFeedbackPressed = () => {
        console.log('giveFeedbackPressed has fired');
        this.setState({ giveFeedback: true });
    }

    feedbackSubmitted = () => {
        console.log('Feedback has been submitted');
        this.setState({ giveFeedback: false });
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
                            <Label>Enter your email</Label>
                            <Input />
                        </Item>
                        <Item stackedLabel>
                            <Label>How can we improve?</Label>
                            <Input />
                        </Item>
                        
                        <TouchableOpacity
                            onPress={this.feedbackSubmitted}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Submit</Text>
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