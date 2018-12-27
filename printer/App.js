import React, {Component,NativeModules} from 'react';
import {Platform, StyleSheet, TouchableOpacity, Text,TouchableHighlight,Button,View} from 'react-native';
import { NetPrinter } from 'react-native-printer';

import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';

const printers = [];
type Props = {};

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      printers,
      currentPrinter:null,
      selectedPrinter: null
    };
  }

  ////// impresion termica //////
  componentDidMount = () => {
    NetPrinter.init().then(() => {
      this.setState(Object.assign({}, this.state, {printers: [{device_name:'Epson',host: '192.168.1.23', port: 9100}]}))
      })  
  }

_connectPrinter = (host, port) => {     
  NetPrinter.connectPrinter('192.168.1.23', 9100).then(
    (printer) => this.setState(Object.assign({}, this.state, {currentPrinter: printer})), 
    error => console.warn(error))
}

printTextTest = () => {
  if(this.state.currentPrinter) {
    NetPrinter.printBill("Texto simple \t con Ruben \nComo estas");
  }else{
    console.log("没有设置打印机")
  }  
}

///////////////////////////// PDF ///////

selectPrinter = async () => {
  const selectedPrinter = await RNPrint.selectPrinter()
  this.setState({ selectedPrinter })
}

async printHTML() {
  await RNPrint.print({
    html: '<h1 style="font-style:italic">Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3>'
  })
}

customOptions = () => {
  return (
    <View>
      {this.state.selectedPrinter &&
        <View>
          <Text>{`Selected Printer Name: ${this.state.selectedPrinter.name}`}</Text>
          <Text>{`Selected Printer URI: ${this.state.selectedPrinter.url}`}</Text>
        </View>
      }
    <Button onPress={this.selectPrinter} title="Select Printer" />
    <Button onPress={this.silentPrint} title="Silent Print" />
  </View>

  )
}

/////////////////////////////

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
        <Button onPress={this.printHTML} title="Print HTML" />
        <Button onPress={this.printPDF} title="Print PDF" />
        <Button onPress={this.printRemotePDF} title="Print Remote PDF" />
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
