//BeagleBone NodeJs library
var b = require('bonescript');
//AWS IoT NodeJs library
var awsIot = require('aws-iot-device-sdk');

//Setting IoT device parameters
var device = awsIot.device({
   keyPath: '/root/awsCerts/private.pem.key',
  certPath: '/root/awsCerts/certificate.pem.crt',
    caPath: '/root/awsCerts/root-CA.crt',
  clientId: 'BeagleBone',
    region: 'eu-west-1'
});

//variables for sensor pins
var tempPin1 = 'P9_33'; //temperature sensor
var tempPin2 = 'P9_40'; //light sensor
var tempPin3 = 'P9_37'; //IR sensor
var tempPin4 = 'P9_38'; //FR sensor
var currentTemp = 0.0;
var currentLight = 0.0;
var currentDistance = 0.0;
var currentForce = 0.0;


var deviceMetaData = {
    "deviceID": "device01",
    "board-type": "BeagleBone Black",
    "Latitude": 48.143058,
    "Longitude": 11.550096,
    "timestamp": null,
    "sensorData": {
        "temperature": 0,
        "light": 0,
        "distance": 0,
        "force": 0
    },
};

b.analogRead(tempPin1, readTemperature) //read temperature from sensor
b.analogRead(tempPin2, readLight) //read Light from sensor
b.analogRead(tempPin3, readDistance) //read Distance from sensor
b.analogRead(tempPin4, readForce) //read Force from sensor

function temp2AWS() {
device
  .on('connect', function() {
    console.log('connect');
    //device.subscribe('sdkTest/sub');

    timeout = setInterval( function() {
        b.analogRead(tempPin1, readTemperature) //read temperature from sensor
	    b.analogRead(tempPin2, readLight) //read Light from sensor
	    b.analogRead(tempPin3, readDistance) //read Distance from sensor
	    b.analogRead(tempPin4, readForce) //read Force from sensor
        
        deviceMetaData.sensorData.temperature = currentTemp;
        deviceMetaData.sensorData.distance = currentDistance;
        deviceMetaData.sensorData.force = currentForce;
        deviceMetaData.sensorData.light = currentLight;
        deviceMetaData.timestamp = getTimestamp();

    	device.publish('devices/BeagleBone', JSON.stringify(deviceMetaData)); //publish date and time to AWS
	    //console.log('publish message...');
        }, 5000);  // clip to minimum
    });
}

temp2AWS();

// For temperature
function readTemperature (tRead) {
    //console.log("Getting Temperature");
    var x = (tRead.value*1800);
    var cel = (x-500)/10;
    var fah = (cel *9/5)+32;
    currentTemp = cel;
}

// For light
function readLight (lRead) {
    //console.log("Getting light");
    var l = (lRead.value*1800);
    currentLight = l;
}

// For distance
function readDistance (dRead) {
    //console.log("Getting distance");
    var d = (dRead.value*1.65);
    var dis = 13.93 * Math.pow(d,-1.15);
    currentDistance = dis;
}

// For force
function readForce (fRead) {
    //console.log("Getting force");
    var f = (fRead.value*1800);
    currentForce = f;
}

function getTimestamp(){
    var date = new Date();
    return date.toISOString();
}