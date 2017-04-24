var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//State variables
var userList = [];
var msgList = []; 

require('./socket/socket.js')(io, userList, msgList);

var port = process.env.PORT || 3000;

app.use(express.static('client'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client.html');
});


http.listen(port, function(){
  console.log('listening on *:3000');
});