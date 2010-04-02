var sys = require('sys'),
    url = require('url'),
     qs = require('querystring')

function Tracker() {
  this.presentations = {} // master => {id: idOfMaster, clients: [id, id, id]}
  this.sockets       = {} // socket => id
  this.ids           = {} // id     => {id: id, socket: socket, presentation: idOfMaster}
}

exports.create = function() {
  return new Tracker();
}

Tracker.prototype.connect = function(socket, path) {
  var u = url.parse(path)
  var q = qs.parse(u.query)
  this.ids[q.id]       = {id: q.id, socket: socket, presentation: q.to}
  this.sockets[socket] = q.id
  this.addToPresentation(this.ids[q.id])
}

Tracker.prototype.disconnect = function(socket) {
  var     id = this.sockets[socket],
      record = this.ids[id],
        pres = this.presentations[record.presentation]
  if(pres.id == id)
    delete this.presentations[record.presentation]
  delete this.ids[id]
  delete this.sockets[socket]
}

Tracker.prototype.addToPresentation = function(record) {
  var p = this.presentations[record.presentation]
  if(p && p.clients.length > 0) {
    p.clients.push(record.id)
  } else {
    this.createPresentation(record)
  }
}

Tracker.prototype.createPresentation = function(record) {
  this.presentations[record.presentation] = {id: record.id, clients: []}
}