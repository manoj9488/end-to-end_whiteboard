// "use client"

// import { useEffect, useRef, useCallback } from "react"
// import io from "socket.io-client"

// export const useSocket = (roomId, username) => {
//   const socketRef = useRef()

//   const initializeSocket = useCallback(() => {
//     if (!socketRef.current) {
//       socketRef.current = io("http://localhost:5000")
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
//     sendChatMessage,
//     sendEmojiReaction,
//     sendDrawingData,
//     clearWhiteboard,
//     disconnect,
//   }
// }




"use client"

import { useEffect, useRef, useCallback } from "react"
import io from "socket.io-client"

export const useSocket = (roomId, username) => {
  const socketRef = useRef()

  const initializeSocket = useCallback(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000")
    }
    return socketRef.current
  }, [])

  const joinRoom = useCallback(() => {
    if (socketRef.current && roomId && username) {
      socketRef.current.emit("join-room", {
        roomID: roomId,
        username: username,
      })
    }
  }, [roomId, username])

  const sendSignal = useCallback((userToSignal, signal, name) => {
    if (socketRef.current) {
      socketRef.current.emit("sending-signal", {
        userToSignal,
        signal,
        name,
      })
    }
  }, [])

  const returnSignal = useCallback((callerID, signal) => {
    if (socketRef.current) {
      socketRef.current.emit("returning-signal", {
        callerID,
        signal,
      })
    }
  }, [])

  const sendChatMessage = useCallback((message) => {
    if (socketRef.current) {
      socketRef.current.emit("chat-message", message)
    }
  }, [])

  const sendEmojiReaction = useCallback((reaction) => {
    if (socketRef.current) {
      socketRef.current.emit("emoji-reaction", reaction)
    }
  }, [])

  const sendDrawingData = useCallback((data) => {
    if (socketRef.current) {
      socketRef.current.emit("drawing", data)
    }
  }, [])

  const clearWhiteboard = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("clear-board")
    }
  }, [])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
  }, [])

  useEffect(() => {
    initializeSocket()

    return () => {
      disconnect()
    }
  }, [initializeSocket, disconnect])

  return {
    socket: socketRef.current,
    joinRoom,
    sendSignal,
    returnSignal,
    sendChatMessage,
    sendEmojiReaction,
    sendDrawingData,
    clearWhiteboard,
    disconnect,
  }
}
