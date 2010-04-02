var sys = require('sys'),
     ws = require('ws')
     tr = require('./lib/tracker')

var tracker = tr.create()
var server  = ws.createServer(function (socket) {
  socket.addListener("connect", function (res) {
    tracker.connect(socket, res)
  })
  socket.addListener("data", function (data) {
    sys.puts('> ' + sys.inspect(data))
  })
  socket.addListener("close", function (res) {
    tracker.disconnect(socket)
  })
})
server.listen(3840)