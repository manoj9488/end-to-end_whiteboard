


// // server.js
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const authRoutes = require('./routes/auth');
// const roomRoutes = require('./routes/room');
// const { getSecureRandomBytes } = require('./utils/secureRandom');
// const { Server } = require('socket.io');

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

// // Start HTTP server
// const server = app.listen(process.env.PORT || 5000, () => {
//   console.log(`Server running on port ${process.env.PORT || 5000}`);
// });

// // Setup Socket.IO on top of Express HTTP server
// const io = new Server(server, {
//   cors: {
//     origin: '*', // Allow frontend on any port
//     methods: ['GET', 'POST']
//   }
// });

// // WebRTC Room Management
// const rooms = {}; // { roomId: [{ id, name }] }

// io.on('connection', socket => {
//   console.log('Socket connected:', socket.id);

//   socket.on('join-room', ({ roomID, username }) => {
//     if (!rooms[roomID]) rooms[roomID] = [];
//     rooms[roomID].push({ id: socket.id, name: username });

//     socket.join(roomID);
//     console.log(`${username} joined room ${roomID}`);

//     // Send existing users to new user
//     const others = rooms[roomID].filter(u => u.id !== socket.id);
//     socket.emit('all-users', others);

//     // Notify others about the new user
//     socket.to(roomID).emit('user-joined', {
//       id: socket.id,
//       name: username
//     });

//     // Signaling - send offer
//     socket.on('sending-signal', payload => {
//       io.to(payload.userToSignal).emit('user-joined', {
//         signal: payload.signal,
//         id: socket.id,
//         name: payload.name,
//       });
//     });

//     // Signaling - send answer
//     socket.on('returning-signal', payload => {
//       io.to(payload.callerID).emit('receiving-returned-signal', {
//         signal: payload.signal,
//         id: socket.id
//       });
//     });

//     // Chat Message
//     socket.on('chat-message', (msg) => {
//       io.to(roomID).emit('chat-message', msg);
//     });

//     // Emoji Reaction
//     socket.on('emoji-reaction', (reaction) => {
//       io.to(roomID).emit('emoji-reaction', reaction);
//     });

//     // Whiteboard Drawing
//     socket.on('drawing', (data) => {
//       socket.to(roomID).emit('drawing', data);
//     });

//     // Clear Whiteboard
//     socket.on('clear-board', () => {
//       socket.to(roomID).emit('clear-board');
//     });

//     // Handle Disconnect
//     socket.on('disconnect', () => {
//       console.log('Disconnected:', socket.id);
//       if (rooms[roomID]) {
//         rooms[roomID] = rooms[roomID].filter(u => u.id !== socket.id);
//         socket.to(roomID).emit('user-disconnected', socket.id);
//       }
//     });
//   });
// });






const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const authRoutes = require("./routes/auth")
const roomRoutes = require("./routes/room")
const { getSecureRandomBytes } = require("./utils/secureRandom")
const { Server } = require("socket.io")

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Secure random test
const bytes = getSecureRandomBytes(16)
console.log("Secure random bytes:", bytes)

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/room", roomRoutes)

// Start HTTP server
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`)
})

// Setup Socket.IO on top of Express HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow frontend on any port
    methods: ["GET", "POST"],
  },
})

// Enhanced WebRTC Room Management
const rooms = {} // { roomId: [{ id, name, joinTime }] }
const userSockets = {} // { socketId: { roomId, username, joinTime } }

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id)

  socket.on("join-room", ({ roomID, username }) => {
    try {
      // Initialize room if it doesn't exist
      if (!rooms[roomID]) {
        rooms[roomID] = []
        console.log(`Room ${roomID} created`)
      }

      // Check if user already in room
      const existingUser = rooms[roomID].find((user) => user.id === socket.id)
      if (existingUser) {
        console.log(`User ${username} already in room ${roomID}`)
        return
      }

      // Add user to room
      const userInfo = {
        id: socket.id,
        name: username,
        joinTime: Date.now(),
      }
      rooms[roomID].push(userInfo)
      userSockets[socket.id] = { roomId: roomID, username, joinTime: Date.now() }

      socket.join(roomID)
      console.log(`${username} (${socket.id}) joined room ${roomID}. Total users: ${rooms[roomID].length}`)

      // Send current users list to the new user (excluding themselves)
      const otherUsers = rooms[roomID].filter((u) => u.id !== socket.id)
      socket.emit("all-users", otherUsers)
      console.log(`Sent ${otherUsers.length} existing users to ${username}`)

      // Notify all other users about the new user
      socket.to(roomID).emit("user-joined", {
        id: socket.id,
        name: username,
        joinTime: Date.now(),
      })
      console.log(`Notified room ${roomID} about new user: ${username}`)

      // Send room info update to all users
      io.to(roomID).emit("room-info", {
        roomId: roomID,
        userCount: rooms[roomID].length,
        users: rooms[roomID].map((u) => ({ id: u.id, name: u.name })),
      })
    } catch (error) {
      console.error("Error in join-room:", error)
      socket.emit("error", { message: "Failed to join room" })
    }
  })

  // Enhanced WebRTC Signaling
  socket.on("sending-signal", (payload) => {
    try {
      console.log(`Signal from ${socket.id} to ${payload.userToSignal}`)
      io.to(payload.userToSignal).emit("user-joined", {
        signal: payload.signal,
        id: socket.id,
        name: payload.name || "Unknown",
      })
    } catch (error) {
      console.error("Error in sending-signal:", error)
    }
  })

  socket.on("returning-signal", (payload) => {
    try {
      console.log(`Return signal from ${socket.id} to ${payload.callerID}`)
      io.to(payload.callerID).emit("receiving-returned-signal", {
        signal: payload.signal,
        id: socket.id,
      })
    } catch (error) {
      console.error("Error in returning-signal:", error)
    }
  })

  // Enhanced Chat Message
  socket.on("chat-message", (msg) => {
    try {
      const userInfo = userSockets[socket.id]
      if (userInfo) {
        const messageWithInfo = {
          ...msg,
          socketId: socket.id,
          timestamp: Date.now(),
        }
        io.to(userInfo.roomId).emit("chat-message", messageWithInfo)
        console.log(`Chat message in room ${userInfo.roomId} from ${userInfo.username}`)
      }
    } catch (error) {
      console.error("Error in chat-message:", error)
    }
  })

  // Enhanced Emoji Reaction
  socket.on("emoji-reaction", (reaction) => {
    try {
      const userInfo = userSockets[socket.id]
      if (userInfo) {
        const reactionWithInfo = {
          ...reaction,
          socketId: socket.id,
          username: userInfo.username,
          timestamp: Date.now(),
        }
        io.to(userInfo.roomId).emit("emoji-reaction", reactionWithInfo)
        console.log(`Emoji reaction in room ${userInfo.roomId} from ${userInfo.username}: ${reaction.emoji}`)
      }
    } catch (error) {
      console.error("Error in emoji-reaction:", error)
    }
  })

  // Enhanced Whiteboard Drawing
  socket.on("drawing", (data) => {
    try {
      const userInfo = userSockets[socket.id]
      if (userInfo) {
        socket.to(userInfo.roomId).emit("drawing", {
          ...data,
          socketId: socket.id,
          username: userInfo.username,
        })
      }
    } catch (error) {
      console.error("Error in drawing:", error)
    }
  })

  socket.on("clear-board", () => {
    try {
      const userInfo = userSockets[socket.id]
      if (userInfo) {
        socket.to(userInfo.roomId).emit("clear-board", {
          clearedBy: userInfo.username,
          timestamp: Date.now(),
        })
        console.log(`Whiteboard cleared in room ${userInfo.roomId} by ${userInfo.username}`)
      }
    } catch (error) {
      console.error("Error in clear-board:", error)
    }
  })

  // Enhanced Disconnect Handler
  socket.on("disconnect", () => {
    try {
      console.log("User disconnected:", socket.id)
      const userInfo = userSockets[socket.id]

      if (userInfo && rooms[userInfo.roomId]) {
        // Remove user from room
        rooms[userInfo.roomId] = rooms[userInfo.roomId].filter((u) => u.id !== socket.id)

        // Notify other users
        socket.to(userInfo.roomId).emit("user-disconnected", {
          id: socket.id,
          username: userInfo.username,
        })

        // Send updated room info
        io.to(userInfo.roomId).emit("room-info", {
          roomId: userInfo.roomId,
          userCount: rooms[userInfo.roomId].length,
          users: rooms[userInfo.roomId].map((u) => ({ id: u.id, name: u.name })),
        })

        console.log(
          `${userInfo.username} left room ${userInfo.roomId}. Remaining users: ${rooms[userInfo.roomId].length}`,
        )

        // Clean up empty rooms
        if (rooms[userInfo.roomId].length === 0) {
          delete rooms[userInfo.roomId]
          console.log(`Room ${userInfo.roomId} deleted (empty)`)
        }
      }

      // Clean up user socket info
      delete userSockets[socket.id]
    } catch (error) {
      console.error("Error in disconnect:", error)
    }
  })

  // Add ping/pong for connection health
  socket.on("ping", () => {
    socket.emit("pong")
  })
})

// Periodic cleanup of stale rooms (every 5 minutes)
setInterval(
  () => {
    const now = Date.now()
    const staleThreshold = 30 * 60 * 1000 // 30 minutes

    Object.keys(rooms).forEach((roomId) => {
      rooms[roomId] = rooms[roomId].filter((user) => {
        const isStale = now - user.joinTime > staleThreshold
        if (isStale) {
          console.log(`Removing stale user ${user.name} from room ${roomId}`)
        }
        return !isStale
      })

      if (rooms[roomId].length === 0) {
        delete rooms[roomId]
        console.log(`Cleaned up empty room: ${roomId}`)
      }
    })
  },
  5 * 60 * 1000,
)
