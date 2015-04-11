function Battler() {
    var self = this;
    self.waiting = null;
    self.opponents = {};

    self.connect = function(socket) {
        console.log("connected");
        if (self.waiting == null) {
            self.waiting = socket;
        } else {
            self.opponents[self.waiting] = socket;
            self.opponents[socket] = self.waiting;

            self.waiting.send('{phase:"handshake",turn:true}');
            socket.send('{phase:"handshake",turn:false}');

            self.waiting = null;
        }
    }

    self.message = function(data, socket) {
        console.log("message", data);
        self.opponents[socket].send(data);
    }

    self.close = function(socket) {
        console.log("closed");
        if (socket in self.opponents) {
            opponent = self.opponents[socket];
            delete self.opponents[socket];
            delete self.opponents[opponent];
            opponent.close();
        }
        if (socket == self.waiting)
            self.waiting = null;
    }
}

module.exports = Battler;
