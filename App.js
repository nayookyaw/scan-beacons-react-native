import React, { Component } from 'react';
import { View, DeviceEventEmitter, Platform, PermissionsAndroid,
  TouchableOpacity, Text, Button } from 'react-native';

import Kontakt from 'react-native-kontaktio';
const { connect, startScanning } = Kontakt;

export default class MinimalExample extends Component {

  constructor(props) {
    super(props);
    this.state = {
      locationGranted : "unknown",
      coarseGranted : "uknown",
      beacons : "",
      regions: "",
      scanningStatus: "idle mode"
    }

    this.askLocationPermission = this.askLocationPermission.bind(this);
    this.askCoarsePermission = this.askCoarsePermission.bind(this);
    this.scanDevices = this.scanDevices.bind(this);
  }

  async componentDidMount() {
    alert("Welcome to Beacon Scanner");
  }

  async askLocationPermission() {
    console.log ("Ask Persmission for location")

     let locationGrant = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Access ',
        message: 'Please allow location',
      },
    );

    if (locationGrant === PermissionsAndroid.RESULTS.GRANTED) {
      this.setState({ locationGranted: locationGrant });
    }
  }

  async askCoarsePermission() {
    console.log ("Ask Coarse permission")
    const coarseGrant = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: 'Location Access 1',
        message: 'Please allow location again',
      },
    );

    if (coarseGrant === PermissionsAndroid.RESULTS.GRANTED) {
      this.setState({ coarseGranted: coarseGrant });
    }
  }

  scanDevices () {
    console.log ("Scanning devices..")
    if (this.state.locationGranted === PermissionsAndroid.RESULTS.GRANTED && 
      this.state.coarseGranted === PermissionsAndroid.RESULTS.GRANTED) 
    {
      console.log ("Connecting....")
      connect()
      .then(() => startScanning())
      .catch(error => console.log('error', error));
    
      DeviceEventEmitter.addListener(
        'beaconsDidUpdate',
        ({ beacons, region }) => {
          console.log('beaconsDidUpdate', beacons, region);
          this.setState({ scanningStatus : "scanning..." });
          this.setState({beacons: JSON.stringify(beacons)  , regions : JSON.stringify(region) })
        },
      );
    } else {
      alert ("Check permission first!")
    }
    
  }

  render() {
    let { locationGranted, coarseGranted, beacons, regions } = this.state;

    return (
      <View>
        <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              color: 'white',
              backgroundColor: 'green'
            }}
          >
            Sample Beacon Scanner
        </Text>
        <Text>{"\n"}</Text>

        <TouchableOpacity>
          <Button title="Ask Location Permission" 
            onPress={this.askLocationPermission}
          />
        </TouchableOpacity>
        <Text>{"\n"}</Text>

        <TouchableOpacity>
          <Button title="Ask coarse Permission" 
            onPress={this.askCoarsePermission}
          />
        </TouchableOpacity>
        <Text>{"\n"}</Text>

        <TouchableOpacity>
          <Button title="Scan Devices" 
            color="#841584"
            onPress={this.scanDevices}
          />
        </TouchableOpacity>

        <Text>Granted Status : {locationGranted} </Text>
        <Text>Coarse Status : {coarseGranted} </Text>
        
        <Text>{"\n"}{"\n"}{"\n"}</Text>

        <Text style={{
            fontSize: 15,
            textAlign: 'center',
            color: 'green',
            backgroundColor: 'yellow'
          }}
        >
          Environment Beacons - {this.state.scanningStatus} 
        </Text>
        <Text>Beacons : { this.state.beacons}</Text>
        <Text>Regions : {this.state.regions}</Text>

      </View>
    )
  }
}