var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('client'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

io.on('connection', function(socket) {
	console.log('Someone connected!');
	socket.on('chat msg', function(msg){
		io.emit('chat msg', msg);
	})
})


http.listen(3000, function(){
  console.log('listening on *:3000');
});