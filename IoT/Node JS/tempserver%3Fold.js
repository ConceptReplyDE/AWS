var b = require('bonescript');
var rest = require('restify');

var ip = '10.64.55.74'
var port = '18080'
var path = 'temperature'
var tempPin = 'P9_33';
var currentTemp = 0.0;

b.analogRead(tempPin, readTemperature);
setInterval(function() {b.analogRead(tempPin, readTemperature)},3000);

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
     console.log("Getting Temp");
    var x = (aRead.value*1800);
    var cel = (x-500)/10;
    var fah = (cel *9/5)+32;
     currentTemp = cel;
console.log("Temp: " + cel);
}
