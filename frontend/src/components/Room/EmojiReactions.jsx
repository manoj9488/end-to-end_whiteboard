// "use client"
// import { motion, AnimatePresence } from "framer-motion"
// import { playNotificationSound } from "../../utils/helpers"

// const EmojiReactions = ({ onSendEmoji, activeEmojis = {} }) => {
//   const emojiOptions = ["👍", "😂", "❤️", "🔥", "🎉", "👏", "😮", "🤔"]

//   const handleEmojiClick = (emoji) => {
//     playNotificationSound()
//     onSendEmoji(emoji)
//   }

//   return (
//     <div className="relative">
//       {/* Emoji Selector */}
//       <motion.div
//         className="flex justify-center gap-2 mb-6 flex-wrap"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3, delay: 0.3 }}
//       >
//         {emojiOptions.map((emoji, index) => (
//           <motion.button
//             key={emoji}
//             onClick={() => handleEmojiClick(emoji)}
//             className="text-2xl p-2 rounded-full hover:bg-gray-700 transition-all duration-200 transform hover:scale-110"
//             whileHover={{ scale: 1.2 }}
//             whileTap={{ scale: 0.9 }}
//             initial={{ opacity: 0, scale: 0 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.2, delay: index * 0.05 }}
//           >
//             {emoji}
//           </motion.button>
//         ))}
//       </motion.div>

//       {/* Floating Emoji Animations */}
//       <div className="fixed inset-0 pointer-events-none z-50">
//         <AnimatePresence>
//           {Object.entries(activeEmojis).map(([userId, emojiData]) => (
//             <FloatingEmoji key={`${userId}-${emojiData.time}`} emoji={emojiData.emoji} userId={userId} />
//           ))}
//         </AnimatePresence>
//       </div>
//     </div>
//   )
// }

// const FloatingEmoji = ({ emoji, userId }) => {
//   // Generate random position for floating animation
//   const randomX = Math.random() * (window.innerWidth - 100)
//   const randomRotation = Math.random() * 360

//   return (
//     <motion.div
//       className="absolute text-6xl pointer-events-none"
//       style={{ left: randomX, top: "80%" }}
//       initial={{
//         opacity: 1,
//         y: 0,
//         scale: 0.5,
//         rotate: 0,
//       }}
//       animate={{
//         opacity: 0,
//         y: -200,
//         scale: 1.2,
//         rotate: randomRotation,
//       }}
//       exit={{
//         opacity: 0,
//         scale: 0,
//       }}
//       transition={{
//         duration: 3,
//         ease: "easeOut",
//       }}
//     >
//       {emoji}
//     </motion.div>
//   )
// }

// export default EmojiReactions


"use client"
import { motion, AnimatePresence } from "framer-motion"
import { playNotificationSound } from "../../utils/helpers"

const EmojiReactions = ({ onSendEmoji, activeEmojis = {} }) => {
  const emojiOptions = ["👍", "😂", "❤️", "🔥", "🎉", "👏", "😮", "🤔"]

  const handleEmojiClick = (emoji) => {
    playNotificationSound()
    onSendEmoji(emoji)
  }

  return (
    <div className="relative">
      {/* Enhanced Emoji Selector */}
      <motion.div
        className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-lg">✨</span>
            </div>
            <h3 className="text-xl font-bold text-white">Express Yourself</h3>
          </div>
          <p className="text-sm text-gray-400">Click an emoji to share your reaction with everyone</p>
        </div>

        <div className="flex justify-center gap-3 flex-wrap">
          {emojiOptions.map((emoji, index) => (
            <motion.button
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              className="text-3xl p-4 rounded-2xl bg-gradient-to-br from-gray-700/50 to-gray-800/50 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 shadow-lg hover:shadow-2xl border border-gray-600/30 hover:border-blue-400/50 backdrop-blur-sm"
              whileHover={{
                scale: 1.2,
                rotate: [0, -10, 10, -5, 0],
                transition: { duration: 0.4 },
              }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
              }}
            >
              <motion.span
                animate={{
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: index * 0.2,
                }}
              >
                {emoji}
              </motion.span>
            </motion.button>
          ))}
        </div>

        {/* Enhanced Reaction Counter */}
        <div className="mt-6 text-center">
          <motion.div
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl px-6 py-3 border border-blue-500/30"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
            <span className="text-sm text-gray-300">Active reactions:</span>
            <span className="text-lg font-bold text-blue-400">{Object.keys(activeEmojis).length}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Floating Emoji Animations */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <AnimatePresence>
          {Object.entries(activeEmojis).map(([userId, emojiData]) => (
            <FloatingEmoji key={`${userId}-${emojiData.time}`} emoji={emojiData.emoji} userId={userId} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

const FloatingEmoji = ({ emoji, userId }) => {
  // Generate random position for floating animation
  const randomX = Math.random() * (window.innerWidth - 100)
  const randomRotation = Math.random() * 360
  const randomScale = 0.8 + Math.random() * 0.4

  return (
    <motion.div
      className="absolute text-6xl pointer-events-none filter drop-shadow-2xl"
      style={{ left: randomX, top: "80%" }}
      initial={{
        opacity: 1,
        y: 0,
        scale: 0.3,
        rotate: 0,
      }}
      animate={{
        opacity: 0,
        y: -350,
        scale: randomScale,
        rotate: randomRotation,
      }}
      exit={{
        opacity: 0,
        scale: 0,
      }}
      transition={{
        duration: 4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <motion.div
        animate={{
          rotate: [0, 15, -15, 10, -10, 0],
          scale: [1, 1.1, 1, 1.05, 1],
        }}
        transition={{
          duration: 0.8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        {emoji}
      </motion.div>
    </motion.div>
  )
}

export default EmojiReactions
