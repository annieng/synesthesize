const express = require('express')
const app = express()
const port = process.env.PORT || 4444

const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(__dirname + '/node_modules'))
app.use(express.static(__dirname + '/src/public'))

io.on('connection', newConnection)

function newConnection(socket) {
  console.log('new connection from: ' + socket.id)
  io.sockets.on('midi', midiMsg)
    function midiMsg(data) {
      console.log(data)
      socket.emit('externalMidi', data)
      }
  }

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get('/visualizer', function(req, res) {
  res.sendFile(__dirname + 'visualizer.html')
})

server.listen(port)

exports.io = io
