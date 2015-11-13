//AWS IoT NodeJs library
var awsIot = require('aws-iot-device-sdk');
var datetime;

//Setting IoT device parameters
var device = awsIot.device({
   keyPath: '/root/awsCerts/private.pem.key',
  certPath: '/root/awsCerts/certificate.pem.crt',
    caPath: '/root/awsCerts/root-CA.crt',
  clientId: 'myAwsClientId',
    region: 'eu-west-1'
});

    device
        .on('connect', function() {
	    datetime = new Date().today() + " @ " + new Date().timeNow();
            console.log(datetime + ' subscribed to ' + 'devices/#.........');
            device.subscribe('devices/#');
        });

    device
        .on('message', function(topic, payload) {
            console.log('message', topic, payload.toString());
        });

// For todays date;
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}