module.exports = function(io) {

	var userList = [];
	var msgList = []; 

	io.on('connection', function(socket) {

		io.to(socket.id).emit('user list', userList);

		socket.on('chat msg', function(msg){
			msgList.unshift(msg);
			io.emit('chat msg', msg);
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

}