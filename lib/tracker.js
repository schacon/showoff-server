var sys = require('sys'),
    url = require('url'),
     qs = require('querystring')

function Tracker() {
  this.presentations = {} // master => {id: idOfMaster, clients: [id, id, id]}
  this.ids           = {} // id     => {id: id, socket: socket, presentation: idOfMaster}
}

exports.create = function() {
  return new Tracker();
}

Tracker.prototype.connect = function(socket, path) {
  var u      = url.parse(path)
  var q      = qs.parse(u.query)
  var record = this.ids[q.id] = {id: q.id, socket: socket, presentation: q.to}
  this.addToPresentation(record)
  return record
}

Tracker.prototype.disconnect = function(record) {
  if(record) {
    var pres = this.presentations[record.presentation]
    if(pres && pres.id == id)
      delete this.presentations[pres]
    delete this.ids[id]
  }
}

Tracker.prototype.ping = function(idOrRecord, data) {
  var record = idOrRecord.id ? idOrRecord : this.ids[idOrRecord]
  record.socket.write(data)
}

Tracker.prototype.pingClients = function(presId, data) {
  var pres = this.presentations[presId]
  if(!pres) return
  for(var i = 0; i < pres.clients.length; i++) {
    this.ping(pres.clients[i], data)
  }
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