var PORT = 8000;
var HOST = '127.0.0.1';
var express = require('express');
var http = require('http');
var app = express();

var serverPath = __dirname + '/public';
var jsFile = __dirname + '/lethexa-kepler.js';

app.use(express.static(serverPath));
app.get('/lethexa-kepler.js', function(req, res) {
	res.sendFile(jsFile);
});

var httpServer = http.createServer(app).listen(PORT);
console.log('Http-server started in port ' + PORT);
