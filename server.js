const express = require('express')
const app = express()
const port = 4444

const server = app.listen(port, function() {
  console.log('listening on the death port')
})

const socket = require('socket.io');
const io = socket(server);

app.use(express.static('public'))

app.get('/', function (req, res) {
  //res.send('synesthesize server ready to go cutie');
  res.sendFile('synesthesize/index.html')
});

io.on('connection', newConnection);
function newConnection(socket) {
  console.log('new connection from:' + socket.id);

  socket.on('midi', midiMsg);
  function midiMsg(data) {
    socket.broadcast.emit('externalMidi', data);
    console.log(socket.id, ' sending data to other users: ', data);
  }
}