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

  // Screen sharing layout
  if (isSharingScreen && screenStream) {
    return (
      <div className="space-y-4">
        {/* Main screen share view */}
        <motion.div
          className="relative w-full h-[60vh] bg-gray-900 rounded-xl overflow-hidden"
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
            className="w-full h-full object-contain bg-black"
          />

          {/* PiP Camera overlay */}
          {localStream && (
            <motion.div
              className="absolute bottom-4 right-4 w-32 h-24 md:w-48 md:h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg cursor-move"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              drag
              dragConstraints={{
                top: -300,
                left: -400,
                right: 0,
                bottom: 0,
              }}
              whileDrag={{ scale: 1.05 }}
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
              <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">You (PiP)</div>
            </motion.div>
          )}

          {/* Screen share indicator */}
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>Screen Sharing</span>
          </div>
        </motion.div>

        {/* Other participants in smaller grid */}
        {peerArray.length > 0 && (
          <div className={`grid ${getGridCols()} gap-4`}>
            {peerArray.map((peerData) => (
              <VideoPlayer
                key={peerData.peerID}
                stream={peerData.stream}
                name={peerData.name || "Guest"}
                isLocal={false}
                emoji={activeEmojis[peerData.peerID]?.emoji}
                onToggleExpand={() => onToggleExpand(peerData.peerID)}
                isExpanded={expandedVideos[peerData.peerID] || false}
                className="h-32 md:h-40"
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Normal grid layout
  return (
    <motion.div
      className={`grid ${getGridCols()} gap-4 mb-6`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Local video */}
      {localStream && (
        <VideoPlayer
          stream={localStream}
          name={`${username} (You)`}
          isLocal={true}
          emoji={activeEmojis["me"]?.emoji}
          onToggleExpand={() => onToggleExpand("me")}
          isExpanded={expandedVideos["me"] || false}
        />
      )}

      {/* Peer videos */}
      {peerArray.map((peerData, index) => (
        <motion.div
          key={peerData.peerID}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
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

      {/* Show message if no videos */}
      {!localStream && peerArray.length === 0 && (
        <div className="col-span-full flex items-center justify-center h-64 bg-gray-800 rounded-xl">
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-4">📹</div>
            <p className="text-lg">Connecting to camera...</p>
            <p className="text-sm">Please allow camera and microphone access</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default VideoGrid
