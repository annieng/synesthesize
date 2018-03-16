const express = require('express')
const app = express()
const port = 4444

const server = app.listen(port)

app.use(express.static('public'))

const socket = require('socket.io');
const io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('new connection from:' + socket.id);

  socket.on('midi', midiMsg);
  function midiMsg(data) {
    socket.broadcast.emit('externalMidi', data);
    console.log(socket.id, ' sending data to other users: ', data);
  }
}