// "use client"

// import { useState, useRef, useCallback } from "react"
// import Peer from "simple-peer"

// export const usePeerConnections = (socket, localStream, username) => {
//   const [peers, setPeers] = useState({})
//   const peersRef = useRef({})

//   const createPeer = useCallback(
//     (userToSignal, callerID, stream) => {
//       if (!socket || !stream) return null

//       const peer = new Peer({
//         initiator: true,
//         trickle: false,
//         stream,
//         config: {
//           iceServers: [
//             // Local network configuration - no STUN/TURN servers needed
//             { urls: [] },
//           ],
//         },
//       })

//       peer.on("signal", (signal) => {
//         socket.emit("sending-signal", {
//           userToSignal,
//           signal,
//           name: username,
//         })
//       })

//       peer.on("stream", (remoteStream) => {
//         setPeers((prevPeers) => ({
//           ...prevPeers,
//           [userToSignal]: {
//             peer,
//             stream: remoteStream,
//             name: username,
//             peerID: userToSignal,
//           },
//         }))
//       })

//       peer.on("error", (err) => {
//         console.error("Peer error:", err)
//       })

//       peer.on("close", () => {
//         console.log("Peer connection closed")
//       })

//       peer.on("connect", () => {
//         console.log("Peer connected successfully")
//       })

//       return peer
//     },
//     [socket, username],
//   )

//   const addPeer = useCallback(
//     (incomingSignal, callerID, stream, name) => {
//       if (!socket || !stream) return null

//       const peer = new Peer({
//         initiator: false,
//         trickle: false,
//         stream,
//         config: {
//           iceServers: [
//             // Local network configuration - no STUN/TURN servers needed
//             { urls: [] },
//           ],
//         },
//       })

//       peer.on("signal", (signal) => {
//         socket.emit("returning-signal", {
//           signal,
//           callerID,
//         })
//       })

//       peer.on("stream", (remoteStream) => {
//         setPeers((prevPeers) => ({
//           ...prevPeers,
//           [callerID]: {
//             peer,
//             stream: remoteStream,
//             name,
//             peerID: callerID,
//           },
//         }))
//       })

//       peer.on("error", (err) => {
//         console.error("Peer error:", err)
//       })

//       peer.on("close", () => {
//         console.log("Peer connection closed")
//       })

//       peer.on("connect", () => {
//         console.log("Peer connected successfully")
//       })

//       peer.signal(incomingSignal)
//       return peer
//     },
//     [socket],
//   )

//   const handleAllUsers = useCallback(
//     (users) => {
//       if (!Array.isArray(users) || !localStream) return

//       const newPeers = {}

//       users.forEach((user) => {
//         const peer = createPeer(user.id, socket?.id, localStream)
//         if (peer) {
//           newPeers[user.id] = {
//             peer,
//             name: user.name,
//             peerID: user.id,
//             stream: null,
//           }
//         }
//       })

//       peersRef.current = { ...peersRef.current, ...newPeers }
//       setPeers((prevPeers) => ({ ...prevPeers, ...newPeers }))
//     },
//     [createPeer, socket, localStream],
//   )

//   const handleUserJoined = useCallback(
//     (payload) => {
//       if (!payload || !localStream) return

//       if (payload.signal) {
//         const peer = addPeer(payload.signal, payload.id, localStream, payload.name)
//         if (peer) {
//           const peerData = {
//             peer,
//             name: payload.name,
//             peerID: payload.id,
//             stream: null,
//           }

//           peersRef.current[payload.id] = peerData
//           setPeers((prevPeers) => ({
//             ...prevPeers,
//             [payload.id]: peerData,
//           }))
//         }
//       } else {
//         const peer = createPeer(payload.id, socket?.id, localStream)
//         if (peer) {
//           const peerData = {
//             peer,
//             name: payload.name,
//             peerID: payload.id,
//             stream: null,
//           }

//           peersRef.current[payload.id] = peerData
//           setPeers((prevPeers) => ({
//             ...prevPeers,
//             [payload.id]: peerData,
//           }))
//         }
//       }
//     },
//     [addPeer, createPeer, socket, localStream],
//   )

//   const handleReceivingReturnedSignal = useCallback((payload) => {
//     if (!payload || !payload.id) return

//     const peerData = peersRef.current[payload.id]
//     if (peerData && peerData.peer) {
//       peerData.peer.signal(payload.signal)
//     }
//   }, [])

//   const handleUserDisconnected = useCallback((userID) => {
//     if (!userID) return

//     const peerData = peersRef.current[userID]
//     if (peerData && peerData.peer) {
//       peerData.peer.destroy()
//     }

//     delete peersRef.current[userID]
//     setPeers((prevPeers) => {
//       const newPeers = { ...prevPeers }
//       delete newPeers[userID]
//       return newPeers
//     })
//   }, [])

//   const destroyAllPeers = useCallback(() => {
//     Object.values(peersRef.current || {}).forEach(({ peer }) => {
//       if (peer) peer.destroy()
//     })
//     peersRef.current = {}
//     setPeers({})
//   }, [])

//   const getPeersRef = useCallback(() => peersRef.current || {}, [])

//   return {
//     peers: peers || {},
//     peersRef: getPeersRef,
//     handleAllUsers,
//     handleUserJoined,
//     handleReceivingReturnedSignal,
//     handleUserDisconnected,
//     destroyAllPeers,
//   }
// }


"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Peer from "simple-peer"

export const usePeerConnections = (socket, localStream, username) => {
  const [peers, setPeers] = useState({})
  const peersRef = useRef({})
  const [connectionStats, setConnectionStats] = useState({})

  // Enhanced peer creation with better error handling
  const createPeer = useCallback(
    (userToSignal, callerID, stream) => {
      if (!socket || !stream) {
        console.error("Cannot create peer: missing socket or stream")
        return null
      }

      console.log(`Creating peer connection to ${userToSignal}`)

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
        config: {
          iceServers: [
            // For localhost development, we don't need STUN servers
            // But keeping these for potential network traversal
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        },
      })

      // Enhanced signaling
      peer.on("signal", (signal) => {
        console.log(`Sending signal to ${userToSignal}`)
        socket.emit("sending-signal", {
          userToSignal,
          signal,
          name: username,
        })
      })

      // Enhanced stream handling
      peer.on("stream", (remoteStream) => {
        console.log(`Received stream from ${userToSignal}`)
        setPeers((prevPeers) => ({
          ...prevPeers,
          [userToSignal]: {
            peer,
            stream: remoteStream,
            name: username,
            peerID: userToSignal,
            connected: true,
            connectionTime: Date.now(),
          },
        }))

        // Update connection stats
        setConnectionStats((prev) => ({
          ...prev,
          [userToSignal]: {
            connected: true,
            connectionTime: Date.now(),
            quality: "good",
          },
        }))
      })

      // Enhanced error handling
      peer.on("error", (err) => {
        console.error(`Peer error with ${userToSignal}:`, err)
        setConnectionStats((prev) => ({
          ...prev,
          [userToSignal]: {
            ...prev[userToSignal],
            error: err.message,
            connected: false,
          },
        }))
      })

      // Connection state monitoring
      peer.on("connect", () => {
        console.log(`Peer connected successfully to ${userToSignal}`)
        setConnectionStats((prev) => ({
          ...prev,
          [userToSignal]: {
            ...prev[userToSignal],
            connected: true,
            connectionTime: Date.now(),
          },
        }))
      })

      peer.on("close", () => {
        console.log(`Peer connection closed with ${userToSignal}`)
        setConnectionStats((prev) => ({
          ...prev,
          [userToSignal]: {
            ...prev[userToSignal],
            connected: false,
            disconnectionTime: Date.now(),
          },
        }))
      })

      // Data channel for additional communication
      peer.on("data", (data) => {
        try {
          const message = JSON.parse(data.toString())
          console.log(`Received data from ${userToSignal}:`, message)
        } catch (error) {
          console.error("Error parsing peer data:", error)
        }
      })

      return peer
    },
    [socket, username],
  )

  // Enhanced peer addition
  const addPeer = useCallback(
    (incomingSignal, callerID, stream, name) => {
      if (!socket || !stream) {
        console.error("Cannot add peer: missing socket or stream")
        return null
      }

      console.log(`Adding peer connection from ${callerID} (${name})`)

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
        config: {
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
        },
      })

      // Enhanced signaling response
      peer.on("signal", (signal) => {
        console.log(`Returning signal to ${callerID}`)
        socket.emit("returning-signal", {
          signal,
          callerID,
        })
      })

      // Enhanced stream handling
      peer.on("stream", (remoteStream) => {
        console.log(`Received stream from ${callerID} (${name})`)
        setPeers((prevPeers) => ({
          ...prevPeers,
          [callerID]: {
            peer,
            stream: remoteStream,
            name: name || "Unknown",
            peerID: callerID,
            connected: true,
            connectionTime: Date.now(),
          },
        }))

        setConnectionStats((prev) => ({
          ...prev,
          [callerID]: {
            connected: true,
            connectionTime: Date.now(),
            quality: "good",
          },
        }))
      })

      // Enhanced error handling
      peer.on("error", (err) => {
        console.error(`Peer error with ${callerID}:`, err)
        setConnectionStats((prev) => ({
          ...prev,
          [callerID]: {
            ...prev[callerID],
            error: err.message,
            connected: false,
          },
        }))
      })

      peer.on("connect", () => {
        console.log(`Peer connected successfully from ${callerID}`)
        setConnectionStats((prev) => ({
          ...prev,
          [callerID]: {
            ...prev[callerID],
            connected: true,
            connectionTime: Date.now(),
          },
        }))
      })

      peer.on("close", () => {
        console.log(`Peer connection closed with ${callerID}`)
        setConnectionStats((prev) => ({
          ...prev,
          [callerID]: {
            ...prev[callerID],
            connected: false,
            disconnectionTime: Date.now(),
          },
        }))
      })

      try {
        peer.signal(incomingSignal)
      } catch (error) {
        console.error("Error signaling peer:", error)
      }

      return peer
    },
    [socket],
  )

  // Enhanced user handling
  const handleAllUsers = useCallback(
    (users) => {
      if (!Array.isArray(users) || !localStream) {
        console.log("No users to connect to or no local stream")
        return
      }

      console.log(
        `Connecting to ${users.length} existing users:`,
        users.map((u) => u.name),
      )

      const newPeers = {}

      users.forEach((user) => {
        if (user.id && user.id !== socket?.id) {
          const peer = createPeer(user.id, socket?.id, localStream)
          if (peer) {
            newPeers[user.id] = {
              peer,
              name: user.name || "Unknown",
              peerID: user.id,
              stream: null,
              connected: false,
              connectionTime: Date.now(),
            }
          }
        }
      })

      peersRef.current = { ...peersRef.current, ...newPeers }
      setPeers((prevPeers) => ({ ...prevPeers, ...newPeers }))
    },
    [createPeer, socket, localStream],
  )

  // Enhanced user join handling
  const handleUserJoined = useCallback(
    (payload) => {
      if (!payload || !localStream) {
        console.error("Invalid payload or no local stream for user join")
        return
      }

      console.log("User joined:", payload)

      if (payload.signal) {
        // This is a response to our initial signal
        const peer = addPeer(payload.signal, payload.id, localStream, payload.name)
        if (peer) {
          const peerData = {
            peer,
            name: payload.name || "Unknown",
            peerID: payload.id,
            stream: null,
            connected: false,
            connectionTime: Date.now(),
          }

          peersRef.current[payload.id] = peerData
          setPeers((prevPeers) => ({
            ...prevPeers,
            [payload.id]: peerData,
          }))
        }
      } else {
        // This is a new user joining, we need to initiate connection
        const peer = createPeer(payload.id, socket?.id, localStream)
        if (peer) {
          const peerData = {
            peer,
            name: payload.name || "Unknown",
            peerID: payload.id,
            stream: null,
            connected: false,
            connectionTime: Date.now(),
          }

          peersRef.current[payload.id] = peerData
          setPeers((prevPeers) => ({
            ...prevPeers,
            [payload.id]: peerData,
          }))
        }
      }
    },
    [addPeer, createPeer, socket, localStream],
  )

  // Enhanced signal handling
  const handleReceivingReturnedSignal = useCallback((payload) => {
    if (!payload || !payload.id) {
      console.error("Invalid returned signal payload")
      return
    }

    console.log(`Received returned signal from ${payload.id}`)
    const peerData = peersRef.current[payload.id]
    if (peerData && peerData.peer) {
      try {
        peerData.peer.signal(payload.signal)
      } catch (error) {
        console.error("Error processing returned signal:", error)
      }
    } else {
      console.warn(`No peer found for returned signal from ${payload.id}`)
    }
  }, [])

  // Enhanced disconnect handling
  const handleUserDisconnected = useCallback((payload) => {
    const userID = payload?.id || payload
    if (!userID) {
      console.error("Invalid disconnect payload")
      return
    }

    console.log(`User disconnected: ${userID} (${payload?.username || "Unknown"})`)

    const peerData = peersRef.current[userID]
    if (peerData && peerData.peer) {
      try {
        peerData.peer.destroy()
      } catch (error) {
        console.error("Error destroying peer:", error)
      }
    }

    delete peersRef.current[userID]
    setPeers((prevPeers) => {
      const newPeers = { ...prevPeers }
      delete newPeers[userID]
      return newPeers
    })

    setConnectionStats((prev) => {
      const newStats = { ...prev }
      delete newStats[userID]
      return newStats
    })
  }, [])

  // Enhanced cleanup
  const destroyAllPeers = useCallback(() => {
    console.log("Destroying all peer connections")
    Object.values(peersRef.current || {}).forEach(({ peer }) => {
      if (peer) {
        try {
          peer.destroy()
        } catch (error) {
          console.error("Error destroying peer:", error)
        }
      }
    })
    peersRef.current = {}
    setPeers({})
    setConnectionStats({})
  }, [])

  const getPeersRef = useCallback(() => peersRef.current || {}, [])

  // Connection health monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      Object.entries(peersRef.current).forEach(([peerId, peerData]) => {
        if (peerData.peer && peerData.peer._pc) {
          peerData.peer._pc
            .getStats()
            .then((stats) => {
              // Update connection quality based on stats
              setConnectionStats((prev) => ({
                ...prev,
                [peerId]: {
                  ...prev[peerId],
                  lastStatsUpdate: Date.now(),
                },
              }))
            })
            .catch((err) => {
              console.warn(`Failed to get stats for peer ${peerId}:`, err)
            })
        }
      })
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return {
    peers: peers || {},
    peersRef: getPeersRef,
    connectionStats,
    handleAllUsers,
    handleUserJoined,
    handleReceivingReturnedSignal,
    handleUserDisconnected,
    destroyAllPeers,
  }
}
