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




// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const authRoutes = require('./routes/auth');
// const roomRoutes = require('./routes/room');
// const { getSecureRandomBytes } = require('./utils/secureRandom');

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());


// // Secure random test
// const bytes = getSecureRandomBytes(16);
// console.log('Secure random bytes:', bytes);

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('DB error:', err));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/room', roomRoutes);

// // Server listen
// const server = app.listen(process.env.PORT || 5000, () =>
//   console.log(`Server running on port ${process.env.PORT || 5000}`)
// );

// // WebSocket (Socket.IO)
// const { Server } = require('socket.io');
// const io = new Server(server, {
//   cors: { origin: '*' },
// });

// // Room & Peer Communication
// io.on('connection', (socket) => {
//   console.log(' Socket connected:', socket.id);

//   // Join room
//   socket.on('join-room', ({ roomId, userId, name }) => {
//     socket.join(roomId);
//     console.log(` ${name} (${userId}) joined room ${roomId}`);
//     socket.to(roomId).emit('user-joined', { userId: socket.id, name });

//     // Peer signaling
//     socket.on('signal', ({ userToSignal, signal, callerId, name }) => {
//       io.to(userToSignal).emit('user-signal', { callerId, signal, name });
//     });

//     socket.on('return-signal', ({ callerId, signal }) => {
//       io.to(callerId).emit('received-return-signal', { signal, id: socket.id });
//     });

//     // Chat messages
//     socket.on('chat-message', (msg) => {
//       io.to(roomId).emit('chat-message', msg);
//     });

//     // Emoji reactions
//     socket.on('emoji-reaction', (reaction) => {
//       io.to(roomId).emit('emoji-reaction', reaction);
//     });

//     // Disconnection
//     socket.on('disconnect', () => {
//       console.log(' Disconnected:', socket.id);
//       socket.to(roomId).emit('user-disconnected', socket.id);
//     });

//     // Whiteboard events
//     socket.on('drawing', (data) => {
//       socket.to(roomId).emit('drawing', data);
//     });

//     socket.on('clear-board', () => {
//       socket.to(roomId).emit('clear-board');
//     });
//   });
// });



// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/room');
const { getSecureRandomBytes } = require('./utils/secureRandom');
const { Server } = require('socket.io');

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

// Start HTTP server
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

// Setup Socket.IO on top of Express HTTP server
const io = new Server(server, {
  cors: {
    origin: '*', // Allow frontend on any port
    methods: ['GET', 'POST']
  }
});

// WebRTC Room Management
const rooms = {}; // { roomId: [{ id, name }] }

io.on('connection', socket => {
  console.log('Socket connected:', socket.id);

  socket.on('join-room', ({ roomID, username }) => {
    if (!rooms[roomID]) rooms[roomID] = [];
    rooms[roomID].push({ id: socket.id, name: username });

    socket.join(roomID);
    console.log(`${username} joined room ${roomID}`);

    // Send existing users to new user
    const others = rooms[roomID].filter(u => u.id !== socket.id);
    socket.emit('all-users', others);

    // Notify others about the new user
    socket.to(roomID).emit('user-joined', {
      id: socket.id,
      name: username
    });

    // Signaling - send offer
    socket.on('sending-signal', payload => {
      io.to(payload.userToSignal).emit('user-joined', {
        signal: payload.signal,
        id: socket.id,
        name: payload.name,
      });
    });

    // Signaling - send answer
    socket.on('returning-signal', payload => {
      io.to(payload.callerID).emit('receiving-returned-signal', {
        signal: payload.signal,
        id: socket.id
      });
    });

    // Chat Message
    socket.on('chat-message', (msg) => {
      io.to(roomID).emit('chat-message', msg);
    });

    // Emoji Reaction
    socket.on('emoji-reaction', (reaction) => {
      io.to(roomID).emit('emoji-reaction', reaction);
    });

    // Whiteboard Drawing
    socket.on('drawing', (data) => {
      socket.to(roomID).emit('drawing', data);
    });

    // Clear Whiteboard
    socket.on('clear-board', () => {
      socket.to(roomID).emit('clear-board');
    });

    // Handle Disconnect
    socket.on('disconnect', () => {
      console.log('Disconnected:', socket.id);
      if (rooms[roomID]) {
        rooms[roomID] = rooms[roomID].filter(u => u.id !== socket.id);
        socket.to(roomID).emit('user-disconnected', socket.id);
      }
    });
  });
});
