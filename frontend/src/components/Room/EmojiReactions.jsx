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
      {/* Emoji Selector */}
      <motion.div
        className="flex justify-center gap-2 mb-6 flex-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        {emojiOptions.map((emoji, index) => (
          <motion.button
            key={emoji}
            onClick={() => handleEmojiClick(emoji)}
            className="text-2xl p-2 rounded-full hover:bg-gray-700 transition-all duration-200 transform hover:scale-110"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            {emoji}
          </motion.button>
        ))}
      </motion.div>

      {/* Floating Emoji Animations */}
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

  return (
    <motion.div
      className="absolute text-6xl pointer-events-none"
      style={{ left: randomX, top: "80%" }}
      initial={{
        opacity: 1,
        y: 0,
        scale: 0.5,
        rotate: 0,
      }}
      animate={{
        opacity: 0,
        y: -200,
        scale: 1.2,
        rotate: randomRotation,
      }}
      exit={{
        opacity: 0,
        scale: 0,
      }}
      transition={{
        duration: 3,
        ease: "easeOut",
      }}
    >
      {emoji}
    </motion.div>
  )
}

export default EmojiReactions
