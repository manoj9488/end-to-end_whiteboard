"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { v4 as uuid } from "uuid"
import axios from "axios"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"

const HomePage = () => {
  const [roomId, setRoomId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recentRooms, setRecentRooms] = useState([])
  const [showQuickJoin, setShowQuickJoin] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  useEffect(() => {
    // Load recent rooms from localStorage
    const recent = JSON.parse(localStorage.getItem("recentRooms") || "[]")
    setRecentRooms(recent.slice(0, 5)) // Show only last 5 rooms
  }, [])

  const saveRecentRoom = (roomId) => {
    const recent = JSON.parse(localStorage.getItem("recentRooms") || "[]")
    const updated = [roomId, ...recent.filter((id) => id !== roomId)].slice(0, 10)
    localStorage.setItem("recentRooms", JSON.stringify(updated))
  }

  const handleCreateRoom = async () => {
    setIsLoading(true)
    const newRoomId = uuid()

    try {
      await axios.post("http://localhost:5000/api/room/create", {
        roomId: newRoomId,
        createdBy: user.name || "Guest",
      })

      saveRecentRoom(newRoomId)
      navigate(`/room/${newRoomId}`)
    } catch (err) {
      console.error("Room creation failed:", err)
      alert("Failed to create room. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinRoom = async (targetRoomId = roomId) => {
    if (!targetRoomId.trim()) {
      alert("Please enter a Room ID")
      return
    }

    setIsLoading(true)

    try {
      await axios.post("http://localhost:5000/api/room/join", { roomId: targetRoomId })
      saveRecentRoom(targetRoomId)
      navigate(`/room/${targetRoomId}`)
    } catch (err) {
      console.error("Room join failed:", err)
      alert("Room not found or unable to join. Please check the Room ID.")
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: "🎥",
      title: "HD Video Calls",
      description: "Crystal clear video quality with adaptive streaming",
    },
    {
      icon: "🎨",
      title: "Interactive Whiteboard",
      description: "Collaborate in real-time with drawing tools",
    },
    {
      icon: "💬",
      title: "Live Chat",
      description: "Text messaging with emoji reactions",
    },
    {
      icon: "🖥️",
      title: "Screen Sharing",
      description: "Share your screen with participants",
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "End-to-end encrypted communications",
    },
    {
      icon: "📱",
      title: "Cross Platform",
      description: "Works on desktop, tablet, and mobile",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SecureBoard
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Connect, collaborate, and communicate with high-quality video calls, interactive whiteboards, and real-time
            messaging.
          </motion.p>

          <motion.div
            className="text-lg text-blue-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Hello, <span className="font-semibold text-white">{user.name || "Guest"}</span>! 👋
          </motion.div>
        </motion.div>

        {/* Main Action Cards */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Create Room Card */}
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl"> </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Create New Room</h3>
                <p className="text-gray-300 mb-6">Start a new meeting instantly with a unique room ID</p>
                <motion.button
                  onClick={handleCreateRoom}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>Create Room</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Join Room Card */}
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl"> </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Join Existing Room</h3>
                <p className="text-gray-300 mb-6">Enter a room ID to join an ongoing meeting</p>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter Room ID"
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleJoinRoom()}
                  />
                  <motion.button
                    onClick={() => handleJoinRoom()}
                    disabled={isLoading || !roomId.trim()}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Joining...</span>
                      </>
                    ) : (
                      <>
                        <span>🚪</span>
                        <span>Join Room</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Recent Rooms */}
        {recentRooms.length > 0 && (
          <motion.div
            className="max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Recent Rooms</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentRooms.map((room, index) => (
                <motion.button
                  key={room}
                  onClick={() => handleJoinRoom(room)}
                  className="bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg p-4 text-left transition-all duration-200 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{room}</p>
                      <p className="text-gray-400 text-sm">Click to rejoin</p>
                    </div>
                    <div className="text-gray-400 group-hover:text-white transition-colors">→</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Features Grid */}
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Why Choose SecureBoard?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HomePage
