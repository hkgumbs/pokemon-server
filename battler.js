function Battler() {
    this.waiting = null;
    this.opponents = {};

    this.new_user = function(socket) {
        if (this.waiting == null) {
            this.waiting = socket;
            console.log('waiting');
        } else {
            this.opponents[this.waiting] = socket;
            this.opponents[socket] = this.waiting;

            socket.send('"Ready"');
            this.waiting.send('"Begin"');

            this.waiting = null;
        }
    }

    this.move = function(data, socket) {
        this.opponents[socket].send(data);
    }

    this.quit = function(socket) {
        if (socket in this.opponents) {
            opponent = this.opponents[socket];
            delete this.opponents[socket];
            delete this.opponents[opponent];
            opponent.close();
        }
    }
}

module.exports = Battler;
