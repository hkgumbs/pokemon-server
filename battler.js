function Battler() {
    var self = this;
    self.waiting = null;
    self.opponents = {};

    self.connect = function(socket) {
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
        self.opponents[socket].send(data);
    }

    self.close = function(socket) {
        if (socket in self.opponents) {
            opponent = self.opponents[socket];
            delete self.opponents[socket];
            delete self.opponents[opponent];
            opponent.close();
        }
    }
}

module.exports = Battler;
