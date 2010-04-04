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
  var client = this.ids[q.id] = {id: q.id, socket: socket, presentation: q.to}
  var pres   = this.addToPresentation(client)
  if(pres.master == client.id)
    this.send(client, 'master')
  return client
}

Tracker.prototype.disconnect = function(client) {
  if(!client) return
  var pres = this.presentations[client.presentation]
  if(pres && pres.master == client.id)
    delete this.presentations[pres]
  delete this.ids[client.id]
}

Tracker.prototype.show = function(client, num) {
  var pres = this.presentations(client.presentation)
  pres.slide = num
  this.sendToClients(client, num)
}

Tracker.prototype.send = function(client, data) {
  client.socket.write(data)
}

Tracker.prototype.sendToClients = function(client, data) {
  var pres   = this.presentations[client.presentation]
  if(!pres || client.id != pres.master) return
  for(var i = 0; i < pres.clients.length; i++) {
    this.send(this.ids[pres.clients[i]], data)
  }
}

Tracker.prototype.addToPresentation = function(client) {
  var p = this.presentations[client.presentation]
  if(p && p.master != client.id) {
    p.clients.push(client.id)
  } else {
    this.presentations[client.presentation] = p = {id: client.presentation, master: client.id, clients: [], slide: 0}
  }
  return p
}