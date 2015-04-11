var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"));

var server = http.createServer(app);
server.listen(port);
console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server});
console.log("websocket server created")

var Battler = require('./battler');
var battler = new Battler();

wss.on('connection', battler.connect);
wss.on('message', battler.message);
wss.on('closedconnection', battler.close);
