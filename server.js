const express = require('express');
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
    // 9b1fdc7d-29f1-47d4-94c7-a3ebb3a0aa34
    // 3bff0ad4-1431-48c0-b001-0be768090bcb

})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log(roomId, userId);
        socket.join(roomId);
        if (roomId) {
            socket.to(roomId).emit('user-connected', userId);
        }

        
        socket.on('disconnect', ()=> {
            socket.to(roomId).emit('user-disconnected', userId);
        })
    });
});

server.listen(3005);