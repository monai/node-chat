var net = require('net');
var readline = require('readline');

var rl, socket, nick;

rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
rl.setPrompt('');

rl.question('Enter your nick: ', function (answer) {
	nick = answer;
	createSocket();
});

function createSocket() {
	socket = new net.Socket();
	socket.on('connect', onConnect);
	socket.on('data', onData);
	socket.on('close', onClose);
	socket.connect(31337, '127.0.0.1');
}

function onConnect() {
	console.log('connected');
	
	rl.on('line', function (message) {
		socket.write(JSON.stringify({
			nick: nick,
			message: message
		}));
	});
}

function onData(data) {
	data = JSON.parse(data);
	console.log(data.nick +': '+ data.message);
}

function onClose() {
	console.log('connection lost')
	
	rl.close();
	process.exit(0);
}
