import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Container, Header, Content, Accordion, Button, Form, Item, Input, Label } from "native-base";


const dataArray = [
    { title: "What is Jonsson Connect?", content: "Jonsson Connect is an app for UTD Engineering and Computer Science students and alumni." },
    { title: "How can I get whoosh bits?", content: "Attend events and scan the qr code in the end!" },
    { title: "Who are eligible to get rewards", content: "UTD alumni and current students are eligible to get rewards." }
];

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

                <Form style={styles.formView}>
                    <Item fixedLabel>
                        <Label>Name</Label>
                        <Input />
                    </Item>
                    <Item fixedLabel last>
                        <Label>Email</Label>
                        <Input />
                    </Item>
                    <Item rounded style={styles.formView}>
                        <Input placeholder='How can we improve Jonsson Connect?' />
                    </Item>
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