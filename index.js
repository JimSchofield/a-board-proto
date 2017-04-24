var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

require('./socket/socket.js')(io);

app.use(express.static('client'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client.html');
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});