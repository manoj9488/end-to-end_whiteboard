// "use client"

// import { useRef, useEffect, useState } from "react"
// import { motion } from "framer-motion"
// import { requestPictureInPicture } from "../../utils/helpers"

// const VideoPlayer = ({
//   stream,
//   name = "Guest",
//   isLocal = false,
//   emoji = null,
//   onToggleExpand = () => {},
//   isExpanded = false,
//   className = "",
// }) => {
//   const videoRef = useRef(null)
//   const [isVideoLoaded, setIsVideoLoaded] = useState(false)
//   const [isHovered, setIsHovered] = useState(false)
//   const [videoError, setVideoError] = useState(null)

//   useEffect(() => {
//     const videoElement = videoRef.current
//     if (!videoElement || !stream) return

//     const handleLoadedMetadata = () => {
//       console.log("Video metadata loaded for:", name)
//       setIsVideoLoaded(true)
//       setVideoError(null)
//     }

//     const handleError = (error) => {
//       console.error("Video error for", name, ":", error)
//       setVideoError("Failed to load video")
//       setIsVideoLoaded(false)
//     }

//     const handleLoadStart = () => {
//       console.log("Video load started for:", name)
//       setIsVideoLoaded(false)
//     }

//     const handleCanPlay = () => {
//       console.log("Video can play for:", name)
//       setIsVideoLoaded(true)
//     }

//     try {
//       // Set the stream
//       videoElement.srcObject = stream

//       // Add event listeners
//       videoElement.addEventListener("loadedmetadata", handleLoadedMetadata)
//       videoElement.addEventListener("error", handleError)
//       videoElement.addEventListener("loadstart", handleLoadStart)
//       videoElement.addEventListener("canplay", handleCanPlay)

//       // Force play for local video (muted)
//       if (isLocal) {
//         videoElement.muted = true
//         videoElement.play().catch((error) => {
//           console.warn("Autoplay failed for local video:", error)
//         })
//       } else {
//         // For remote videos, try to play
//         videoElement.play().catch((error) => {
//           console.warn("Autoplay failed for remote video:", error)
//         })
//       }
//     } catch (error) {
//       console.error("Error setting up video for", name, ":", error)
//       setVideoError("Failed to setup video")
//     }

//     return () => {
//       if (videoElement) {
//         videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata)
//         videoElement.removeEventListener("error", handleError)
//         videoElement.removeEventListener("loadstart", handleLoadStart)
//         videoElement.removeEventListener("canplay", handleCanPlay)
//       }
//     }
//   }, [stream, name, isLocal])

//   const handlePiP = () => {
//     if (videoRef.current) {
//       requestPictureInPicture(videoRef.current)
//     }
//   }

//   return (
//     <motion.div
//       className={`relative group ${
//         isExpanded ? "w-full h-[75vh]" : "w-full max-w-sm h-64"
//       } transition-all duration-500 ${className}`}
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.9 }}
//       transition={{ duration: 0.3 }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       whileHover={{ y: -8, scale: 1.02 }}
//     >
//       <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted={isLocal}
//           className={`object-cover w-full h-full transition-all duration-300 ${
//             isLocal
//               ? "border-4 border-green-400/60 shadow-green-400/30"
//               : "border-4 border-purple-400/60 shadow-purple-400/30"
//           } ${!isVideoLoaded ? "bg-gradient-to-br from-gray-800 to-gray-900" : ""} shadow-2xl`}
//         />

//         {/* Enhanced Loading placeholder */}
//         {(!isVideoLoaded || videoError) && (
//           <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl">
//             <div className="text-white text-center">
//               {videoError ? (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                   <div className="text-6xl mb-4">⚠️</div>
//                   <p className="text-lg font-bold mb-2">Video Error</p>
//                   <p className="text-sm text-gray-400">{videoError}</p>
//                   <button
//                     onClick={() => window.location.reload()}
//                     className="mt-4 px-4 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-700 transition-colors"
//                   >
//                     Refresh Page
//                   </button>
//                 </motion.div>
//               ) : (
//                 <>
//                   <motion.div
//                     className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
//                   />
//                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
//                     <p className="text-lg font-bold mb-2">Loading video...</p>
//                     <p className="text-sm text-gray-400">Connecting to {name}</p>
//                     <div className="flex justify-center space-x-1 mt-3">
//                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
//                       <div
//                         className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
//                         style={{ animationDelay: "0.1s" }}
//                       ></div>
//                       <div
//                         className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
//                         style={{ animationDelay: "0.2s" }}
//                       ></div>
//                     </div>
//                   </motion.div>
//                 </>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Enhanced Emoji reaction overlay */}
//         {emoji && (
//           <motion.div
//             className="absolute top-6 left-6 text-5xl pointer-events-none filter drop-shadow-2xl z-10"
//             initial={{ opacity: 0, y: 30, scale: 0.3, rotate: -180 }}
//             animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
//             exit={{ opacity: 0, y: -30, scale: 0.3, rotate: 180 }}
//             transition={{
//               duration: 0.8,
//               type: "spring",
//               stiffness: 200,
//             }}
//           >
//             <motion.div
//               animate={{
//                 rotate: [0, 15, -15, 10, -10, 0],
//                 scale: [1, 1.2, 1, 1.1, 1],
//               }}
//               transition={{
//                 duration: 1,
//                 repeat: 3,
//               }}
//               className="bg-white/20 backdrop-blur-sm rounded-2xl p-2 border border-white/30"
//             >
//               {emoji}
//             </motion.div>
//           </motion.div>
//         )}

//         {/* Enhanced User name overlay */}
//         <div className="absolute bottom-4 left-4 right-4">
//           <motion.div
//             className={`bg-black/80 backdrop-blur-sm text-white px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${
//               isLocal ? "border-green-400/50 bg-green-900/20" : "border-purple-400/50 bg-purple-900/20"
//             }`}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             whileHover={{ scale: 1.02 }}
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="relative">
//                   <div
//                     className={`w-3 h-3 rounded-full ${
//                       isVideoLoaded ? (isLocal ? "bg-green-400" : "bg-purple-400") : "bg-red-400"
//                     } animate-pulse`}
//                   ></div>
//                   <div
//                     className={`absolute inset-0 w-3 h-3 rounded-full ${
//                       isVideoLoaded ? (isLocal ? "bg-green-400" : "bg-purple-400") : "bg-red-400"
//                     } animate-ping opacity-75`}
//                   ></div>
//                 </div>
//                 <span className="text-sm font-bold">{name}</span>
//               </div>
//               {isLocal && (
//                 <span className="text-xs bg-green-500/30 text-green-300 px-3 py-1 rounded-full border border-green-400/30">
//                   You
//                 </span>
//               )}
//             </div>
//           </motion.div>
//         </div>

//         {/* Enhanced Control buttons */}
//         <motion.div
//           className="absolute top-4 right-4 flex gap-2"
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
//           transition={{ duration: 0.2 }}
//         >
//           <motion.button
//             onClick={onToggleExpand}
//             className="bg-black/80 backdrop-blur-sm text-white p-3 rounded-2xl hover:bg-black/90 transition-all shadow-xl border border-white/20 hover:border-white/40"
//             whileHover={{ scale: 1.1, rotate: 10 }}
//             whileTap={{ scale: 0.9 }}
//             title={isExpanded ? "Minimize" : "Expand"}
//           >
//             <span className="text-lg">{isExpanded ? "📉" : "📈"}</span>
//           </motion.button>

//           <motion.button
//             onClick={handlePiP}
//             className="bg-black/80 backdrop-blur-sm text-white p-3 rounded-2xl hover:bg-black/90 transition-all shadow-xl border border-white/20 hover:border-white/40"
//             whileHover={{ scale: 1.1, rotate: -10 }}
//             whileTap={{ scale: 0.9 }}
//             title="Picture in Picture"
//             disabled={!isVideoLoaded}
//           >
//             <span className="text-lg">📺</span>
//           </motion.button>
//         </motion.div>

//         {/* Enhanced Connection quality indicator */}
//         <div className="absolute top-4 left-4">
//           <motion.div
//             className="flex items-center space-x-2 bg-black/70 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
//             transition={{ duration: 0.2 }}
//           >
//             <div className="flex space-x-1">
//               <div
//                 className={`w-2 h-2 rounded-full animate-pulse ${isVideoLoaded ? "bg-green-400" : "bg-red-400"}`}
//               ></div>
//               <div
//                 className={`w-2 h-2 rounded-full animate-pulse ${isVideoLoaded ? "bg-green-400" : "bg-red-400"}`}
//                 style={{ animationDelay: "0.2s" }}
//               ></div>
//               <div
//                 className={`w-2 h-2 rounded-full animate-pulse ${isVideoLoaded ? "bg-green-400" : "bg-red-400"}`}
//                 style={{ animationDelay: "0.4s" }}
//               ></div>
//             </div>
//             <span className="text-xs text-white font-bold">{isVideoLoaded ? "HD" : "Loading"}</span>
//           </motion.div>
//         </div>

//         {/* Enhanced Gradient overlay for better text readability */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none rounded-3xl"></div>

//         {/* Subtle border glow effect */}
//         <div
//           className={`absolute inset-0 rounded-3xl pointer-events-none ${
//             isLocal ? "shadow-[0_0_30px_rgba(34,197,94,0.3)]" : "shadow-[0_0_30px_rgba(168,85,247,0.3)]"
//           }`}
//         ></div>
//       </div>
//     </motion.div>
//   )
// }

// export default VideoPlayer



"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { requestPictureInPicture } from "../../utils/helpers"

const VideoPlayer = ({
  stream,
  name = "Guest",
  isLocal = false,
  emoji = null,
  onToggleExpand = () => {},
  isExpanded = false,
  className = "",
  // WebRTC props
  socket = null,
  peerId = null,
  roomId = null,
  onConnectionStateChange = () => {},
}) => {
  const videoRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [videoError, setVideoError] = useState(null)
  const [connectionState, setConnectionState] = useState('new')
  const [iceCandidates, setIceCandidates] = useState([])

  // WebRTC Configuration
  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
    ],
    iceCandidatePoolSize: 10,
  }

  // Initialize WebRTC Peer Connection
  useEffect(() => {
    if (!socket || !peerId || isLocal) return

    const initializePeerConnection = async () => {
      try {
        console.log(`Initializing peer connection for ${name} (${peerId})`)
        
        // Create peer connection
        peerConnectionRef.current = new RTCPeerConnection(rtcConfig)
        const pc = peerConnectionRef.current

        // Connection state monitoring
        pc.onconnectionstatechange = () => {
          console.log(`Connection state for ${name}:`, pc.connectionState)
          setConnectionState(pc.connectionState)
          onConnectionStateChange(pc.connectionState)
        }

        pc.oniceconnectionstatechange = () => {
          console.log(`ICE connection state for ${name}:`, pc.iceConnectionState)
        }

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            console.log(`Sending ICE candidate for ${name}`)
            socket.emit('ice-candidate', {
              candidate: event.candidate,
              targetPeerId: peerId,
              roomId: roomId
            })
          }
        }

        // Handle remote stream
        pc.ontrack = (event) => {
          console.log(`Received remote stream for ${name}`)
          const [remoteStream] = event.streams
          if (videoRef.current) {
            videoRef.current.srcObject = remoteStream
          }
        }

        // Handle negotiation needed
        pc.onnegotiationneeded = async () => {
          console.log(`Negotiation needed for ${name}`)
          try {
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)
            socket.emit('offer', {
              offer: offer,
              targetPeerId: peerId,
              roomId: roomId
            })
          } catch (error) {
            console.error('Error during negotiation:', error)
          }
        }

        // Add local stream if available
        if (stream) {
          stream.getTracks().forEach(track => {
            pc.addTrack(track, stream)
          })
        }

      } catch (error) {
        console.error(`Error initializing peer connection for ${name}:`, error)
        setVideoError('Failed to initialize connection')
      }
    }

    initializePeerConnection()

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
    }
  }, [socket, peerId, roomId, stream, name, isLocal, onConnectionStateChange])

  // Socket event handlers
  useEffect(() => {
    if (!socket || !peerConnectionRef.current) return

    const pc = peerConnectionRef.current

    // Handle incoming offers
    const handleOffer = async (data) => {
      if (data.targetPeerId === peerId) {
        try {
          console.log(`Received offer for ${name}`)
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer))
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          socket.emit('answer', {
            answer: answer,
            targetPeerId: data.fromPeerId,
            roomId: roomId
          })
        } catch (error) {
          console.error('Error handling offer:', error)
        }
      }
    }

    // Handle incoming answers
    const handleAnswer = async (data) => {
      if (data.targetPeerId === peerId) {
        try {
          console.log(`Received answer for ${name}`)
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer))
        } catch (error) {
          console.error('Error handling answer:', error)
        }
      }
    }

    // Handle incoming ICE candidates
    const handleIceCandidate = async (data) => {
      if (data.targetPeerId === peerId) {
        try {
          console.log(`Received ICE candidate for ${name}`)
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
        } catch (error) {
          console.error('Error handling ICE candidate:', error)
        }
      }
    }

    // Handle peer disconnection
    const handlePeerDisconnected = (disconnectedPeerId) => {
      if (disconnectedPeerId === peerId) {
        console.log(`Peer ${name} disconnected`)
        setConnectionState('disconnected')
        if (pc) {
          pc.close()
        }
      }
    }

    // Register socket event listeners
    socket.on('offer', handleOffer)
    socket.on('answer', handleAnswer)
    socket.on('ice-candidate', handleIceCandidate)
    socket.on('peer-disconnected', handlePeerDisconnected)

    return () => {
      socket.off('offer', handleOffer)
      socket.off('answer', handleAnswer)
      socket.off('ice-candidate', handleIceCandidate)
      socket.off('peer-disconnected', handlePeerDisconnected)
    }
  }, [socket, peerId, roomId, name])

  // Video setup effect
  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const handleLoadedMetadata = () => {
      console.log("Video metadata loaded for:", name)
      setIsVideoLoaded(true)
      setVideoError(null)
    }

    const handleError = (error) => {
      console.error("Video error for", name, ":", error)
      setVideoError("Failed to load video")
      setIsVideoLoaded(false)
    }

    const handleLoadStart = () => {
      console.log("Video load started for:", name)
      setIsVideoLoaded(false)
    }

    const handleCanPlay = () => {
      console.log("Video can play for:", name)
      setIsVideoLoaded(true)
    }

    try {
      // Set the stream only if it's local or if we don't have WebRTC
      if (isLocal && stream) {
        videoElement.srcObject = stream
      }

      // Add event listeners
      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata)
      videoElement.addEventListener("error", handleError)
      videoElement.addEventListener("loadstart", handleLoadStart)
      videoElement.addEventListener("canplay", handleCanPlay)

      // Force play for local video (muted)
      if (isLocal) {
        videoElement.muted = true
        videoElement.play().catch((error) => {
          console.warn("Autoplay failed for local video:", error)
        })
      } else {
        // For remote videos, try to play
        videoElement.play().catch((error) => {
          console.warn("Autoplay failed for remote video:", error)
        })
      }
    } catch (error) {
      console.error("Error setting up video for", name, ":", error)
      setVideoError("Failed to setup video")
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata)
        videoElement.removeEventListener("error", handleError)
        videoElement.removeEventListener("loadstart", handleLoadStart)
        videoElement.removeEventListener("canplay", handleCanPlay)
      }
    }
  }, [stream, name, isLocal])

  const handlePiP = () => {
    if (videoRef.current) {
      requestPictureInPicture(videoRef.current)
    }
  }

  const getConnectionStatusColor = () => {
    switch (connectionState) {
      case 'connected':
        return 'bg-green-400'
      case 'connecting':
        return 'bg-yellow-400'
      case 'disconnected':
      case 'failed':
        return 'bg-red-400'
      default:
        return 'bg-gray-400'
    }
  }

  const getConnectionStatusText = () => {
    switch (connectionState) {
      case 'connected':
        return 'Connected'
      case 'connecting':
        return 'Connecting'
      case 'disconnected':
        return 'Disconnected'
      case 'failed':
        return 'Failed'
      default:
        return 'Initializing'
    }
  }

  return (
    <motion.div
      className={`relative group ${
        isExpanded ? "w-full h-[75vh]" : "w-full max-w-sm h-64"
      } transition-all duration-500 ${className}`}
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
        {(!isVideoLoaded || videoError) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl">
            <div className="text-white text-center">
              {videoError ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="text-6xl mb-4">⚠️</div>
                  <p className="text-lg font-bold mb-2">Video Error</p>
                  <p className="text-sm text-gray-400">{videoError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Refresh Page
                  </button>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <p className="text-lg font-bold mb-2">
                      {isLocal ? "Loading video..." : "Establishing connection..."}
                    </p>
                    <p className="text-sm text-gray-400">
                      {isLocal ? `Connecting to ${name}` : `Connecting to ${name} via WebRTC`}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Status: {getConnectionStatusText()}
                    </p>
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
                </>
              )}
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
                    className={`w-3 h-3 rounded-full ${
                      isVideoLoaded ? (isLocal ? "bg-green-400" : "bg-purple-400") : "bg-red-400"
                    } animate-pulse`}
                  ></div>
                  <div
                    className={`absolute inset-0 w-3 h-3 rounded-full ${
                      isVideoLoaded ? (isLocal ? "bg-green-400" : "bg-purple-400") : "bg-red-400"
                    } animate-ping opacity-75`}
                  ></div>
                </div>
                <span className="text-sm font-bold">{name}</span>
                {!isLocal && (
                  <span className={`text-xs px-2 py-1 rounded-full ${getConnectionStatusColor()} text-white`}>
                    {getConnectionStatusText()}
                  </span>
                )}
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
            disabled={!isVideoLoaded}
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
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  connectionState === 'connected' ? "bg-green-400" : 
                  connectionState === 'connecting' ? "bg-yellow-400" : "bg-red-400"
                }`}
              ></div>
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  connectionState === 'connected' ? "bg-green-400" : 
                  connectionState === 'connecting' ? "bg-yellow-400" : "bg-red-400"
                }`}
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  connectionState === 'connected' ? "bg-green-400" : 
                  connectionState === 'connecting' ? "bg-yellow-400" : "bg-red-400"
                }`}
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <span className="text-xs text-white font-bold">
              {connectionState === 'connected' ? "HD" : getConnectionStatusText()}
            </span>
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