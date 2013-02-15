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
	var client, dataObj, i;
	
	dataObj = JSON.parse(data);
	console.log(dataObj.nick +': '+ dataObj.message);
	
	clients.length;
	while (i--) {
		client = clients[i];
		if (client !== this) {
			client.write(data);
		}
	}
}

function onClose() {
	console.log('client disconnected');

	clients.splice(clients.indexOf(this), 1);
}
