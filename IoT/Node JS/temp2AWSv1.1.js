//BeagleBone NodeJs library
var b = require('bonescript');
var rest = require('restify');
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

//
var ip = '10.64.55.74'
var port = '18080'
var path = 'temperature'
var tempPin = 'P9_33';
var currentTemp = 0.0;
var datetime;

b.analogRead(tempPin, readTemperature) //read temperature from sensor

function temp2AWS() {
device
  .on('connect', function() {
    console.log('connect');
    //device.subscribe('sdkTest/sub');

    timeout = setInterval( function() {
            b.analogRead(tempPin, readTemperature) //read temperature from sensor
	    datetime = new Date().today() + " " + new Date().timeNow();
    	    device.publish('sdkTest/sub', JSON.stringify({ temperature: currentTemp})); //publish sensor data to AWS
	    device.publish('sdkTest/sub1', JSON.stringify({ timestamp: datetime})); //publish sensor data to AWS
	    device.publish('sdkTest/sub2', JSON.stringify({ randomNumber: Math.random()})); //publish sensor data to AWS
	    device.publish('sdkTest/dogshit', JSON.stringify({ DogPoo: Math.random()})); //publish sensor data to AWS
	    device.publish('sdkTest/Karthik', JSON.stringify({ Bandi: Math.random()})); //publish sensor data to AWS
	    //console.log('publish message...');
        }, 5000);  // clip to minimum
    });
device 
  .on('close', function() {
    console.log('close');
    clearInterval( timeout );
  });
device 
  .on('reconnect', function() {
    console.log('reconnect');
  });
device 
  .on('offline', function() {
    console.log('offline');
    clearInterval( timeout );
  });
device
  .on('error', function(error) {
    console.log('error', error);
    clearInterval( timeout );
  });
device
  .on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
  });
}

var server = rest.createServer({
     name : "Temperature"
});

server.get({path : path , version : '1.0.0'}, getTemperature);

server.listen(port,ip, function() {
     console.log('%s listening at %s ',server.name, server.url);
});

temp2AWS();

function getTemperature(req, res, next) {
     var tempResponse = {"temperature":currentTemp};
     res.send(200, tempResponse);
}

function readTemperature (tRead) {
    //console.log("Getting Temp");
    var x = (tRead.value*1800);
    var cel = (x-500)/100;
    var fah = (cel *9/5)+32;
    currentTemp = cel;
}

// For todays date;
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}
