var filter = require('swearjar');

module.exports = function(io, userList, msgList) {

	io.on('connection', function(socket) {

		io.to(socket.id).emit('setup board state', userList, msgList);

		socket.on('chat msg', function(msg){
			if(!filter.profane(msg.msg)) {
				msgList.unshift(msg);
				io.emit('chat msg', msg);
			}
		})

		socket.on('user added', function(user) {
			if (!filter.profane(user)) {
				let userObject = {
					username: user,
					socketID: socket.id,
					typing: false
				}
				io.emit('user added', userObject);
				userList.unshift(userObject);
				console.log(userList);
			} else {
				console.log("Profane name detected");
			}
		})

		socket.on('typing', function(username) {
			console.log("Hearing typing from ", username);
			io.emit('typing', username);
		})

		socket.on('disconnect', function() {
			console.log(socket.id + " disconnected");
			io.emit('user left', socket.id);
			userList = userList.filter(function(user) {
				return user.socketID !== socket.id;
			})
		})
	})

}