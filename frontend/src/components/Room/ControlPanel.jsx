// "use client"
// import { motion } from "framer-motion"
// import { useNavigate } from "react-router-dom"

// const ControlPanel = ({
//   micOn,
//   cameraOn,
//   screenSharing,
//   onToggleMic,
//   onToggleCamera,
//   onToggleScreenShare,
//   onToggleWhiteboard,
//   showWhiteboard,
// }) => {
//   const navigate = useNavigate()

//   const handleLeaveRoom = () => {
//     if (window.confirm("Are you sure you want to leave the room?")) {
//       navigate("/")
//     }
//   }

//   const controls = [
//     {
//       id: "mic",
//       label: micOn ? "Mute Mic" : "Unmute Mic",
//       icon: micOn ? "🎤" : "🔇",
//       onClick: onToggleMic,
//       active: micOn,
//       activeColor: "bg-green-600 hover:bg-green-700",
//       inactiveColor: "bg-red-600 hover:bg-red-700",
//     },
//     {
//       id: "camera",
//       label: cameraOn ? "Turn Off Camera" : "Turn On Camera",
//       icon: cameraOn ? "📹" : "📷",
//       onClick: onToggleCamera,
//       active: cameraOn,
//       activeColor: "bg-green-600 hover:bg-green-700",
//       inactiveColor: "bg-red-600 hover:bg-red-700",
//     },
//     {
//       id: "screen",
//       label: screenSharing ? "Stop Sharing" : "Share Screen",
//       icon: screenSharing ? "🛑" : "🖥️",
//       onClick: onToggleScreenShare,
//       active: screenSharing,
//       activeColor: "bg-yellow-500 hover:bg-yellow-600",
//       inactiveColor: "bg-indigo-600 hover:bg-indigo-700",
//     },
//     {
//       id: "whiteboard",
//       label: showWhiteboard ? "Hide Whiteboard" : "Show Whiteboard",
//       icon: showWhiteboard ? "📋" : "🎨",
//       onClick: onToggleWhiteboard,
//       active: showWhiteboard,
//       activeColor: "bg-purple-600 hover:bg-purple-700",
//       inactiveColor: "bg-gray-600 hover:bg-gray-700",
//     },
//   ]

//   return (
//     <motion.div
//       className="flex flex-wrap justify-center gap-3 mb-6"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3, delay: 0.2 }}
//     >
//       {controls.map((control, index) => (
//         <motion.button
//           key={control.id}
//           onClick={control.onClick}
//           className={`px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 flex items-center gap-2 ${
//             control.active ? control.activeColor : control.inactiveColor
//           }`}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.2, delay: index * 0.1 }}
//         >
//           <span className="text-lg">{control.icon}</span>
//           <span className="hidden sm:inline">{control.label}</span>
//         </motion.button>
//       ))}

//       {/* Leave Room Button */}
//       <motion.button
//         onClick={handleLeaveRoom}
//         className="px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200 flex items-center gap-2"
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.2, delay: 0.4 }}
//       >
//         <span className="text-lg">🚪</span>
//         <span className="hidden sm:inline">Leave Room</span>
//       </motion.button>
//     </motion.div>
//   )
// }

// export default ControlPanel



// "use client"

// import { motion } from "framer-motion"
// import { useNavigate } from "react-router-dom"

// const ControlPanel = ({
//   isCameraOn,
//   isMicOn,
//   isSharingScreen,
//   onToggleCamera,
//   onToggleMic,
//   onToggleScreenShare,
//   onToggleWhiteboard,
//   showWhiteboard,
//   participantCount = 1,
// }) => {
//   const navigate = useNavigate()

//   const handleLeaveRoom = () => {
//     if (window.confirm("Are you sure you want to leave the room?")) {
//       navigate("/")
//     }
//   }

//   const controls = [
//     {
//       id: "mic",
//       label: isMicOn ? "Mute Mic" : "Unmute Mic",
//       icon: isMicOn ? "🎤" : "🔇",
//       onClick: onToggleMic,
//       active: isMicOn,
//       activeColor: "bg-green-600 hover:bg-green-700",
//       inactiveColor: "bg-red-600 hover:bg-red-700",
//       shortLabel: isMicOn ? "Mic On" : "Mic Off",
//     },
//     {
//       id: "camera",
//       label: isCameraOn ? "Turn Off Camera" : "Turn On Camera",
//       icon: isCameraOn ? "📹" : "📷",
//       onClick: onToggleCamera,
//       active: isCameraOn,
//       activeColor: "bg-green-600 hover:bg-green-700",
//       inactiveColor: "bg-red-600 hover:bg-red-700",
//       shortLabel: isCameraOn ? "Cam On" : "Cam Off",
//     },
//     {
//       id: "screen",
//       label: isSharingScreen ? "Stop Sharing" : "Share Screen",
//       icon: isSharingScreen ? "🛑" : "🖥️",
//       onClick: onToggleScreenShare,
//       active: isSharingScreen,
//       activeColor: "bg-red-500 hover:bg-red-600",
//       inactiveColor: "bg-indigo-600 hover:bg-indigo-700",
//       shortLabel: isSharingScreen ? "Stop Share" : "Share",
//     },
//     {
//       id: "whiteboard",
//       label: showWhiteboard ? "Hide Whiteboard" : "Show Whiteboard",
//       icon: showWhiteboard ? "📋" : "🎨",
//       onClick: onToggleWhiteboard,
//       active: showWhiteboard,
//       activeColor: "bg-purple-600 hover:bg-purple-700",
//       inactiveColor: "bg-gray-600 hover:bg-gray-700",
//       shortLabel: showWhiteboard ? "Hide Board" : "Whiteboard",
//     },
//   ]

//   return (
//     <motion.div
//       className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-gray-700/50"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3, delay: 0.2 }}
//     >
//       {/* Participant count */}
//       <div className="flex justify-center mb-4">
//         <div className="bg-blue-600/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
//           <span>👥</span>
//           <span>
//             {participantCount} participant{participantCount !== 1 ? "s" : ""}
//           </span>
//         </div>
//       </div>

//       {/* Control buttons */}
//       <div className="flex flex-wrap justify-center gap-3">
//         {controls.map((control, index) => (
//           <motion.button
//             key={control.id}
//             onClick={control.onClick}
//             className={`px-4 py-3 rounded-xl font-medium text-white transition-all duration-200 flex items-center gap-2 min-w-[120px] justify-center ${
//               control.active ? control.activeColor : control.inactiveColor
//             } shadow-lg hover:shadow-xl`}
//             whileHover={{ scale: 1.05, y: -2 }}
//             whileTap={{ scale: 0.95 }}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.2, delay: index * 0.1 }}
//           >
//             <span className="text-lg">{control.icon}</span>
//             <span className="hidden sm:inline text-sm">{control.shortLabel}</span>
//             <span className="sm:hidden text-xs">{control.shortLabel}</span>
//           </motion.button>
//         ))}

//         {/* Leave Room Button */}
//         <motion.button
//           onClick={handleLeaveRoom}
//           className="px-4 py-3 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200 flex items-center gap-2 min-w-[120px] justify-center shadow-lg hover:shadow-xl"
//           whileHover={{ scale: 1.05, y: -2 }}
//           whileTap={{ scale: 0.95 }}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.2, delay: 0.4 }}
//         >
//           <span className="text-lg">🚪</span>
//           <span className="hidden sm:inline text-sm">Leave</span>
//           <span className="sm:hidden text-xs">Leave</span>
//         </motion.button>
//       </div>

//       {/* Status indicators */}
//       <div className="flex justify-center mt-4 space-x-4 text-xs text-gray-400">
//         <div className="flex items-center space-x-1">
//           <div className={`w-2 h-2 rounded-full ${isMicOn ? "bg-green-500" : "bg-red-500"}`}></div>
//           <span>Audio</span>
//         </div>
//         <div className="flex items-center space-x-1">
//           <div className={`w-2 h-2 rounded-full ${isCameraOn ? "bg-green-500" : "bg-red-500"}`}></div>
//           <span>Video</span>
//         </div>
//         {isSharingScreen && (
//           <div className="flex items-center space-x-1">
//             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
//             <span>Sharing</span>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   )
// }

// export default ControlPanel



"use client"

import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const ControlPanel = ({
  isCameraOn,
  isMicOn,
  isSharingScreen,
  onToggleCamera,
  onToggleMic,
  onToggleScreenShare,
  onToggleWhiteboard,
  showWhiteboard,
  participantCount = 1,
}) => {
  const navigate = useNavigate()

  const handleLeaveRoom = () => {
    if (window.confirm("Are you sure you want to leave the room?")) {
      navigate("/")
    }
  }

  const controls = [
    {
      id: "mic",
      label: isMicOn ? "Mute Mic" : "Unmute Mic",
      icon: isMicOn ? "🎤" : "🔇",
      onClick: onToggleMic,
      active: isMicOn,
      activeColor: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
      inactiveColor: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
      shortLabel: isMicOn ? "Mic On" : "Mic Off",
    },
    {
      id: "camera",
      label: isCameraOn ? "Turn Off Camera" : "Turn On Camera",
      icon: isCameraOn ? "📹" : "📷",
      onClick: onToggleCamera,
      active: isCameraOn,
      activeColor: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
      inactiveColor: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
      shortLabel: isCameraOn ? "Cam On" : "Cam Off",
    },
    {
      id: "screen",
      label: isSharingScreen ? "Stop Sharing" : "Share Screen",
      icon: isSharingScreen ? "🛑" : "🖥️",
      onClick: onToggleScreenShare,
      active: isSharingScreen,
      activeColor: "from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600",
      inactiveColor: "from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600",
      shortLabel: isSharingScreen ? "Stop Share" : "Share",
    },
    {
      id: "whiteboard",
      label: showWhiteboard ? "Hide Whiteboard" : "Show Whiteboard",
      icon: showWhiteboard ? "📋" : "🎨",
      onClick: onToggleWhiteboard,
      active: showWhiteboard,
      activeColor: "from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
      inactiveColor: "from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
      shortLabel: showWhiteboard ? "Hide Board" : "Whiteboard",
    },
  ]

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-gray-700/50 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {/* Enhanced Participant count */}
      <div className="flex justify-center mb-6">
        <motion.div
          className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-blue-300 px-8 py-4 rounded-3xl text-sm font-bold flex items-center space-x-4 border border-blue-500/40 backdrop-blur-sm shadow-lg"
          whileHover={{ scale: 1.05, y: -2 }}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-lg">👥</span>
          </div>
          <span className="text-lg">
            {participantCount} participant{participantCount !== 1 ? "s" : ""} connected
          </span>
        </motion.div>
      </div>

      {/* Enhanced Control buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {controls.map((control, index) => (
          <motion.button
            key={control.id}
            onClick={control.onClick}
            className={`px-6 py-4 rounded-2xl font-bold text-white transition-all duration-300 flex items-center gap-3 min-w-[150px] justify-center bg-gradient-to-r ${
              control.active ? control.activeColor : control.inactiveColor
            } shadow-lg hover:shadow-2xl border border-white/20`}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
          >
            <span className="text-2xl">{control.icon}</span>
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold">{control.shortLabel}</span>
              <span className="text-xs opacity-80">{control.active ? "Active" : "Inactive"}</span>
            </div>
          </motion.button>
        ))}

        {/* Enhanced Leave Room Button */}
        <motion.button
          onClick={handleLeaveRoom}
          className="px-6 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-3 min-w-[150px] justify-center shadow-lg hover:shadow-2xl border border-white/20"
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.4 }}
        >
          <span className="text-2xl">🚪</span>
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold">Leave</span>
            <span className="text-xs opacity-80">Exit Room</span>
          </div>
        </motion.button>
      </div>

      {/* Enhanced Status indicators */}
      <div className="flex justify-center space-x-6 text-sm">
        <motion.div
          className="flex items-center space-x-3 bg-gray-700/60 rounded-2xl px-4 py-3 backdrop-blur-sm border border-gray-600/30"
          whileHover={{ scale: 1.05 }}
        >
          <div
            className={`w-3 h-3 rounded-full ${isMicOn ? "bg-green-400" : "bg-red-400"} animate-pulse shadow-lg`}
          ></div>
          <span className="text-gray-300 font-bold">Audio</span>
        </motion.div>
        <motion.div
          className="flex items-center space-x-3 bg-gray-700/60 rounded-2xl px-4 py-3 backdrop-blur-sm border border-gray-600/30"
          whileHover={{ scale: 1.05 }}
        >
          <div
            className={`w-3 h-3 rounded-full ${isCameraOn ? "bg-green-400" : "bg-red-400"} animate-pulse shadow-lg`}
          ></div>
          <span className="text-gray-300 font-bold">Video</span>
        </motion.div>
        {isSharingScreen && (
          <motion.div
            className="flex items-center space-x-3 bg-blue-500/30 rounded-2xl px-4 py-3 border border-blue-500/40 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse shadow-lg"></div>
            <span className="text-blue-300 font-bold">Sharing</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default ControlPanel
