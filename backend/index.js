const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/room');
const { getSecureRandomBytes } = require('./utils/secureRandom');

const bytes = getSecureRandomBytes(16);
console.log('Secure random bytes:', bytes);


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB connected'))
  .catch(err => console.error(' DB error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/room', roomRoutes);

const server = app.listen(process.env.PORT || 5000, () =>
  console.log(` Server running on port ${process.env.PORT || 5000}`)
);

// WebSocket (Socket.IO)
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', socket => {
  console.log(' Socket connected:', socket.id);

  socket.on('join-room', ({ roomId, userId }) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', userId);
  });

  socket.on('signal', ({ userToSignal, signal, callerId }) => {
    io.to(userToSignal).emit('user-signal', { signal, callerId });
  });

  socket.on('return-signal', ({ callerId, signal }) => {
    io.to(callerId).emit('received-return-signal', { signal, id: socket.id });
  });

  socket.on('disconnect', () => {
    console.log(' Disconnected:', socket.id);
  });
});
