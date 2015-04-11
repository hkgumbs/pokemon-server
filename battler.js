function Battler() {
    this.waiting = null;
    this.opponents = {};

    this.connect = function(socket) {
        if (this.waiting == null) {
            this.waiting = socket;
        } else {
            this.opponents[this.waiting] = socket;
            this.opponents[socket] = this.waiting;

            this.waiting.send('{phase:"handshake",turn:true}');
            socket.send('{phase:"handshake",turn:false}');

            this.waiting = null;
        }
    }

    this.message = function(data, socket) {
        this.opponents[socket].send(data);
    }

    this.close = function(socket) {
        if (socket in this.opponents) {
            opponent = this.opponents[socket];
            delete this.opponents[socket];
            delete this.opponents[opponent];
            opponent.close();
        }
    }
}

module.exports = Battler;
