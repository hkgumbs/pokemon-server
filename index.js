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
        // console.log(buffer);
        // console.log('---');
        // console.log(socket);
        // table[buffer] = socket;
        // table[socket] = buffer;
        console.log(table);
        console.log(Object.keys(table).length);

        // translate messages to your opponent
        buffer.on('message', function(data) {
            // console.log(data);
            socket.send(data);
        });
        socket.on('message', function(data) {
            // console.log(data);
            buffer.send(data);
        });

        // close connections on exit
        var onclose = function(data) {
            try {
                table[this].close();
            } catch (err) {}
            buffer = null;
            socket = null;
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
        // buffer = null;
    }

    // Test app
    // socket.emit('message', {id : socket.id, val : 0});
    // socket.on(socket.id, function(data) {
    //     console.log(data.val);
    //     socket.emit('message', {val : data.val + 1});
    // });
});
