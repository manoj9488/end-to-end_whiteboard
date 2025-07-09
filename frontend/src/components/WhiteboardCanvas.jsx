// import React, { useRef, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:5000');

// const WhiteboardCanvas = () => {
//   const navigate = useNavigate();
//   const canvasRef = useRef(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [tool, setTool] = useState('pen');
//   const [color, setColor] = useState('#000000');
//   const [lineWidth, setLineWidth] = useState(2);
//   const [isMinimized, setIsMinimized] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);

//   const prev = useRef({ x: 0, y: 0 });
//   const boxStart = useRef(null);

//   const resizeCanvas = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     if (isFullscreen) {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     } else {
//       canvas.width = window.innerWidth * 0.94;
//       canvas.height = window.innerHeight * 0.5;
//     }
//   };

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');

//     resizeCanvas();
//     window.addEventListener('resize', resizeCanvas);

//     socket.on('drawing', ({ tool, x0, y0, x1, y1, color, lineWidth }) => {
//       context.lineWidth = lineWidth || 2;
//       if (tool === 'box') {
//         context.strokeStyle = color;
//         context.strokeRect(x0, y0, x1 - x0, y1 - y0);
//       } else {
//         drawLine(x0, y0, x1, y1, color, context);
//       }
//     });

//     socket.on('clear-board', () => {
//       context.clearRect(0, 0, canvas.width, canvas.height);
//     });

//     return () => {
//       window.removeEventListener('resize', resizeCanvas);
//       socket.off('drawing');
//       socket.off('clear-board');
//     };
//   }, [isFullscreen]);

//   const getRelativeCoords = (e) => {
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();
//     const scaleX = canvas.width / rect.width;
//     const scaleY = canvas.height / rect.height;
//     return {
//       x: (e.clientX - rect.left) * scaleX,
//       y: (e.clientY - rect.top) * scaleY,
//     };
//   };

//   const drawLine = (x0, y0, x1, y1, color, context) => {
//     context.beginPath();
//     context.moveTo(x0, y0);
//     context.lineTo(x1, y1);
//     context.strokeStyle = color;
//     context.stroke();
//     context.closePath();
//   };

//   const handleMouseDown = (e) => {
//     setIsDrawing(true);
//     const { x, y } = getRelativeCoords(e);
//     prev.current = { x, y };
//     if (tool === 'box') {
//       boxStart.current = { x, y };
//     }
//   };

//   const handleMouseUp = (e) => {
//     if (!isDrawing) return;
//     setIsDrawing(false);
//     const { x, y } = getRelativeCoords(e);
//     const ctx = canvasRef.current.getContext('2d');

//     if (tool === 'box') {
//       const { x: startX, y: startY } = boxStart.current;
//       ctx.strokeStyle = color;
//       ctx.lineWidth = lineWidth;
//       ctx.strokeRect(startX, startY, x - startX, y - startY);

//       socket.emit('drawing', {
//         tool: 'box',
//         x0: startX,
//         y0: startY,
//         x1: x,
//         y1: y,
//         color,
//         lineWidth,
//       });
//     }
//   };

//   const handleMouseMove = (e) => {
//     if (!isDrawing) return;
//     const { x, y } = getRelativeCoords(e);
//     const ctx = canvasRef.current.getContext('2d');

//     if (tool === 'box') {
//       const { x: startX, y: startY } = boxStart.current;
//       ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//       socket.emit('clear-board');
//       ctx.strokeStyle = color;
//       ctx.lineWidth = lineWidth;
//       ctx.strokeRect(startX, startY, x - startX, y - startY);
//     } else {
//       const drawColor = tool === 'eraser' ? '#ffffff' : color;
//       ctx.lineWidth = lineWidth;
//       drawLine(prev.current.x, prev.current.y, x, y, drawColor, ctx);

//       socket.emit('drawing', {
//         tool,
//         x0: prev.current.x,
//         y0: prev.current.y,
//         x1: x,
//         y1: y,
//         color: drawColor,
//         lineWidth,
//       });

//       prev.current = { x, y };
//     }
//   };

//   const clearCanvas = () => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     socket.emit('clear-board');
//   };

//   const toggleFullscreen = () => {
//     setIsFullscreen((prev) => !prev);
//     setTimeout(() => resizeCanvas(), 100);
//   };

//   return (
//     <div className="p-2 max-w-full">
//       <div className="flex flex-wrap gap-2 mb-2">
//         <button
//           onClick={() => setIsMinimized(!isMinimized)}
//           className="px-4 py-1 text-sm rounded bg-indigo-500 hover:bg-indigo-600 text-white transition-all"
//         >
//           {isMinimized ? '📤 Maximize Whiteboard' : '📥 Minimize Whiteboard'}
//         </button>

//         {!isMinimized &&
//           (isFullscreen ? (
//             <div className="flex gap-2">
//               <button
//                 onClick={toggleFullscreen}
//                 className="px-4 py-1 text-sm rounded bg-blue-500 hover:bg-blue-600 text-white transition-all"
//               >
//                 🗕 Exit Fullscreen
//               </button>
//               <button
//                 onClick={() => {
//                   setIsFullscreen(false);
//                   setTimeout(() => navigate(-1), 300); // wait before going back
//                 }}
//                 className="px-4 py-1 text-sm rounded bg-red-500 hover:bg-red-600 text-white transition-all"
//               >
//                 ✖ Exit & Go Back
//               </button>
//             </div>
//           ) : (
//             <button
//               onClick={toggleFullscreen}
//               className="px-4 py-1 text-sm rounded bg-blue-500 hover:bg-blue-600 text-white transition-all"
//             >
//               🗖 Fullscreen
//             </button>
//           ))}
//       </div>

//       {!isMinimized && (
//         <div className="p-2 w-full">
//           {!isFullscreen && (
//             <div className="bg-gray-100 p-4 rounded-xl shadow-md mb-4 flex flex-col sm:flex-row gap-3 sm:justify-between">
//               <div className="flex flex-wrap gap-2">
//                 {['pen', 'eraser', 'box'].map((t) => (
//                   <button
//                     key={t}
//                     onClick={() => setTool(t)}
//                     className={`px-3 py-1 rounded ${
//                       tool === t ? 'bg-green-600 text-white' : 'bg-gray-300'
//                     }`}
//                   >
//                     {t === 'pen' && '✏️ Pen'}
//                     {t === 'eraser' && '🧽 Eraser'}
//                     {t === 'box' && '⬛ Box'}
//                   </button>
//                 ))}
//               </div>

//               <div className="flex flex-wrap gap-3 items-center">
//                 <label className="text-sm">🎨</label>
//                 <input
//                   type="color"
//                   value={color}
//                   onChange={(e) => setColor(e.target.value)}
//                   className="w-8 h-6 border rounded"
//                 />

//                 <label className="text-sm">🖍️</label>
//                 <input
//                   type="range"
//                   min="1"
//                   max="10"
//                   value={lineWidth}
//                   onChange={(e) => setLineWidth(Number(e.target.value))}
//                   className="w-24"
//                 />

//                 <button
//                   onClick={clearCanvas}
//                   className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"
//                 >
//                   🗑️ Clear
//                 </button>
//               </div>
//             </div>
//           )}

//           <div className="w-full overflow-auto max-h-screen">
//             <canvas
//               ref={canvasRef}
//               onMouseDown={handleMouseDown}
//               onMouseUp={handleMouseUp}
//               onMouseMove={handleMouseMove}
//               className={`bg-white border border-gray-300 rounded shadow ${
//                 isFullscreen ? 'fixed top-0 left-0 z-50' : ''
//               }`}
//               style={{
//                 width: isFullscreen ? '100vw' : '100%',
//                 height: isFullscreen ? '100vh' : 'auto',
//               }}
//             />

//             {isFullscreen && (
//               <div className="fixed top-4 left-4 z-[60] bg-white rounded-lg shadow-lg p-3 w-56 space-y-3 border">
//                 {['pen', 'eraser', 'box'].map((t) => (
//                   <button
//                     key={t}
//                     onClick={() => setTool(t)}
//                     className={`px-3 py-1 w-full rounded text-left ${
//                       tool === t ? 'bg-green-600 text-white' : 'bg-gray-200'
//                     }`}
//                   >
//                     {t === 'pen' && '✏️ Pen'}
//                     {t === 'eraser' && '🧽 Eraser'}
//                     {t === 'box' && '⬛ Box'}
//                   </button>
//                 ))}

//                 <div className="flex items-center gap-2">
//                   <span>🎨</span>
//                   <input
//                     type="color"
//                     value={color}
//                     onChange={(e) => setColor(e.target.value)}
//                     className="w-10 h-6 border rounded"
//                   />
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <span>🖍️</span>
//                   <input
//                     type="range"
//                     min="1"
//                     max="10"
//                     value={lineWidth}
//                     onChange={(e) => setLineWidth(Number(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>

//                 <button
//                   onClick={clearCanvas}
//                   className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded w-full"
//                 >
//                   🗑️ Clear
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WhiteboardCanvas;



import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const WhiteboardCanvas = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const prev = useRef({ x: 0, y: 0 });
  const boxStart = useRef(null);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (isFullscreen) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    } else {
      canvas.width = window.innerWidth * 0.94;
      canvas.height = window.innerHeight * 0.5;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
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
  }, [isFullscreen]);

  const getRelativeCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
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

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
    setTimeout(() => resizeCanvas(), 100);
  };

  // New function to go back to previous page
  const goBackToRoom = () => {
    setIsFullscreen(false);
    setTimeout(() => navigate(-1), 300); // Delay to allow transition
  };

  return (
    <div className="p-2 max-w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="px-4 py-1 text-sm rounded bg-indigo-500 hover:bg-indigo-600 text-white transition-all"
        >
          {isMinimized ? '📤 Maximize Whiteboard' : '📥 Minimize Whiteboard'}
        </button>
        {!isMinimized &&
          (isFullscreen ? (
            <div className="flex gap-2">
              {/* Fullscreen Exit Button */}
              <button
                onClick={toggleFullscreen}
                className="px-4 py-1 text-sm rounded bg-blue-500 hover:bg-blue-600 text-white transition-all"
              >
                🗕 Exit Fullscreen
              </button>

              {/* Go Back Button */}
              <button
                onClick={goBackToRoom}
                className="px-4 py-1 text-sm rounded bg-red-500 hover:bg-red-600 text-white transition-all"
              >
                ✖ Exit & Go Back
              </button>
            </div>
          ) : (
            <button
              onClick={toggleFullscreen}
              className="px-4 py-1 text-sm rounded bg-blue-500 hover:bg-blue-600 text-white transition-all"
            >
              🗖 Fullscreen
            </button>
          ))}
      </div>

      {!isMinimized && (
        <div className="p-2 w-full">
          {!isFullscreen && (
            <div className="bg-gray-100 p-4 rounded-xl shadow-md mb-4 flex flex-col sm:flex-row gap-3 sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {['pen', 'eraser', 'box'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTool(t)}
                    className={`px-3 py-1 rounded ${
                      tool === t ? 'bg-green-600 text-white' : 'bg-gray-300'
                    }`}
                  >
                    {t === 'pen' && '✏️ Pen'}
                    {t === 'eraser' && '🧽 Eraser'}
                    {t === 'box' && '⬛ Box'}
                  </button>
                ))}
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
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"
                >
                  🗑️ Clear
                </button>
              </div>
            </div>
          )}
          <div className="w-full overflow-auto max-h-screen">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className={`bg-white border border-gray-300 rounded shadow ${
                isFullscreen ? 'fixed top-0 left-0 z-50' : ''
              }`}
              style={{
                width: isFullscreen ? '100vw' : '100%',
                height: isFullscreen ? '100vh' : 'auto',
              }}
            />
            {isFullscreen && (
              <div className="fixed top-4 left-4 z-[60] bg-white rounded-lg shadow-lg p-3 w-56 space-y-3 border">
                {['pen', 'eraser', 'box'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTool(t)}
                    className={`px-3 py-1 w-full rounded text-left ${
                      tool === t ? 'bg-green-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {t === 'pen' && '✏️ Pen'}
                    {t === 'eraser' && '🧽 Eraser'}
                    {t === 'box' && '⬛ Box'}
                  </button>
                ))}
                <div className="flex items-center gap-2">
                  <span>🎨</span>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-6 border rounded"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span>🖍️</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={lineWidth}
                    onChange={(e) => setLineWidth(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <button
                  onClick={clearCanvas}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded w-full"
                >
                  🗑️ Clear
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WhiteboardCanvas;