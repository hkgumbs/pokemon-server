var server = require('http').createServer();
var WebSocketServer = require('ws').Server,
        wss = new WebSocketServer({port : 3000});

var buffer = null;
var table = {};

wss.on('connection', function(socket) {
    if (buffer == null) {  // || buffer.disconnected) {
        buffer = socket;
        console.log("waiting");
    } else {
        table[buffer.id] = socket;
        table[socket.id] = buffer;

        // translate messages to your opponent
        var onmessage = function(data) {
            table[this.id].send(data);
        }
        buffer.on('message', onmessage);
        socket.on('message', onmessage);

        // close connections on exit
        var onclose = function(data) {
            try {
                table[this.id].close();
            } catch (err) {}
            try {
                delete table[this.id];
            } catch (err) {}
        }
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

    // Test app
    // socket.emit('message', {id : socket.id, val : 0});
    // socket.on(socket.id, function(data) {
    //     console.log(data.val);
    //     socket.emit('message', {val : data.val + 1});
    // });
});
