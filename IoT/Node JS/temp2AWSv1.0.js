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
  clientId: 'myAwsClientId',
    region: 'eu-west-1'
});

//  keyPath: args.privateKey,
//  certPath: args.clientCert,
//  caPath: args.caCert,
//  clientId: args.clientId,
//  region: args.region,
//  reconnectPeriod: args.reconnectPeriod

//
var ip = '10.64.55.74'
var port = '18080'
var path = 'temperature'
var tempPin = 'P9_33';
var currentTemp = 0.0;

b.analogRead(tempPin, readTemperature);

device
        .on('connect', function() {
            console.log('connect');
            device.subscribe('sdkTest/sub');
            device.publish('sdkTest/sub', JSON.stringify({ temperature: currentTemp}));
        });

    device
        .on('message', function(topic, payload) {
            console.log('message', topic, payload.toString());
        });

setInterval(function() {
    	b.analogRead(tempPin, readTemperature)
    	device.publish('sdkTest/sub', JSON.stringify({ temperature: currentTemp}));
    },1000);

var server = rest.createServer({
     name : "Temperature"
});

server.get({path : path , version : '1.0.0'}, getTemperature);

server.listen(port,ip, function() {
     console.log('%s listening at %s ',server.name, server.url);
});

function getTemperature(req, res, next) {
     var tempResponse = {"temperature":currentTemp};
     res.send(200, tempResponse);
}

function readTemperature (aRead) {
    //console.log("Getting Temp");
    var x = (aRead.value*1800);
    var cel = (x-500)/100;
    var fah = (cel *9/5)+32;
     currentTemp = cel;
}
