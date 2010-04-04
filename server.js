var sys = require('sys'),
     ws = require('ws'),
     tr = require('./lib/tracker')

var tracker = tr.create()
var server  = ws.createServer(function (socket) {
  var client
  socket.addListener("connect", function (res) {
    client = tracker.connect(socket, res)
    sys.puts('connected: ' + client.id)
  })
  socket.addListener("data", function (data) {
    if(data == 'Heartbeat') return;
    tracker.sendToClients(client, data)
  })
  socket.addListener("close", function () {
    sys.puts('disconnected: ' + client.id)
    tracker.disconnect(client)
  })
})
server.listen(3840)

GLOBAL.tracker = tracker

require("repl").start("> ")