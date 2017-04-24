var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var userList = [];
var msgList = []; 

app.use(express.static('client'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

io.on('connection', function(socket) {

	io.to(socket.id).emit('user list', userList);

	socket.on('chat msg', function(msg){
		msgList.unshift(msg);
		io.emit('chat msg', msg);
		console.log(msgList);
	})

	socket.on('user added', function(user) {
		let userObject = {
			username: user,
			socketID: socket.id
		}

		io.emit('user added', userObject);
		userList.unshift(userObject);
		console.log(userList);
	})

	socket.on('disconnect', function() {
		console.log(socket.id + " disconnected");
		io.emit('user left', socket.id);
		userList = userList.filter(function(user) {
			return user.socketID !== socket.id;
		})
	})

})


http.listen(3000, function(){
  console.log('listening on *:3000');
});