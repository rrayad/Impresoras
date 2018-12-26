/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, TouchableOpacity, Text,TouchableHighlight,Button,View} from 'react-native';
import { NetPrinter } from 'react-native-printer';

const printers = [];









type Props = {};
export default class App extends Component<Props> {
  

  
  constructor(props) {
    super(props);

    this.state = {
      printers,
      currentPrinter:null
    };
  }

  componentDidMount = () => {
    NetPrinter.init().then(() => {
      this.setState(Object.assign({}, this.state, {printers: [{device_name:'Epson',host: '192.168.1.23', port: 9100}]}))
      })
  
}

_connectPrinter = (host, port) => {
   
  //connect printer
  NetPrinter.connectPrinter('192.168.1.23', 9100).then(
    (printer) => this.setState(Object.assign({}, this.state, {currentPrinter: printer})), 
    error => console.warn(error))

}

printTextTest = () => {
  if(this.state.currentPrinter) {
    NetPrinter.printText("Ruben Raya");
  }else{
    console.log("没有设置打印机")
  }
  
}
printBillTest = () => {
  if(this.state.currentPrinter) {
    NetPrinter.printBill("Reversa");
  }else{
    console.log("没有设置打印机")
  }
}


  render() {
    return (
      <View style={styles.container}>
        {
          this.state.printers.map(printer => (
            <TouchableHighlight key={printer.device_id} onPress={(printer) => this._connectPrinter(printer.host, printer.port)}>
              <Text>{`device_name: ${printer.device_name}, host: ${printer.host}, port: ${printer.port}`}</Text>
            </TouchableHighlight>
            ))
        }
       
       <TouchableOpacity onPress={() => this.printTextTest()}>
          <Text> Print Text </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.printBillTest()}>
          <Text> Print Bill Text </Text>
        </TouchableOpacity>
        
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
