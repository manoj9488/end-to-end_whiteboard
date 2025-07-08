


import React, { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const WhiteboardCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen'); // 'pen', 'eraser', 'box'
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);

  const prev = useRef({ x: 0, y: 0 });
  const boxStart = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * 0.94;
      canvas.height = window.innerHeight * 0.5;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    socket.on('drawing', ({ tool, x0, y0, x1, y1, color, lineWidth }) => {
      context.lineWidth = lineWidth || 2;
      if (tool === 'box') {
        context.strokeStyle = color;
        context.strokeRect(x0, y0, x1 - x0, y1 - y0);
      } else {
        drawLine(x0, y0, x1, y1, color, context);
      }
    });

    socket.on('clear-board', () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      socket.off('drawing');
      socket.off('clear-board');
    };
  }, []);

  const getRelativeCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const drawLine = (x0, y0, x1, y1, color, context) => {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.stroke();
    context.closePath();
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { x, y } = getRelativeCoords(e);
    prev.current = { x, y };
    if (tool === 'box') {
      boxStart.current = { x, y };
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const { x, y } = getRelativeCoords(e);
    const ctx = canvasRef.current.getContext('2d');

    if (tool === 'box') {
      const { x: startX, y: startY } = boxStart.current;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(startX, startY, x - startX, y - startY);

      socket.emit('drawing', {
        tool: 'box',
        x0: startX,
        y0: startY,
        x1: x,
        y1: y,
        color,
        lineWidth,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { x, y } = getRelativeCoords(e);
    const ctx = canvasRef.current.getContext('2d');

    if (tool === 'box') {
      const { x: startX, y: startY } = boxStart.current;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      socket.emit('clear-board');
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(startX, startY, x - startX, y - startY);
    } else {
      const drawColor = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = lineWidth;
      drawLine(prev.current.x, prev.current.y, x, y, drawColor, ctx);

      socket.emit('drawing', {
        tool,
        x0: prev.current.x,
        y0: prev.current.y,
        x1: x,
        y1: y,
        color: drawColor,
        lineWidth,
      });

      prev.current = { x, y };
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clear-board');
  };

  return (
    <div className="p-4 w-full">
      <div className="bg-gray-100 p-4 rounded-xl shadow-md mb-4 flex flex-wrap items-center gap-3 justify-start sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTool('pen')}
            className={`px-3 py-1 rounded ${tool === 'pen' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}
          >
            ✏️ Pen
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`px-3 py-1 rounded ${tool === 'eraser' ? 'bg-red-600 text-white' : 'bg-gray-300'}`}
          >
            🧽 Eraser
          </button>
          <button
            onClick={() => setTool('box')}
            className={`px-3 py-1 rounded ${tool === 'box' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
          >
            ⬛ Box
          </button>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <label className="text-sm">🎨</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-6 border rounded"
          />

          <label className="text-sm">🖍️</label>
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-24"
          />

          <button
            onClick={clearCanvas}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      <div className="w-full overflow-auto">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="bg-white border border-gray-300 rounded shadow w-full max-w-full"
        />
      </div>
    </div>
  );
};

export default WhiteboardCanvas;
