var net = require('net');

var server, clients;

clients = [];

server = net.createServer();
server.on('connection', onConnection);
server.listen(31337, onListening);

function onConnection(socket) {
	console.log('client connected');
	
	clients.push(socket);
	socket.on('data', onData);
	socket.on('close', onClose);
}

function onListening() {
	console.log('listening');
}

function onData(data) {
	var client, dataObj;
	
	dataObj = JSON.parse(data);
	console.log(dataObj.nick +': '+ dataObj.message);
	
	for (var i = 0, l = clients.length; i < l; i++) {
		client = clients[i];
		if (client !== this) {
			client.write(data);
		}
	}
}

function onClose() {
	console.log('client disconnected');
	
	for (var i = 0, l = clients.length; i < l; i++) {
		if (clients[i] === this) {
			clients.splice(i, 1);
			break;
		}
	}
}
