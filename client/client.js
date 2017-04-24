var socket = io();

Vue.component('sign-in', {
	template: `
	<div class="signIn">
		<h4 class="removeTopMargin">Please enter a username:</h4>
		<input 
			type="text"
			maxlength="20"
			v-model='username'
			@keyup.enter='onChangeName'
			>
	</div>
	`,
	data: function() {
		return {
			username: ''
		}
	},
	methods: {
		onChangeName: function(event) {
			if (this.username !== '') {
				this.$emit('changeName', this.username);
			}
		}
	}
})

Vue.component('chat-view', {
    template: `
	<div class="chatContainer">
		<div v-for='msg in msgList' class="msg">
			<span class="msgDetails">{{ msg.name }} {{ msg.time }}</span>
			<p class="pSmallMargin">{{ msg.msg }}</p>
		</div>
	</div>
	`,
	props: ['msgList']
})

Vue.component('input-bar', {
    template: `
	<input 
		type='text' 
		v-model='unsentMessage' 
		@keyup.enter='emitMsg'
		placeholder='Enter some text...'
		@keyup='typingMsg'>
	`,
    data: function() {
        return {
            unsentMessage: ''
        }
    },
    props: ['username'],
    methods: {
    	typingMsg: function() {
    		socket.emit('typing', this.username);
    	},
    	emitMsg: function() {

    		if(this.unsentMessage !== '') {
	    		let d = new Date();
	    		let currentTime = (d.getHours() % 12) + ':' + d.getMinutes() + ':' + d.getSeconds();

	    		socket.emit('chat msg', {
	    			msg: this.unsentMessage,
	    			name: this.username,
	    			time: currentTime
	    		});

	    		this.unsentMessage = '';
    		}
    	},
    }
})

var app = new Vue({
    el: '#board',
    template: `
  <div class="container">
	  <h1>A Board</h1>
	  <div class="row">
		  <div class="left">
		  	<div v-if="userList.length <= 0"><p>No one is online presently!</p></div>
		  	<div v-else>
		  		<p class="pSmallMargin">Online:</p>
				<img
					v-for="user in userList" 
					:src='"http://placehold.it/100x100?text=" + user.username'
					:class='{ isTyping: user.typing}'>
			</div>
		  </div>
		  <div class="right">
			  <sign-in
			  	v-if='this.username===""'
			  	@changeName=changeUsername></sign-in>
			  <input-bar 
			  	v-if='this.username!==""'
			  	:username='username'></input-bar>
			  <chat-view 
			  	:msgList='msgList'></chat-view>
		  </div>
	  </div>
  </div>
  `,
    data: {
        msgList: [],
        userList: [],
        username: ''
    },
	methods: {
		changeUsername: function(username) {
			socket.emit('user added', username);
		}
	}
})



//socket Methods

socket.on('setup board state', function(userlist, msgList) {
	app.userList = userlist;
	app.msgList = msgList;
})

socket.on('user added', function(user) {
	app.username = user.username;
	app.userList.unshift(user);
})

socket.on('chat msg', function(msg) {
	app.msgList.unshift(msg);
})

var timeout = null;
socket.on('typing', function(username) {
	clearTimeout(timeout);

	toggleTypeStatus(username, app.userList, true);

	timeout = setTimeout(function() {
		toggleTypeStatus(username, app.userList, false);
	}, 1000)
})

socket.on('user left', function(socketID) {
	app.userList = app.userList.filter(function(user) {
		return user.socketID !== socketID;

	})
})


//AUX methods

function toggleTypeStatus(username, array, status) {
	array.forEach(function(element) {

		if(element.username === username) {
			element.typing = status;
		}
	})
}

function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}
