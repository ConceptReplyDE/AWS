var b = require('bonescript');

var led = "P8_10";

b.pinMode(led, b.OUTPUT);
var state = b.HIGH;
b.digitalWrite(led, state);
