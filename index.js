var server = require('http').createServer();
var WebSocketServer = require('ws').Server,
        wss = new WebSocketServer({port : 8080});

var buffer = null;

wss.on('connection', function(socket) {
    if (buffer == null) {  // || buffer.disconnected) {
        buffer = socket;
        console.log("waiting");
    } else {
        // each socket should listen on its own id
        buffer.on('message', function(data){
            socket.send(data);
        });
        socket.on('message', function(data){
            buffer.send(data);
        });

        // initiate handshake
        buffer.send(JSON.stringify({
            // id : buffer.id,
            phase : 'handshake',
            first : true
        }));
        socket.send(JSON.stringify({
            // id : socket.id,
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
