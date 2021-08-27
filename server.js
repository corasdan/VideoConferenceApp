const express = require('express');
const app = express();
const server = require('http').Server(app);
const { v4: uuidv4 } = require('uuid');

// const cors = require('cors')
// app.use(cors())

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});
app.set('view engine', 'ejs');

app.use('/peerjs', peerServer);

const io = require('socket.io')(server);

app.use(express.static('public'));

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})



// io.on('connection', (socket) => {
//     socket.on('join-room', (roomId) => {
//         socket.join(roomId);
//         // socket.to(roomId).broadcast.emit('user-connected');
//         socket.to(roomId).broadcast.emit('user-connected')
//     })
// })

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
      socket.to(roomId).emit('user-connected', userId);

      socket.on('message', message => {
          io.to(roomId).emit('create-message', message, userId);
      })
    });
})



server.listen(3030);