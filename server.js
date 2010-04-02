var sys = require('sys'),
     ws = require('ws'),
     tr = require('./lib/tracker')

var tracker = tr.create()
var server  = ws.createServer(function (socket) {
  var record
  socket.addListener("connect", function (res) {
    record = tracker.connect(socket, res)
    sys.puts('connected: ' + socketId)
  })
  socket.addListener("data", function (data) {
    sys.puts('> ' + sys.inspect(data))
  })
  socket.addListener("close", function () {
    sys.puts('disconnected: ' + record.id)
    tracker.disconnect(record)
  })
})
server.listen(3840)

GLOBAL.tracker = tracker

require("repl").start("> ")