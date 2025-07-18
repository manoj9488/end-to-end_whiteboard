"use client"

import { motion } from "framer-motion"
import VideoPlayer from "./VideoPlayer"

const VideoGrid = ({
  localStream = null,
  screenStream = null,
  peers = {},
  username = "Guest",
  isSharingScreen = false,
  activeEmojis = {},
  expandedVideos = {},
  onToggleExpand = () => {},
}) => {
  // Ensure peers is always an object and filter safely
  const safePeers = peers && typeof peers === "object" ? peers : {}
  const peerArray = Object.values(safePeers).filter((peer) => peer && peer.stream && peer.peerID)
  const totalVideos = peerArray.length + (localStream ? 1 : 0)

  // Determine grid layout based on number of videos
  const getGridCols = () => {
    if (totalVideos <= 1) return "grid-cols-1"
    if (totalVideos === 2) return "grid-cols-1 md:grid-cols-2"
    if (totalVideos <= 4) return "grid-cols-1 md:grid-cols-2"
    if (totalVideos <= 6) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  }

  // Enhanced Screen sharing layout
  if (isSharingScreen && screenStream) {
    return (
      <div className="space-y-6">
        {/* Main screen share view with enhanced styling */}
        <motion.div
          className="relative w-full h-[65vh] bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-700/50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <video
            autoPlay
            playsInline
            muted
            ref={(ref) => {
              if (ref && screenStream) {
                ref.srcObject = screenStream
              }
            }}
            className="w-full h-full object-contain bg-black rounded-3xl"
          />

          {/* Enhanced PiP Camera overlay */}
          {localStream && (
            <motion.div
              className="absolute bottom-6 right-6 w-44 h-32 md:w-60 md:h-44 bg-gray-800 rounded-3xl overflow-hidden border-3 border-white/40 shadow-2xl cursor-move backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              drag
              dragConstraints={{
                top: -400,
                left: -500,
                right: 0,
                bottom: 0,
              }}
              whileDrag={{ scale: 1.05, rotate: 3 }}
              dragElastic={0.1}
            >
              <video
                autoPlay
                playsInline
                muted
                ref={(ref) => {
                  if (ref && localStream) {
                    ref.srcObject = localStream
                  }
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/90 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-2xl font-bold border border-white/30">
                You (PiP)
              </div>
              <div className="absolute top-3 right-3 bg-white/30 backdrop-blur-sm rounded-full p-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </motion.div>
          )}

          {/* Enhanced Screen share indicator */}
          <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-3xl text-sm font-bold flex items-center space-x-3 shadow-2xl backdrop-blur-sm border border-red-400/50">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span>🖥️ Screen Sharing Active</span>
          </div>

          {/* Enhanced Screen share controls */}
          <div className="absolute top-6 right-6 flex space-x-3">
            <motion.button
              className="bg-black/70 backdrop-blur-sm text-white p-4 rounded-2xl hover:bg-black/80 transition-all shadow-lg border border-white/20"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              📹
            </motion.button>
            <motion.button
              className="bg-black/70 backdrop-blur-sm text-white p-4 rounded-2xl hover:bg-black/80 transition-all shadow-lg border border-white/20"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              🎤
            </motion.button>
          </div>
        </motion.div>

        {/* Other participants in enhanced smaller grid */}
        {peerArray.length > 0 && (
          <div className={`grid ${getGridCols()} gap-6`}>
            {peerArray.map((peerData, index) => (
              <motion.div
                key={peerData.peerID}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <VideoPlayer
                  stream={peerData.stream}
                  name={peerData.name || "Guest"}
                  isLocal={false}
                  emoji={activeEmojis[peerData.peerID]?.emoji}
                  onToggleExpand={() => onToggleExpand(peerData.peerID)}
                  isExpanded={expandedVideos[peerData.peerID] || false}
                  className="h-32 md:h-40"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Enhanced Normal grid layout
  return (
    <motion.div
      className={`grid ${getGridCols()} gap-6 mb-8`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Local video */}
      {localStream && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <VideoPlayer
            stream={localStream}
            name={`${username} (You)`}
            isLocal={true}
            emoji={activeEmojis["me"]?.emoji}
            onToggleExpand={() => onToggleExpand("me")}
            isExpanded={expandedVideos["me"] || false}
          />
        </motion.div>
      )}

      {/* Enhanced Peer videos */}
      {peerArray.map((peerData, index) => (
        <motion.div
          key={peerData.peerID}
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            delay: index * 0.15,
            type: "spring",
            stiffness: 100,
          }}
          whileHover={{ y: -8 }}
        >
          <VideoPlayer
            stream={peerData.stream}
            name={peerData.name || "Guest"}
            isLocal={false}
            emoji={activeEmojis[peerData.peerID]?.emoji}
            onToggleExpand={() => onToggleExpand(peerData.peerID)}
            isExpanded={expandedVideos[peerData.peerID] || false}
          />
        </motion.div>
      ))}

      {/* Enhanced empty state */}
      {!localStream && peerArray.length === 0 && (
        <div className="col-span-full flex items-center justify-center h-96 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl border border-gray-700/50 shadow-2xl">
          <div className="text-center text-gray-400">
            <motion.div
              className="text-8xl mb-8"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              📹
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <h3 className="text-3xl font-bold mb-4 text-white">Connecting to camera...</h3>
              <p className="text-xl mb-6">Please allow camera and microphone access</p>
              <div className="flex justify-center space-x-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                <div
                  className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default VideoGrid
