import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, Button } from 'react-native';
import { Container, Header, Content, Accordion, Form, Item, Input, Label } from "native-base";


const dataArray = [
    { title: "What is Jonsson Connect?", content: "Jonsson Connect is an app for UTD Engineering and Computer Science students and alumni." },
    { title: "How can I get whoosh bits?", content: "Attend events and scan the qr code in the end!" },
    { title: "Who are eligible to get rewards", content: "UTD alumni and current students are eligible to get rewards." }
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

                    <Button
                        onPress={this.giveFeedbackPressed}
                        title="Click ME"
                        color="blue"
                        style={styles.button}
                    />

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
                        <Button
                            onPress={this.giveFeedbackPressed}
                            title="Submit"
                            color="blue"
                            style={styles.button}
                        />
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
        padding: 25,
        marginTop: 30,
    },
    masterView: {
        backgroundColor: '#FFFFFF',
    },
    formView: {
        paddingTop: 20,
    }
});