const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/create-instant-meeting', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get('/meeting-left', (req, res) => {
  res.render('room_left');
});

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    if (roomId) {
      socket.to(roomId).emit('user-connected', userId);
    }
    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });

  });
  socket.on('screen-share', (roomId, screenStream) => {
    socket.join(roomId);
    socket.to(roomId).emit('screen-share', screenStream);
  });
});


server.listen(3005);
