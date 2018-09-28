import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Container, Header, Content, Accordion, Button } from "native-base";
import t from 'tcomb-form-native';


const dataArray = [
    { title: "What is Jonsson Connect?", content: "Jonsson Connect is an app for UTD Engineering and Computer Science students and alumni." },
    { title: "How can I get whoosh bits?", content: "Attend events and scan the qr code in the end!" },
    { title: "Who are eligible to get rewards", content: "UTD alumni and current students are eligible to get rewards." }
];

const Form = t.form.Form;

const Person = t.struct({
    name: t.String,              // a required string
    email: t.String,  // an optional string
    feedback: t.String
});

const options = { underlineColorAndroid: 'transparent' };

export default class Help extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScrollView style={styles.masterView}>
                <View>
                    <Accordion
                        dataArray={dataArray}
                        headerStyle={{ backgroundColor: "#FFFFFF" }}
                    />
                </View>

                <Button info style={styles.button}><Text> Contact Us </Text></Button>

                <View style={styles.container}>
                    <Form type={Person} options={options} />
                </View>
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
        padding: 25,
        marginTop: 30,
    },
    masterView: {
        backgroundColor: '#FFFFFF',
    }
});