//AWS IoT NodeJs library
var awsIot = require('aws-iot-device-sdk');

var b = require('bonescript');

var motor = 'P8_13', // Pin to control servo
    freq = 50,  // Servo frequency (20 ms)
    min  = 0.8, // Smallest angle (in ms)
    max  = 2.2, // Largest angle (in ms)
    ms  = 250,  // How often to change position, in ms
    pos = 1.5,  // Current position, about middle
    step = 0.1; // Step size to next position

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
var timer;

//console.log('Hit ^C to stop');
b.pinMode(motor, b.ANALOG_OUTPUT, 6, 0, 0, doInterval);

device
  .on('connect', function() {
    console.log('connected to eu-west-1...');
    //device.subscribe('$aws/things/motor/shadow/update/delta');
    device.subscribe('$aws/things/motor/shadow/update/+');
    console.log('subscribed to device shadow update...');    
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
       }else if (topic == '$aws/things/motor/shadow/update/accepted'){
           if (((JSON.stringify((JSON.parse(payload)).state.desired)) == null) &&
                    ((JSON.stringify((JSON.parse(payload)).state.reported.on)) == 'true')){
               console.log('MOTOR_ON');
               timer = setInterval(Motor_ON, ms);
           }else if (((JSON.stringify((JSON.parse(payload)).state.desired)) == null) &&
                    ((JSON.stringify((JSON.parse(payload)).state.reported.on)) == 'false')){
               console.log('MOTOR_OFF');
               clearInterval(timer);
           }
            console.log('Accepted message from: ', topic, payload.toString());
        }else if (topic == '$aws/things/motor/shadow/update/rejected'){
            console.log('Rejected message from: ' + topic + ' Payload: ' + payload.toString());
        }

});

function doInterval(x) {
    if(x.err) {
        console.log('x.err = ' + x.err);
        return;
    }
    timer = setInterval(Motor_ON, ms);
}

// On and rotate from min to max position and back again
function Motor_ON() {
    pos += step;    // Take a step
    if(pos > max || pos < min) {
        step *= -1;
    }
    var dutyCycle = pos/1000*freq;
    b.analogWrite(motor, dutyCycle, freq);
}
