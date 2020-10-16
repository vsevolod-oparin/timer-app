var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var ntp = require('socket-ntp');

room2state = {};

io.on('connection', (socket) => {
  console.log('User connected');
  ntp.sync(socket);
  socket.on('join-room', (room, initState) => {
    if (room in room2state && room2state[room] != null) {
      console.log('Emitting current state');
      socket.emit('state-update', room2state[room]);
    } else {
      console.log('Init state');
      initState.network = true;
      room2state[room] = initState;
    }
    console.log('Join room ' + room);
    socket.join(room);

    socket.on('state-update', (data) => {
      console.log(data);
      data.network = true;
      room2state[room] = data;
      socket.to(room).emit('state-update', data);
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


http.listen(3001, () => {
  console.log('listening on *:3001');
});
