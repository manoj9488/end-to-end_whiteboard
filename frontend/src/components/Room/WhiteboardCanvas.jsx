"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const WhiteboardCanvas = ({ socket, onClose, isExpanded = false, onToggleExpand }) => {
  const canvasRef = useRef()
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState("pen")
  const [currentColor, setCurrentColor] = useState("#ffffff")
  const [currentSize, setCurrentSize] = useState(3)
  const [showToolTip, setShowToolTip] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Set drawing styles
    context.lineCap = "round"
    context.lineJoin = "round"
    context.strokeStyle = currentColor
    context.lineWidth = currentSize

    // Socket listeners for collaborative drawing
    if (socket) {
      socket.on("drawing", (data) => {
        drawOnCanvas(data)
      })

      socket.on("clear-board", () => {
        clearCanvas()
      })
    }

    return () => {
      if (socket) {
        socket.off("drawing")
        socket.off("clear-board")
      }
    }
  }, [socket, currentColor, currentSize])

  const drawOnCanvas = (data) => {
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    context.strokeStyle = data.color
    context.lineWidth = data.size

    if (data.type === "start") {
      context.beginPath()
      context.moveTo(data.x, data.y)
    } else if (data.type === "draw") {
      context.lineTo(data.x, data.y)
      context.stroke()
    }
  }

  const startDrawing = (e) => {
    setIsDrawing(true)
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const context = canvasRef.current.getContext("2d")
    context.strokeStyle = currentColor
    context.lineWidth = currentSize
    context.beginPath()
    context.moveTo(x, y)

    // Emit drawing start to other users
    if (socket) {
      socket.emit("drawing", {
        type: "start",
        x,
        y,
        color: currentColor,
        size: currentSize,
      })
    }
  }

  const draw = (e) => {
    if (!isDrawing) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const context = canvasRef.current.getContext("2d")
    context.lineTo(x, y)
    context.stroke()

    // Emit drawing data to other users
    if (socket) {
      socket.emit("drawing", {
        type: "draw",
        x,
        y,
        color: currentColor,
        size: currentSize,
      })
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  const handleClearBoard = () => {
    if (window.confirm("Are you sure you want to clear the entire whiteboard?")) {
      clearCanvas()
      if (socket) {
        socket.emit("clear-board")
      }
    }
  }

  const tools = [
    { id: "pen", name: "Pen", icon: "✏️", description: "Draw with pen" },
    { id: "eraser", name: "Eraser", icon: "🧽", description: "Erase drawings" },
  ]

  const colors = [
    { hex: "#ffffff", name: "White" },
    { hex: "#000000", name: "Black" },
    { hex: "#ff4757", name: "Red" },
    { hex: "#2ed573", name: "Green" },
    { hex: "#3742fa", name: "Blue" },
    { hex: "#ffa502", name: "Orange" },
    { hex: "#ff6b9d", name: "Pink" },
    { hex: "#1e90ff", name: "Sky Blue" },
    { hex: "#9c88ff", name: "Purple" },
    { hex: "#ffdd59", name: "Yellow" },
  ]

  const sizes = [
    { value: 1, label: "XS" },
    { value: 3, label: "S" },
    { value: 5, label: "M" },
    { value: 8, label: "L" },
    { value: 12, label: "XL" },
  ]

  return (
    <motion.div
      className={`bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl shadow-2xl border border-purple-500/20 backdrop-blur-sm overflow-auto ${
        isExpanded ? "fixed inset-2 z-50 w-auto h-auto max-w-none max-h-none" : "w-full h-auto"
      }`}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.4, type: "spring" }}
    >
      {/* Stunning Header */}
      <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
        <div className="flex items-center space-x-4">
          <motion.div
            className="w-14 h-14 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-2xl">🎨</span>
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Collaborative Whiteboard
            </h3>
            <p className="text-sm text-gray-400 flex items-center space-x-2">
              <span>Draw together in real-time</span>
              <div className="flex space-x-1">
                <div className={`w-2 h-2 rounded-full ${socket ? "bg-green-400" : "bg-red-400"} animate-pulse`}></div>
                <span className="text-xs">{socket ? "Connected" : "Offline"}</span>
              </div>
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={onToggleExpand}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl border border-blue-400/30 flex items-center space-x-2"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{isExpanded ? "📉" : "📈"}</span>
            <span>{isExpanded ? "Minimize" : "Expand"}</span>
          </motion.button>
          <motion.button
            onClick={onClose}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl border border-red-400/30 flex items-center space-x-2"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>✕</span>
            <span>Close</span>
          </motion.button>
        </div>
      </div>

      {/* Enhanced Drawing Tools */}
      <div className={`space-y-6 ${isExpanded ? "p-4" : "p-6"}`}>
        <div
          className={`bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700/50 shadow-inner ${isExpanded ? "p-4" : "p-6"}`}
        >
          {/* Tools Section */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <span>🛠️</span>
              <span>Drawing Tools</span>
            </h4>
            <div className="flex gap-3">
              {tools.map((tool, index) => (
                <motion.button
                  key={tool.id}
                  onClick={() => setCurrentTool(tool.id)}
                  onMouseEnter={() => setShowToolTip(tool.id)}
                  onMouseLeave={() => setShowToolTip(null)}
                  className={`relative px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-200 flex items-center space-x-3 ${
                    currentTool === tool.id
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg border border-purple-400/50"
                      : "bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 border border-slate-600/30"
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-xl">{tool.icon}</span>
                  <span>{tool.name}</span>

                  {/* Tooltip */}
                  <AnimatePresence>
                    {showToolTip === tool.id && (
                      <motion.div
                        className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        {tool.description}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Colors Section */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <span>🎨</span>
              <span>Color Palette</span>
            </h4>
            <div className="flex flex-wrap gap-3">
              {colors.map((color, index) => (
                <motion.button
                  key={color.hex}
                  onClick={() => setCurrentColor(color.hex)}
                  className={`relative w-12 h-12 rounded-2xl border-3 transition-all duration-200 shadow-lg ${
                    currentColor === color.hex
                      ? "border-white scale-110 shadow-2xl ring-4 ring-white/30"
                      : "border-gray-500/50 hover:scale-105 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, type: "spring" }}
                  title={color.name}
                >
                  {currentColor === color.hex && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Size and Actions Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h4 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>📏</span>
                <span>Brush Size</span>
              </h4>
              <div className="flex gap-2">
                {sizes.map((size, index) => (
                  <motion.button
                    key={size.value}
                    onClick={() => setCurrentSize(size.value)}
                    className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                      currentSize === size.value
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                        : "bg-slate-700/50 text-gray-300 hover:bg-slate-600/50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {size.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Clear Button */}
            <motion.button
              onClick={handleClearBoard}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl border border-red-400/30 flex items-center space-x-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>🗑️</span>
              <span>Clear All</span>
            </motion.button>
          </div>
        </div>

        {/* Enhanced Canvas Container */}
        <div className="relative">
          <motion.div
            className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-600/30"
            whileHover={{ scale: isExpanded ? 1.005 : 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <canvas
              ref={canvasRef}
              className="w-full bg-white cursor-crosshair"
              style={{ height: isExpanded ? "calc(100vh - 200px)" : "300px" }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />

            {/* Canvas Overlays */}
            <div className="absolute top-4 right-4 flex space-x-3">
              {/* Connection Status */}
              <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-2xl text-sm border border-white/20 flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${socket ? "bg-green-400" : "bg-red-400"} animate-pulse`}></div>
                <span className="font-medium">{socket ? "Live" : "Offline"}</span>
              </div>

              {/* Current Tool Indicator */}
              <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-2xl text-sm border border-white/20 flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white"
                  style={{ backgroundColor: currentColor }}
                ></div>
                <span className="font-medium">{currentSize}px</span>
              </div>
            </div>

            {/* Drawing Indicator */}
            <AnimatePresence>
              {isDrawing && (
                <motion.div
                  className="absolute top-4 left-4 bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-2xl text-sm font-bold border border-purple-400/50 flex items-center space-x-2"
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -20 }}
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    ✏️
                  </motion.span>
                  <span>Drawing...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gradient Border Effect */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-r from-purple-500/20 via-transparent to-pink-500/20 p-1">
              <div className="w-full h-full rounded-3xl bg-transparent"></div>
            </div>
          </motion.div>

          {/* Canvas Info */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400 flex items-center justify-center space-x-2">
              <span>💡</span>
              <span>Click and drag to draw • Use tools above to customize your drawing</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default WhiteboardCanvas
