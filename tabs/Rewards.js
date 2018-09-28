import React, { Component } from 'react';
import { StyleSheet, Text, View, Linking, Dimensions, TouchableOpacity, ListView, ScrollView} from 'react-native';
import { Container, List } from 'native-base';

export default class Rewards extends Component {

    constructor(props) {
        super(props);
        const ev = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            events : [
                {type: "Hanshake Event",date: "03/26/18", points:"5"},
                {type: "TI Resume Critique", date: "03/30/18", points:"6"},
                {type: "Google event", date: "03/31/18", points:"8"},
                {type: "TI Resume Critique", date: "03/30/18", points:"6"},
                {type: "Hanshake Event",date: "03/26/18", points:"5"},
                {type: "TI Resume Critique", date: "03/30/18", points:"6"},
                {type: "Google event", date: "03/31/18", points:"8"}]
        };
        this.renderRow = this.renderRow.bind(this)
    }

    render() {
        return(
    <ScrollView> 
        <View style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap : 'wrap',
            borderColor: '#008542',
        }}>
    
            <View style={{
                width: '50%', height: '16%', backgroundColor: 'white'}}>
                <Text style={{
                    textAlign:'center', 
                    fontSize: 18, 
                    paddingTop: 20,
                    color: '#008542',
                    fontWeight: 'bold'}}>
                    50 {"\n"}{"\n"}
                    Whoosh Bits</Text>
            </View>

            <View style={{
                width: '50%', height: '16%', backgroundColor: 'white'}}>
                
                <Text style={{
                    textAlign:'center', 
                    fontSize: 18, 
                    paddingTop:20,
                    color: '#008542',
                    fontWeight: 'bold'
                }}> 7 {"\n"}{"\n"}
                Events attended </Text>
            </View>
            
        <TouchableOpacity 
        style={{
            width: '100%', height: '16%', backgroundColor: 'white'}}>
            <Text style={{
                    textAlign:'center', 
                    fontSize: 32, 
                    padding: 30,
                    color: '#c75b12',
                    fontWeight: 'bold'}}>
                    Redeem Rewards!
            </Text>
        </TouchableOpacity>

                
        <View style={{width: '100%'}}>{
            this.state.events.map((data)=> {
                return this.renderRow(data);
            })
        }
        </View>

      </View>

    </ScrollView> 
        ); //return
        
    } //Render

    //List View Stuff...
    
    renderRow(events){
        return(
                   
            <View style={
                {
                    display: "flex",
                    flexDirection: "row",
                    borderBottomWidth: .5,
                    borderColor: '#d3d3d3',
                    width: '100%',
                    backgroundColor: 'white',
                    fontSize: '16',
                    paddingTop:10,
                    paddingBottom: 15, 
                    paddingLeft: 8
                }
            }>
        <ScrollView>
            <View style={{width: '100%',flexGrow:1}}>
                <Text style={{color: '#008542'}}>{events.type}</Text>
                <Text style={{color: '#008542', paddingTop:10}}>{events.date}</Text>
            </View>
            <View style={{marginTop: -20, paddingLeft: 300, flex:0, width: '100%'}}>
                <Text style={{color: '#008542',fontWeight: 'bold', fontSize: 16}}>{events.points}</Text>
            </View>
        </ScrollView>
        </View>
        );
    }


 






    
} //Class

