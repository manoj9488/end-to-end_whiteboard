


"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatTime } from "../../utils/helpers"

const ChatBox = ({ messages, onSendMessage, emojiHistory = [] }) => {
  const [inputMsg, setInputMsg] = useState("")
  const [isTyping, setIsTyping] = useState(false)
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
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  const handleInputChange = (e) => {
    setInputMsg(e.target.value)
    setIsTyping(e.target.value.length > 0)
  }

  return (
    <motion.div
      className="w-full lg:w-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 h-[85vh] flex flex-col shadow-2xl border border-gray-700/50 backdrop-blur-sm"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Enhanced Chat Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">💬</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Live Chat</h2>
            <p className="text-sm text-gray-400">{messages.length} messages</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400 font-bold">Online</span>
        </div>
      </div>

      {/* Enhanced Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              className="group"
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gray-700/40 backdrop-blur-sm rounded-2xl p-4 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200 hover:bg-gray-700/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-lg">
                    {msg.sender.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-blue-300">{msg.sender}</span>
                      {msg.timestamp && (
                        <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full">
                          {formatTime(msg.timestamp)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white break-words leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Emoji Reactions History */}
      {emojiHistory.length > 0 && (
        <motion.div
          className="mb-4 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 backdrop-blur-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-sm font-bold text-purple-300 mb-3 flex items-center">
            <span className="mr-2">✨</span>
            Recent Reactions
          </h3>
          <div className="flex flex-wrap gap-2">
            {emojiHistory.slice(-8).map((reaction, index) => (
              <motion.div
                key={index}
                className="bg-gray-700/60 rounded-2xl px-3 py-2 flex items-center space-x-2 border border-gray-600/30"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.05, type: "spring" }}
              >
                <span className="text-lg">{reaction.emoji}</span>
                <span className="text-xs text-gray-300 font-medium">{reaction.user}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Enhanced Message Input */}
      <form onSubmit={handleSendMessage} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={inputMsg}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="w-full px-5 py-4 rounded-2xl bg-gray-700/60 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-gray-700/80 transition-all border border-gray-600/40 focus:border-blue-500/50"
            placeholder="Type your message..."
            maxLength={500}
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
            {isTyping && (
              <motion.div
                className="flex space-x-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                <div
                  className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </motion.div>
            )}
            <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full">{inputMsg.length}/500</span>
          </div>
        </div>

        <motion.button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-6 py-4 rounded-2xl text-white font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl border border-blue-400/30"
          disabled={!inputMsg.trim()}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center space-x-3">
            <span>Send Message</span>
            <span className="text-xl"> </span>
          </div>
        </motion.button>
      </form>
    </motion.div>
  )
}

export default ChatBox
