"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { requestPictureInPicture } from "../../utils/helpers"

const VideoPlayer = ({ stream, name, isLocal = false, emoji = null, onToggleExpand, isExpanded = false }) => {
  const videoRef = useRef()
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      setIsVideoLoaded(true)
    }
  }, [stream])

  const handlePiP = () => {
    requestPictureInPicture(videoRef.current)
  }

  return (
    <motion.div
      className={`relative ${isExpanded ? "w-full h-[70vh]" : "w-full max-w-xs h-56"} transition-all duration-300`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`object-cover w-full h-full rounded-xl border-4 ${
          isLocal ? "border-green-500" : "border-purple-500"
        } ${!isVideoLoaded ? "bg-gray-800" : ""}`}
      />

      {/* Loading placeholder */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-xl">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* Emoji reaction overlay */}
      {emoji && (
        <motion.div
          className="absolute top-4 left-4 text-4xl pointer-events-none"
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          {emoji}
        </motion.div>
      )}

      {/* User name overlay */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded-full">
        {name}
      </div>

      {/* Control buttons */}
      <div className="absolute top-2 right-2 flex gap-1">
        <motion.button
          onClick={onToggleExpand}
          className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded hover:bg-opacity-90 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isExpanded ? "📉" : "📈"}
        </motion.button>

        <motion.button
          onClick={handlePiP}
          className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded hover:bg-opacity-90 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📺
        </motion.button>
      </div>
    </motion.div>
  )
}

export default VideoPlayer
