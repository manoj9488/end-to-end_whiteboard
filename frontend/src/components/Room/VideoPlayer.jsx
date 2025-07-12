// "use client"

// import { useRef, useEffect, useState } from "react"
// import { motion } from "framer-motion"
// import { requestPictureInPicture } from "../../utils/helpers"

// const VideoPlayer = ({ stream, name, isLocal = false, emoji = null, onToggleExpand, isExpanded = false }) => {
//   const videoRef = useRef()
//   const [isVideoLoaded, setIsVideoLoaded] = useState(false)

//   useEffect(() => {
//     if (videoRef.current && stream) {
//       videoRef.current.srcObject = stream
//       setIsVideoLoaded(true)
//     }
//   }, [stream])

//   const handlePiP = () => {
//     requestPictureInPicture(videoRef.current)
//   }

//   return (
//     <motion.div
//       className={`relative ${isExpanded ? "w-full h-[70vh]" : "w-full max-w-xs h-56"} transition-all duration-300`}
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.9 }}
//       transition={{ duration: 0.3 }}
//     >
//       <video
//         ref={videoRef}
//         autoPlay
//         playsInline
//         muted={isLocal}
//         className={`object-cover w-full h-full rounded-xl border-4 ${
//           isLocal ? "border-green-500" : "border-purple-500"
//         } ${!isVideoLoaded ? "bg-gray-800" : ""}`}
//       />

//       {/* Loading placeholder */}
//       {!isVideoLoaded && (
//         <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-xl">
//           <div className="text-white text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
//             <p className="text-sm">Loading video...</p>
//           </div>
//         </div>
//       )}

//       {/* Emoji reaction overlay */}
//       {emoji && (
//         <motion.div
//           className="absolute top-4 left-4 text-4xl pointer-events-none"
//           initial={{ opacity: 0, y: 20, scale: 0.5 }}
//           animate={{ opacity: 1, y: 0, scale: 1 }}
//           exit={{ opacity: 0, y: -20, scale: 0.5 }}
//           transition={{ duration: 0.5 }}
//         >
//           {emoji}
//         </motion.div>
//       )}

//       {/* User name overlay */}
//       <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded-full">
//         {name}
//       </div>

//       {/* Control buttons */}
//       <div className="absolute top-2 right-2 flex gap-1">
//         <motion.button
//           onClick={onToggleExpand}
//           className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded hover:bg-opacity-90 transition-all"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           {isExpanded ? "📉" : "📈"}
//         </motion.button>

//         <motion.button
//           onClick={handlePiP}
//           className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded hover:bg-opacity-90 transition-all"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           📺
//         </motion.button>
//       </div>
//     </motion.div>
//   )
// }

// export default VideoPlayer




"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { requestPictureInPicture } from "../../utils/helpers"

const VideoPlayer = ({ stream, name, isLocal = false, emoji = null, onToggleExpand, isExpanded = false }) => {
  const videoRef = useRef()
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

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
      className={`relative group ${
        isExpanded ? "w-full h-[75vh]" : "w-full max-w-sm h-64"
      } transition-all duration-500`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={`object-cover w-full h-full transition-all duration-300 ${
            isLocal
              ? "border-4 border-green-400/60 shadow-green-400/30"
              : "border-4 border-purple-400/60 shadow-purple-400/30"
          } ${!isVideoLoaded ? "bg-gradient-to-br from-gray-800 to-gray-900" : ""} shadow-2xl`}
        />

        {/* Enhanced Loading placeholder */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl">
            <div className="text-white text-center">
              <motion.div
                className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <p className="text-lg font-bold mb-2">Loading video...</p>
                <p className="text-sm text-gray-400">Connecting to {name}</p>
                <div className="flex justify-center space-x-1 mt-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Enhanced Emoji reaction overlay */}
        {emoji && (
          <motion.div
            className="absolute top-6 left-6 text-5xl pointer-events-none filter drop-shadow-2xl z-10"
            initial={{ opacity: 0, y: 30, scale: 0.3, rotate: -180 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.3, rotate: 180 }}
            transition={{
              duration: 0.8,
              type: "spring",
              stiffness: 200,
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 15, -15, 10, -10, 0],
                scale: [1, 1.2, 1, 1.1, 1],
              }}
              transition={{
                duration: 1,
                repeat: 3,
              }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-2 border border-white/30"
            >
              {emoji}
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced User name overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <motion.div
            className={`bg-black/80 backdrop-blur-sm text-white px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${
              isLocal ? "border-green-400/50 bg-green-900/20" : "border-purple-400/50 bg-purple-900/20"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div
                    className={`w-3 h-3 rounded-full ${isLocal ? "bg-green-400" : "bg-purple-400"} animate-pulse`}
                  ></div>
                  <div
                    className={`absolute inset-0 w-3 h-3 rounded-full ${isLocal ? "bg-green-400" : "bg-purple-400"} animate-ping opacity-75`}
                  ></div>
                </div>
                <span className="text-sm font-bold">{name}</span>
              </div>
              {isLocal && (
                <span className="text-xs bg-green-500/30 text-green-300 px-3 py-1 rounded-full border border-green-400/30">
                  You
                </span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Enhanced Control buttons */}
        <motion.div
          className="absolute top-4 right-4 flex gap-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            onClick={onToggleExpand}
            className="bg-black/80 backdrop-blur-sm text-white p-3 rounded-2xl hover:bg-black/90 transition-all shadow-xl border border-white/20 hover:border-white/40"
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            title={isExpanded ? "Minimize" : "Expand"}
          >
            <span className="text-lg">{isExpanded ? "📉" : "📈"}</span>
          </motion.button>

          <motion.button
            onClick={handlePiP}
            className="bg-black/80 backdrop-blur-sm text-white p-3 rounded-2xl hover:bg-black/90 transition-all shadow-xl border border-white/20 hover:border-white/40"
            whileHover={{ scale: 1.1, rotate: -10 }}
            whileTap={{ scale: 0.9 }}
            title="Picture in Picture"
          >
            <span className="text-lg">📺</span>
          </motion.button>
        </motion.div>

        {/* Enhanced Connection quality indicator */}
        <div className="absolute top-4 left-4">
          <motion.div
            className="flex items-center space-x-2 bg-black/70 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
            <span className="text-xs text-white font-bold">HD</span>
          </motion.div>
        </div>

        {/* Enhanced Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none rounded-3xl"></div>

        {/* Subtle border glow effect */}
        <div
          className={`absolute inset-0 rounded-3xl pointer-events-none ${
            isLocal ? "shadow-[0_0_30px_rgba(34,197,94,0.3)]" : "shadow-[0_0_30px_rgba(168,85,247,0.3)]"
          }`}
        ></div>
      </div>
    </motion.div>
  )
}

export default VideoPlayer
