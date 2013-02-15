var net = require('net');
var http = require('http');
var connect = require('connect');
var io = require('socket.io');

var socket, ioSockets;
ioSockets = [];

socket = new net.Socket();
socket.on('connect', onConnect);
socket.on('data', onData);
socket.on('close', onClose);
socket.connect(31337, '127.0.0.1');

function onConnect() {
	var server, app;
	
	console.log('connected');
	
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
	console.log('connection lost')
	
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
	var i = ioSockets.length;
	while (i--) {
		ioSockets[i].emit('message', data);
	}
}
