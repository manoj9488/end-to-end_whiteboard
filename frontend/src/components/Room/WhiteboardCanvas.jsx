"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"

const WhiteboardCanvas = ({ socket, onClose, isExpanded = false, onToggleExpand }) => {
  const canvasRef = useRef()
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState("pen")
  const [currentColor, setCurrentColor] = useState("#ffffff")
  const [currentSize, setCurrentSize] = useState(3)

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
    clearCanvas()
    if (socket) {
      socket.emit("clear-board")
    }
  }

  const tools = [
    { id: "pen", name: "Pen", icon: "✏️" },
    { id: "eraser", name: "Eraser", icon: "🧽" },
  ]

  const colors = ["#ffffff", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#000000"]
  const sizes = [1, 3, 5, 8, 12]

  return (
    <motion.div
      className={`bg-gray-800 rounded-xl p-4 ${isExpanded ? "fixed inset-4 z-50" : "w-full h-96"}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      {/* Whiteboard Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">🎨 Whiteboard</h3>
        <div className="flex gap-2">
          <motion.button
            onClick={onToggleExpand}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? "Minimize" : "Expand"}
          </motion.button>
          <motion.button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Close
          </motion.button>
        </div>
      </div>

      {/* Drawing Tools */}
      <div className="flex flex-wrap items-center gap-4 mb-4 p-3 bg-gray-700 rounded-lg">
        {/* Tool Selection */}
        <div className="flex gap-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setCurrentTool(tool.id)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                currentTool === tool.id ? "bg-blue-600 text-white" : "bg-gray-600 text-gray-300 hover:bg-gray-500"
              }`}
            >
              {tool.icon} {tool.name}
            </button>
          ))}
        </div>

        {/* Color Selection */}
        <div className="flex gap-1">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setCurrentColor(color)}
              className={`w-6 h-6 rounded border-2 transition-all ${
                currentColor === color ? "border-white scale-110" : "border-gray-500"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Size Selection */}
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">Size:</span>
          <select
            value={currentSize}
            onChange={(e) => setCurrentSize(Number(e.target.value))}
            className="bg-gray-600 text-white px-2 py-1 rounded text-sm"
          >
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>

        {/* Clear Button */}
        <motion.button
          onClick={handleClearBoard}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🗑️ Clear
        </motion.button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full bg-white rounded-lg cursor-crosshair"
        style={{ height: isExpanded ? "calc(100vh - 200px)" : "300px" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </motion.div>
  )
}

export default WhiteboardCanvas
