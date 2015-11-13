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
var datetime;

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
	    datetime = new Date().today() + " " + new Date().timeNow();
    	device.publish('sdkTest/DateTime', JSON.stringify({ Timestamp: datetime})); //publish date and time to AWS
	    device.publish('sdkTest/Temperature', JSON.stringify({ Temperature: currentTemp, state:{reported: {on: false}}})); //publish temperature sensor data to AWS
	    device.publish('sdkTest/Light', JSON.stringify({ Light: currentLight})); //publish light sensor data to AWS
	    device.publish('sdkTest/Distance', JSON.stringify({ Distance: currentDistance})); //publish IR sensor data to AWS
	    device.publish('sdkTest/Force', JSON.stringify({ Force: currentForce})); //publish FR sensor data to AWS
	    device.publish('sdkTest/sub1', JSON.stringify({ Random_Number: Math.random()})); //publish a random number to AWS
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

// For todays date;
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}
