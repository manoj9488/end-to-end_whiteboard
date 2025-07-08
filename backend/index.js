// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const authRoutes = require('./routes/auth');
// const roomRoutes = require('./routes/room');
// const { getSecureRandomBytes } = require('./utils/secureRandom');

// const bytes = getSecureRandomBytes(16);
// console.log('Secure random bytes:', bytes);


// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log(' MongoDB connected'))
//   .catch(err => console.error(' DB error:', err));

// app.use('/api/auth', authRoutes);
// app.use('/api/room', roomRoutes);


// const server = app.listen(process.env.PORT || 5000, () =>
//   console.log(` Server running on port ${process.env.PORT || 5000}`)
// );

// // WebSocket (Socket.IO)
// const { Server } = require('socket.io');
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//   }
// });

// io.on('connection', (socket) => {
//     socket.on('drawing', (data) => {
//     socket.broadcast.emit('drawing', data);
//   });

//   socket.on('clear-board', () => {
//     socket.broadcast.emit('clear-board');
//   });
// });


// io.on('connection', socket => {
//   console.log(' Socket connected:', socket.id);

//   socket.on('join-room', ({ roomId, userId }) => {
//     socket.join(roomId);
//     socket.to(roomId).emit('user-joined', userId);
//   });

//   socket.on('signal', ({ userToSignal, signal, callerId }) => {
//     io.to(userToSignal).emit('user-signal', { signal, callerId });
//   });

//   socket.on('return-signal', ({ callerId, signal }) => {
//     io.to(callerId).emit('received-return-signal', { signal, id: socket.id });
//   });

//   socket.on('disconnect', () => {
//     console.log(' Disconnected:', socket.id);
//   });
// });




const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/room');
const { getSecureRandomBytes } = require('./utils/secureRandom');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Secure random test
const bytes = getSecureRandomBytes(16);
console.log('Secure random bytes:', bytes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('DB error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/room', roomRoutes);

// Server listen
const server = app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);

// WebSocket (Socket.IO)
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: '*' },
});

// Room & Peer Communication
io.on('connection', (socket) => {
  console.log(' Socket connected:', socket.id);

  // Join room
  socket.on('join-room', ({ roomId, userId, name }) => {
    socket.join(roomId);
    console.log(` ${name} (${userId}) joined room ${roomId}`);
    socket.to(roomId).emit('user-joined', { userId: socket.id, name });

    // Peer signaling
    socket.on('signal', ({ userToSignal, signal, callerId, name }) => {
      io.to(userToSignal).emit('user-signal', { callerId, signal, name });
    });

    socket.on('return-signal', ({ callerId, signal }) => {
      io.to(callerId).emit('received-return-signal', { signal, id: socket.id });
    });

    // Chat messages
    socket.on('chat-message', (msg) => {
      io.to(roomId).emit('chat-message', msg);
    });

    // Emoji reactions
    socket.on('emoji-reaction', (reaction) => {
      io.to(roomId).emit('emoji-reaction', reaction);
    });

    // Disconnection
    socket.on('disconnect', () => {
      console.log(' Disconnected:', socket.id);
      socket.to(roomId).emit('user-disconnected', socket.id);
    });

    // Whiteboard events
    socket.on('drawing', (data) => {
      socket.to(roomId).emit('drawing', data);
    });

    socket.on('clear-board', () => {
      socket.to(roomId).emit('clear-board');
    });
  });
});

