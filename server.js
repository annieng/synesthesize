const express = require('express')
const app = express()
const port = process.env.PORT || 4444

const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(__dirname + '/node_modules'))
app.use(express.static(__dirname + '/src/public/js'))

io.on('connection', function(socket) {
  socket.emit('midi', 'we\'ve cponnevtdd')

  socket.on('midi', midiMsg);
  function midiMsg(data) {
    socket.broadcast.emit('externalMidi', data);
    console.log(socket.id, ' sending data to other users: ', data);
  }

  socket.on('externalMidi', (data) => {
    console.log(data)
  })
})
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

server.listen(port)

exports.io = io
