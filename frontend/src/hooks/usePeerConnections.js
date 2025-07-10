"use client"

import { useState, useRef, useCallback } from "react"
import Peer from "simple-peer"

export const usePeerConnections = (socket, localStream, username) => {
  const [peers, setPeers] = useState({}) // Always initialize as empty object
  const peersRef = useRef({}) // Always initialize as empty object

  const createPeer = useCallback(
    (userToSignal, callerID, stream) => {
      if (!socket || !stream) return null

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
      })

      peer.on("signal", (signal) => {
        socket.emit("sending-signal", {
          userToSignal,
          signal,
          name: username,
        })
      })

      peer.on("stream", (remoteStream) => {
        setPeers((prevPeers) => ({
          ...prevPeers,
          [userToSignal]: {
            peer,
            stream: remoteStream,
            name: username,
            peerID: userToSignal,
          },
        }))
      })

      peer.on("error", (err) => {
        console.error("Peer error:", err)
      })

      peer.on("close", () => {
        console.log("Peer connection closed")
      })

      return peer
    },
    [socket, username],
  )

  const addPeer = useCallback(
    (incomingSignal, callerID, stream, name) => {
      if (!socket || !stream) return null

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
      })

      peer.on("signal", (signal) => {
        socket.emit("returning-signal", {
          signal,
          callerID,
        })
      })

      peer.on("stream", (remoteStream) => {
        setPeers((prevPeers) => ({
          ...prevPeers,
          [callerID]: {
            peer,
            stream: remoteStream,
            name,
            peerID: callerID,
          },
        }))
      })

      peer.on("error", (err) => {
        console.error("Peer error:", err)
      })

      peer.on("close", () => {
        console.log("Peer connection closed")
      })

      peer.signal(incomingSignal)
      return peer
    },
    [socket],
  )

  const handleAllUsers = useCallback(
    (users) => {
      if (!Array.isArray(users) || !localStream) return

      const newPeers = {}

      users.forEach((user) => {
        const peer = createPeer(user.id, socket?.id, localStream)
        if (peer) {
          newPeers[user.id] = {
            peer,
            name: user.name,
            peerID: user.id,
            stream: null, // Will be set when peer emits stream
          }
        }
      })

      peersRef.current = { ...peersRef.current, ...newPeers }
      setPeers((prevPeers) => ({ ...prevPeers, ...newPeers }))
    },
    [createPeer, socket, localStream],
  )

  const handleUserJoined = useCallback(
    (payload) => {
      if (!payload || !localStream) return

      if (payload.signal) {
        // This is a signal from an existing user
        const peer = addPeer(payload.signal, payload.id, localStream, payload.name)
        if (peer) {
          const peerData = {
            peer,
            name: payload.name,
            peerID: payload.id,
            stream: null, // Will be set when peer emits stream
          }

          peersRef.current[payload.id] = peerData
          setPeers((prevPeers) => ({
            ...prevPeers,
            [payload.id]: peerData,
          }))
        }
      } else {
        // This is a new user joining
        const peer = createPeer(payload.id, socket?.id, localStream)
        if (peer) {
          const peerData = {
            peer,
            name: payload.name,
            peerID: payload.id,
            stream: null, // Will be set when peer emits stream
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

  const handleReceivingReturnedSignal = useCallback((payload) => {
    if (!payload || !payload.id) return

    const peerData = peersRef.current[payload.id]
    if (peerData && peerData.peer) {
      peerData.peer.signal(payload.signal)
    }
  }, [])

  const handleUserDisconnected = useCallback((userID) => {
    if (!userID) return

    const peerData = peersRef.current[userID]
    if (peerData && peerData.peer) {
      peerData.peer.destroy()
    }

    delete peersRef.current[userID]
    setPeers((prevPeers) => {
      const newPeers = { ...prevPeers }
      delete newPeers[userID]
      return newPeers
    })
  }, [])

  const destroyAllPeers = useCallback(() => {
    Object.values(peersRef.current || {}).forEach(({ peer }) => {
      if (peer) peer.destroy()
    })
    peersRef.current = {}
    setPeers({})
  }, [])

  const getPeersRef = useCallback(() => peersRef.current || {}, [])

  return {
    peers: peers || {}, // Always return an object
    peersRef: getPeersRef,
    handleAllUsers,
    handleUserJoined,
    handleReceivingReturnedSignal,
    handleUserDisconnected,
    destroyAllPeers,
  }
}
