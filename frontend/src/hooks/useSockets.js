// "use client"

// import { useEffect, useRef, useCallback } from "react"
// import io from "socket.io-client"

// export const useSocket = (roomId, username) => {
//   const socketRef = useRef()

//   const initializeSocket = useCallback(() => {
//     if (!socketRef.current) {
//       // Connect to local server - adjust IP if needed for your local network
//       socketRef.current = io("http://localhost:5000", {
//         transports: ["websocket", "polling"],
//         timeout: 20000,
//         forceNew: true,
//       })

//       socketRef.current.on("connect", () => {
//         console.log("Connected to server:", socketRef.current.id)
//       })

//       socketRef.current.on("disconnect", () => {
//         console.log("Disconnected from server")
//       })

//       socketRef.current.on("connect_error", (error) => {
//         console.error("Connection error:", error)
//       })
//     }
//     return socketRef.current
//   }, [])

//   const joinRoom = useCallback(() => {
//     if (socketRef.current && roomId && username) {
//       socketRef.current.emit("join-room", {
//         roomID: roomId,
//         username: username,
//       })
//     }
//   }, [roomId, username])

//   const sendSignal = useCallback((userToSignal, signal, name) => {
//     if (socketRef.current) {
//       socketRef.current.emit("sending-signal", {
//         userToSignal,
//         signal,
//         name,
//       })
//     }
//   }, [])

//   const returnSignal = useCallback((callerID, signal) => {
//     if (socketRef.current) {
//       socketRef.current.emit("returning-signal", {
//         callerID,
//         signal,
//       })
//     }
//   }, [])

//   const sendChatMessage = useCallback((message) => {
//     if (socketRef.current) {
//       socketRef.current.emit("chat-message", message)
//     }
//   }, [])

//   const sendEmojiReaction = useCallback((reaction) => {
//     if (socketRef.current) {
//       socketRef.current.emit("emoji-reaction", reaction)
//     }
//   }, [])

//   const sendDrawingData = useCallback((data) => {
//     if (socketRef.current) {
//       socketRef.current.emit("drawing", data)
//     }
//   }, [])

//   const clearWhiteboard = useCallback(() => {
//     if (socketRef.current) {
//       socketRef.current.emit("clear-board")
//     }
//   }, [])

//   const disconnect = useCallback(() => {
//     if (socketRef.current) {
//       socketRef.current.disconnect()
//       socketRef.current = null
//     }
//   }, [])

//   useEffect(() => {
//     initializeSocket()

//     return () => {
//       disconnect()
//     }
//   }, [initializeSocket, disconnect])

//   return {
//     socket: socketRef.current,
//     joinRoom,
//     sendSignal,
//     returnSignal,
//     sendChatMessage,
//     sendEmojiReaction,
//     sendDrawingData,
//     clearWhiteboard,
//     disconnect,
//   }
// }


"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import io from "socket.io-client"

export const useSocket = (roomId, username) => {
  const socketRef = useRef()
  const [connectionStatus, setConnectionStatus] = useState("disconnected")
  const [roomInfo, setRoomInfo] = useState({ userCount: 0, users: [] })
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const initializeSocket = useCallback(() => {
    if (!socketRef.current) {
      console.log("Initializing socket connection...")

      socketRef.current = io("http://localhost:5000", {
        transports: ["websocket", "polling"],
        timeout: 20000,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      })

      // Enhanced connection event handlers
      socketRef.current.on("connect", () => {
        console.log("✅ Connected to server:", socketRef.current.id)
        setConnectionStatus("connected")
        reconnectAttempts.current = 0
      })

      socketRef.current.on("disconnect", (reason) => {
        console.log("❌ Disconnected from server:", reason)
        setConnectionStatus("disconnected")
      })

      socketRef.current.on("connect_error", (error) => {
        console.error("🔴 Connection error:", error)
        setConnectionStatus("error")
        reconnectAttempts.current++

        if (reconnectAttempts.current >= maxReconnectAttempts) {
          console.error("Max reconnection attempts reached")
          setConnectionStatus("failed")
        }
      })

      socketRef.current.on("reconnect", (attemptNumber) => {
        console.log(`🔄 Reconnected after ${attemptNumber} attempts`)
        setConnectionStatus("connected")
        reconnectAttempts.current = 0
      })

      socketRef.current.on("reconnect_attempt", (attemptNumber) => {
        console.log(`🔄 Reconnection attempt ${attemptNumber}`)
        setConnectionStatus("reconnecting")
      })

      socketRef.current.on("reconnect_error", (error) => {
        console.error("🔴 Reconnection error:", error)
      })

      socketRef.current.on("reconnect_failed", () => {
        console.error("🔴 Reconnection failed")
        setConnectionStatus("failed")
      })

      // Enhanced room info handler
      socketRef.current.on("room-info", (info) => {
        console.log("📊 Room info updated:", info)
        setRoomInfo(info)
      })

      // Error handler
      socketRef.current.on("error", (error) => {
        console.error("🔴 Socket error:", error)
      })

      // Ping/Pong for connection health
      socketRef.current.on("pong", () => {
        console.log("🏓 Pong received")
      })
    }
    return socketRef.current
  }, [])

  const joinRoom = useCallback(() => {
    if (socketRef.current && roomId && username && socketRef.current.connected) {
      console.log(`🚪 Joining room ${roomId} as ${username}`)
      socketRef.current.emit("join-room", {
        roomID: roomId,
        username: username,
      })
    } else {
      console.warn("Cannot join room: socket not connected or missing data")
    }
  }, [roomId, username])

  const sendSignal = useCallback((userToSignal, signal, name) => {
    if (socketRef.current && socketRef.current.connected) {
      console.log(`📡 Sending signal to ${userToSignal}`)
      socketRef.current.emit("sending-signal", {
        userToSignal,
        signal,
        name,
      })
    }
  }, [])

  const returnSignal = useCallback((callerID, signal) => {
    if (socketRef.current && socketRef.current.connected) {
      console.log(`📡 Returning signal to ${callerID}`)
      socketRef.current.emit("returning-signal", {
        callerID,
        signal,
      })
    }
  }, [])

  const sendChatMessage = useCallback((message) => {
    if (socketRef.current && socketRef.current.connected) {
      console.log("💬 Sending chat message")
      socketRef.current.emit("chat-message", message)
    }
  }, [])

  const sendEmojiReaction = useCallback((reaction) => {
    if (socketRef.current && socketRef.current.connected) {
      console.log(`😀 Sending emoji reaction: ${reaction.emoji}`)
      socketRef.current.emit("emoji-reaction", reaction)
    }
  }, [])

  const sendDrawingData = useCallback((data) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("drawing", data)
    }
  }, [])

  const clearWhiteboard = useCallback(() => {
    if (socketRef.current && socketRef.current.connected) {
      console.log("🧹 Clearing whiteboard")
      socketRef.current.emit("clear-board")
    }
  }, [])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log("🔌 Disconnecting socket")
      socketRef.current.disconnect()
      socketRef.current = null
      setConnectionStatus("disconnected")
    }
  }, [])

  // Ping for connection health
  const ping = useCallback(() => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("ping")
    }
  }, [])

  useEffect(() => {
    initializeSocket()

    // Ping every 30 seconds to keep connection alive
    const pingInterval = setInterval(ping, 30000)

    return () => {
      clearInterval(pingInterval)
      disconnect()
    }
  }, [initializeSocket, disconnect, ping])

  return {
    socket: socketRef.current,
    connectionStatus,
    roomInfo,
    joinRoom,
    sendSignal,
    returnSignal,
    sendChatMessage,
    sendEmojiReaction,
    sendDrawingData,
    clearWhiteboard,
    disconnect,
    ping,
  }
}
