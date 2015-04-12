var server = require('http').createServer();
var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server,
        wss = new WebSocketServer({port : 80});

var buffer = null;
var list = []; 
var table = {};

wss.on('connection', function(socket) {
    if (buffer == null || buffer.readyState != WebSocket.OPEN) {
        buffer = socket;
        console.log("waiting");
    } else {
        // keep track of sockets and assign them ids
        buffer.opponent = socket
        socket.opponent = buffer;
        // table[buffer.id] = socket.id;
        // table[socket.id] = buffer.id;
        // console.log(list.length);
        // console.log(Object.keys(table).length);

        // translate messages to your opponent
        var message = function(data) {
            // console.log(data);
            try {
                this.opponent.send(data);
            } catch (err) {
                this.close();
            }
        };
        buffer.on('message', message);
        socket.on('message', message);

        // close connections and cleanup references on exit
        var onclose = function(data) {
            try {
                this.opponent.close();
            } catch (err) {}
            // buffer = null;
            // socket = null;
        };
        buffer.on('close', onclose);
        socket.on('close', onclose);

        // initiate handshake
        buffer.send(JSON.stringify({
            phase : 'handshake',
            first : true
        }));
        socket.send(JSON.stringify({
            phase : 'handshake',
            first : false
        }));

        console.log('connected');
        buffer = null;
    }
});
