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
	socket.on('close', onConnect);
	socket.connect(31337, '127.0.0.1');
}

function onConnect() {
	
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
	rl.close();
	console.log('\nconnection lost')
	process.exit(0);
}
