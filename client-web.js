var net = require('net');
var http = require('http');
var connect = require('connect');
var io = require('socket.io');

var socket, ioSockets;
ioSockets = [];

socket = new net.Socket();
socket.on('connect', onConnect);
socket.on('data', onData);
socket.on('close', onConnect);
socket.connect(31337, '127.0.0.1');

function onConnect() {
	console.log('connected');
	
	var server, app;
	
	app = connect();
	app.use(connect.logger('dev'));
	app.use(connect.static('static'));
	
	server = http.createServer(app);
	server.listen(3000);
	
	io = io.listen(server);
	io.on('connection', ioOnConnection);
}

function onData(data) {
	data = JSON.parse(data);
	ioWrite(data);
}

function onClose() {
	console.log('\nconnection lost')
	process.exit(0);
}

function ioOnConnection(socket) {
	ioSockets.push(socket);
	socket.on('message', ioOnMessage)
}

function ioOnMessage(data) {
	socket.write(JSON.stringify(data));
	ioWrite(data);
}

function ioWrite(data) {
	for (var i = 0, l = ioSockets.length; i < l; i++) {
		ioSockets[i].emit('message', data);
	}
}
