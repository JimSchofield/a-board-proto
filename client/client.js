var socket = io();

Vue.component('sign-in', {
	template: `
	<div class="signIn">
		<label>Please enter a username</label>
		<input 
			type="text"
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
			this.$emit('changeName', this.username);
		}
	}
})

Vue.component('chat-view', {
    template: `
	<div class="chatContainer">
		<div v-for='msg in msgList' class="msg">
			{{ msg.name }} - {{ msg.time }} : {{ msg.msg }}
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
		placeholder='Enter some text...'>
	`,
    data: function() {
        return {
            unsentMessage: ''
        }
    },
    props: ['username'],
    methods: {
    	emitMsg: function() {

    		let d = new Date();
    		let currentTime = (d.getHours() % 12) + ':' + d.getMinutes() + ':' + d.getSeconds();

    		socket.emit('chat msg', {
    			msg: this.unsentMessage,
    			name: this.username,
    			time: currentTime
    		});

    		this.unsentMessage = '';
    	},
    }
})

var app = new Vue({
    el: '#board',
    template: `
  <div class="container">
	  <h1>BOARD</h1>
	  <sign-in
	  	v-if='this.username===""'
	  	@changeName=changeUsername></sign-in>
	  <chat-view 
	  	:msgList='msgList'></chat-view>
	  <input-bar 
	  	v-if='this.username!==""'
	  	:username='username'></input-bar>
  </div>
  `,
    data: {
        msgList: [],
        username: ''
    },
	methods: {
		changeUsername: function(username) {
			console.log('username changed to: ' + username);
			this.username = username;
		}
	}
})

socket.on('chat msg', function(msg) {
	app.msgList.push(msg);
})


//AUX methods
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
