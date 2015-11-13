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

var state = {"state":{"reported":{"on":null}}};
var temp = { };

device
  .on('connect', function() {
    console.log('connected to eu-west-1...');
    device.subscribe('$aws/things/motor/shadow/update/delta');
    device.subscribe('$aws/things/motor/shadow/update/#');
    console.log('subscribed to device shadow...');    
});
    
device
    .on('message', function(topic, payload) {
        if (topic == '$aws/things/motor/shadow/update/delta') {
            console.log('delta received...' + payload.toString());
            temp = JSON.parse(payload);
            state.state.reported.on = JSON.parse(JSON.stringify(temp.state.on));
            console.log('state = ' + JSON.stringify(state.state.reported.on));
            console.log('published current state:' + JSON.stringify(state));
            device.publish('$aws/things/motor/shadow/update', JSON.stringify(state));
            //console.log('Updated state on ' + JSON.stringify(test.state.on));
       }else{
            console.log('Message from: ', topic, payload.toString());
        }

});