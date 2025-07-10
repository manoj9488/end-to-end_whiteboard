"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatTime } from "../../utils/helpers"

const ChatBox = ({ messages, onSendMessage, emojiHistory = [] }) => {
  const [inputMsg, setInputMsg] = useState("")
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (inputMsg.trim()) {
      onSendMessage(inputMsg.trim())
      setInputMsg("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  return (
    <motion.div
      className="w-full lg:w-80 bg-gray-800 rounded-xl p-4 h-[80vh] flex flex-col shadow-lg"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">💬 Chat</h2>
        <div className="text-xs text-gray-400">{messages.length} messages</div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4 border border-gray-700 rounded-lg p-3 bg-gray-900 space-y-2">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              className="text-sm break-words"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start gap-2">
                <span className="text-yellow-300 font-semibold text-xs min-w-0 flex-shrink-0">{msg.sender}:</span>
                <span className="text-white flex-1">{msg.text}</span>
                {msg.timestamp && (
                  <span className="text-gray-500 text-xs flex-shrink-0">{formatTime(msg.timestamp)}</span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Reactions History */}
      {emojiHistory.length > 0 && (
        <motion.div
          className="mb-3 p-2 bg-gray-700 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xs font-semibold text-gray-300 mb-1">Recent Reactions:</h3>
          <div className="flex flex-wrap gap-1">
            {emojiHistory.slice(-10).map((reaction, index) => (
              <motion.span
                key={index}
                className="text-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {reaction.emoji}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Type your message..."
          maxLength={500}
        />
        <motion.button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!inputMsg.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Send
        </motion.button>
      </form>
    </motion.div>
  )
}

export default ChatBox
