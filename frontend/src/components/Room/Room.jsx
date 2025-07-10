"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { useSocket } from "../../hooks/useSockets"
import { useMediaDevices } from "../../hooks/useMediaDevices"
import { usePeerConnections } from "../../hooks/usePeerConnections"
import { copyToClipboard, getUsername } from "../../utils/helpers"
import VideoGrid from "./VideoGrid"
import ChatBox from "./ChatBox"
import ControlPanel from "./ControlPanel"
import EmojiReactions from "./EmojiReactions"
import WhiteboardCanvas from "./WhiteboardCanvas"
import Navbar from "../Navbar"
import VideoPlayer from "./VideoPlayer"

const Room = () => {
  const { roomId } = useParams()
  const username = getUsername()

  // State management
  const [messages, setMessages] = useState([])
  const [emojiHistory, setEmojiHistory] = useState([])
  const [activeEmojis, setActiveEmojis] = useState({})
  const [expandedVideos, setExpandedVideos] = useState({})
  const [showWhiteboard, setShowWhiteboard] = useState(false)
  const [whiteboardExpanded, setWhiteboardExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Custom hooks
  const { socket, joinRoom, sendChatMessage, sendEmojiReaction, disconnect } = useSocket(roomId, username)

  const {
    localStream,
    screenStream,
    isCameraOn,
    isMicOn,
    isSharingScreen,
    getUserMedia,
    toggleCamera,
    toggleMic,
    switchToScreenShare,
    switchBackToCamera,
    cleanup: cleanupMedia,
  } = useMediaDevices()

  const {
    peers,
    peersRef,
    handleAllUsers,
    handleUserJoined,
    handleReceivingReturnedSignal,
    handleUserDisconnected,
    destroyAllPeers,
  } = usePeerConnections(socket, localStream, username)

  // Initialize media and join room
  useEffect(() => {
    const initializeRoom = async () => {
      try {
        await getUserMedia()
        if (socket) {
          joinRoom()
          setIsInitialized(true)
        }
      } catch (error) {
        console.error("Failed to initialize room:", error)
        alert("Failed to access camera/microphone. Please check permissions and refresh the page.")
      }
    }

    if (socket && !isInitialized) {
      initializeRoom()
    }
  }, [socket, getUserMedia, joinRoom, isInitialized])

  // Socket event listeners
  useEffect(() => {
    if (!socket) return

    socket.on("all-users", handleAllUsers)
    socket.on("user-joined", handleUserJoined)
    socket.on("receiving-returned-signal", handleReceivingReturnedSignal)
    socket.on("user-disconnected", handleUserDisconnected)

    socket.on("chat-message", (message) => {
      setMessages((prev) => [...prev, { ...message, timestamp: Date.now() }])
    })

    socket.on("emoji-reaction", ({ userId, emoji }) => {
      setActiveEmojis((prev) => ({
        ...prev,
        [userId]: { emoji, time: Date.now() },
      }))

      setEmojiHistory((prev) => [...prev, { user: userId, emoji, timestamp: Date.now() }])

      // Remove emoji after animation
      setTimeout(() => {
        setActiveEmojis((prev) => {
          const updated = { ...prev }
          delete updated[userId]
          return updated
        })
      }, 3000)
    })

    return () => {
      socket.off("all-users")
      socket.off("user-joined")
      socket.off("receiving-returned-signal")
      socket.off("user-disconnected")
      socket.off("chat-message")
      socket.off("emoji-reaction")
    }
  }, [socket, handleAllUsers, handleUserJoined, handleReceivingReturnedSignal, handleUserDisconnected])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupMedia()
      destroyAllPeers()
      disconnect()
    }
  }, [cleanupMedia, destroyAllPeers, disconnect])

  // Event handlers
  const handleSendMessage = useCallback(
    (message) => {
      const messageData = {
        sender: username,
        text: message,
        timestamp: Date.now(),
      }
      sendChatMessage(messageData)
      setMessages((prev) => [...prev, messageData])
    },
    [username, sendChatMessage],
  )

  const handleSendEmoji = useCallback(
    (emoji) => {
      const reactionData = {
        userId: socket?.id || "me",
        emoji,
      }
      sendEmojiReaction(reactionData)

      setActiveEmojis((prev) => ({
        ...prev,
        me: { emoji, time: Date.now() },
      }))

      setEmojiHistory((prev) => [...prev, { user: "Me", emoji, timestamp: Date.now() }])

      setTimeout(() => {
        setActiveEmojis((prev) => {
          const updated = { ...prev }
          delete updated.me
          return updated
        })
      }, 3000)
    },
    [socket, sendEmojiReaction],
  )

  const handleToggleExpand = useCallback((videoId) => {
    setExpandedVideos((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }))
  }, [])

  const handleScreenShare = useCallback(async () => {
    try {
      if (isSharingScreen) {
        await switchBackToCamera(peersRef())
      } else {
        await switchToScreenShare(peersRef())
      }
    } catch (error) {
      console.error("Screen sharing failed:", error)
      alert("Screen sharing failed. Please try again.")
    }
  }, [isSharingScreen, switchToScreenShare, switchBackToCamera, peersRef])

  const handleCopyRoomId = useCallback(async () => {
    const success = await copyToClipboard(roomId)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [roomId])

  const participantCount = Object.keys(peers || {}).length + 1 // +1 for local user

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Initializing room...</p>
          <p className="text-sm text-gray-400 mt-2">Please allow camera and microphone access</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <Navbar />

      <motion.div
        className="container mx-auto px-4 py-6 flex flex-col xl:flex-row gap-6 max-w-7xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Main Video Area */}
        <div className="flex-1 space-y-6">
          {/* Room Header */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SecureBoard
              </span>
            </h1>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-4">
              <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700/50">
                <span className="text-sm text-gray-300">Room ID: </span>
                <span className="text-yellow-400 font-mono text-sm">{roomId}</span>
              </div>
              <motion.button
                onClick={handleCopyRoomId}
                className="bg-blue-600/80 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition-all backdrop-blur-sm border border-blue-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? "✅ Copied!" : "📋 Copy ID"}
              </motion.button>
            </div>
          </motion.div>

          {/* Video Grid */}
          <VideoGrid
            localStream={localStream}
            screenStream={screenStream}
            peers={peers}
            username={username}
            isSharingScreen={isSharingScreen}
            activeEmojis={activeEmojis}
            expandedVideos={expandedVideos}
            onToggleExpand={handleToggleExpand}
          />

          {/* Control Panel */}
          <ControlPanel
            isCameraOn={isCameraOn}
            isMicOn={isMicOn}
            isSharingScreen={isSharingScreen}
            showWhiteboard={showWhiteboard}
            participantCount={participantCount}
            onToggleCamera={toggleCamera}
            onToggleMic={toggleMic}
            onToggleScreenShare={handleScreenShare}
            onToggleWhiteboard={() => setShowWhiteboard(!showWhiteboard)}
          />

          {/* Emoji Reactions */}
          <EmojiReactions onSendEmoji={handleSendEmoji} activeEmojis={activeEmojis} />

          {/* Whiteboard */}
          {showWhiteboard && (
            <WhiteboardCanvas
              socket={socket}
              onClose={() => setShowWhiteboard(false)}
              isExpanded={whiteboardExpanded}
              onToggleExpand={() => setWhiteboardExpanded(!whiteboardExpanded)}
            />
          )}
        </div>

        {/* Chat Sidebar */}
        <div className="xl:w-80 w-full">
          <ChatBox messages={messages} onSendMessage={handleSendMessage} emojiHistory={emojiHistory} />
        </div>
      </motion.div>
    </div>
  )
}

export default Room
