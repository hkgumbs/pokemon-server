var server = require('http').createServer();
var io = require('socket.io')(server);

var buffer = null;

io.on('connection', function(socket) {
    if (buffer == null || buffer.disconnected) {
        buffer = socket;
        console.log("waiting");
    } else {

        // each socket should listen on its own id
        buffer.on(buffer.id, function(data){
            socket.emit('message', data);
        });
        socket.on(socket.id, function(data){
            buffer.emit('message', data);
        });

        // initiate handshake
        buffer.emit('message', {
            id : buffer.id,
            phase : 'handshake',
            first : true
        });
        socket.emit('message', {
            id : socket.id,
            phase : 'handshake',
            first : false
        });

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

server.listen(3000);
