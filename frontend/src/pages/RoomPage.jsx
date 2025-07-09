

// import React, { useEffect, useRef, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import io from 'socket.io-client';
// import Peer from 'simple-peer';
// import WhiteboardCanvas from '../components/WhiteboardCanvas';
// import Navbar from '../components/Navbar';
// import { motion } from 'framer-motion';

// const RoomPage = () => {
//   const { roomId } = useParams();
//   const socketRef = useRef();
//   const myVideo = useRef();
//   const peersRef = useRef([]);
//   const [stream, setStream] = useState(null);
//   const [micOn, setMicOn] = useState(true);
//   const [cameraOn, setCameraOn] = useState(true);
//   const [screenSharing, setScreenSharing] = useState(false);
//   const [showWhiteboard, setShowWhiteboard] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [peers, setPeers] = useState([]);
//   const [expandedVideos, setExpandedVideos] = useState({});
//   const [messages, setMessages] = useState([]);
//   const [inputMsg, setInputMsg] = useState('');
//   const [emojis, setEmojis] = useState({});
//   const [emojiHistory, setEmojiHistory] = useState([]);

//   const myName = localStorage.getItem('username') || 'Me';

//   const toggleWhiteboard = () => setShowWhiteboard(prev => !prev);
//   const toggleExpand = id => setExpandedVideos(prev => ({ ...prev, [id]: !prev[id] }));

//   const toggleMic = () => {
//     if (stream?.getAudioTracks()[0]) {
//       stream.getAudioTracks()[0].enabled = !micOn;
//       setMicOn(!micOn);
//     }
//   };

//   const toggleCamera = () => {
//     if (stream?.getVideoTracks()[0]) {
//       stream.getVideoTracks()[0].enabled = !cameraOn;
//       setCameraOn(!cameraOn);
//     }
//   };

//   const copyRoomId = async () => {
//     try {
//       await navigator.clipboard.writeText(roomId);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1500);
//     } catch (err) {
//       console.error('Copy failed', err);
//     }
//   };

//   const togglePiP = (videoRef) => {
//     if (videoRef && videoRef.requestPictureInPicture) {
//       videoRef.requestPictureInPicture();
//     }
//   };

//   const sendMessage = () => {
//     if (inputMsg.trim()) {
//       const msg = { sender: myName, text: inputMsg };
//       socketRef.current.emit('chat-message', msg);
//       setMessages(prev => [...prev, msg]);
//       setInputMsg('');
//     }
//   };

//   const sendEmoji = (emoji) => {
//     const audio = new Audio('/sounds/pop.mp3');
//     audio.play();

//     socketRef.current.emit('emoji-reaction', { userId: socketRef.current.id, emoji });
//     setEmojis(prev => ({
//       ...prev,
//       me: { emoji, time: Date.now() },
//     }));
//     setEmojiHistory(prev => [...prev, { user: 'Me', emoji }]);

//     setTimeout(() => {
//       setEmojis(prev => {
//         const updated = { ...prev };
//         delete updated.me;
//         return updated;
//       });
//     }, 3000);
//   };

//   const shareScreen = async () => {
//     if (!stream) return;

//     try {
//       const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
//       const screenTrack = screenStream.getVideoTracks()[0];

//       peersRef.current.forEach(({ peer }) => {
//         const sender = peer._pc.getSenders().find(s => s.track && s.track.kind === 'video');
//         if (sender) sender.replaceTrack(screenTrack);
//       });

//       if (myVideo.current) myVideo.current.srcObject = screenStream;

//       setScreenSharing(true);

//       screenTrack.onended = () => {
//         const originalTrack = stream.getVideoTracks()[0];
//         peersRef.current.forEach(({ peer }) => {
//           const sender = peer._pc.getSenders().find(s => s.track && s.track.kind === 'video');
//           if (sender && originalTrack) sender.replaceTrack(originalTrack);
//         });
//         if (myVideo.current) myVideo.current.srcObject = stream;
//         setScreenSharing(false);
//       };
//     } catch (err) {
//       console.error('Error sharing screen:', err);
//     }
//   };

//   useEffect(() => {
//     socketRef.current = io('http://localhost:5000');

//     navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(currentStream => {
//       setStream(currentStream);
//       if (myVideo.current) myVideo.current.srcObject = currentStream;

//       socketRef.current.emit('join-room', {
//         roomId,
//         userId: socketRef.current.id,
//         name: myName,
//       });

//       socketRef.current.on('user-joined', ({ userId, name }) => {
//         const peer = new Peer({
//           initiator: true,
//           trickle: false,
//           stream: currentStream,
//         });

//         peer.on('signal', signal => {
//           socketRef.current.emit('signal', {
//             userToSignal: userId,
//             callerId: socketRef.current.id,
//             signal,
//             name: myName,
//           });
//         });

//         peer.on('stream', remoteStream => {
//           setPeers(prev => [...prev, { peerID: userId, stream: remoteStream, name }]);
//         });

//         peersRef.current.push({ peerID: userId, peer });
//       });

//       socketRef.current.on('user-signal', ({ callerId, signal, name }) => {
//         const peer = new Peer({
//           initiator: false,
//           trickle: false,
//           stream: currentStream,
//         });

//         peer.on('signal', signal => {
//           socketRef.current.emit('return-signal', { signal, callerId });
//         });

//         peer.on('stream', remoteStream => {
//           setPeers(prev => [...prev, { peerID: callerId, stream: remoteStream, name }]);
//         });

//         peer.signal(signal);
//         peersRef.current.push({ peerID: callerId, peer });
//       });

//       socketRef.current.on('received-return-signal', ({ signal, id }) => {
//         const item = peersRef.current.find(p => p.peerID === id);
//         if (item) item.peer.signal(signal);
//       });

//       socketRef.current.on('chat-message', (msg) => {
//         setMessages(prev => [...prev, msg]);
//       });

//       socketRef.current.on('emoji-reaction', ({ userId, emoji }) => {
//         setEmojis(prev => ({
//           ...prev,
//           [userId]: { emoji, time: Date.now() },
//         }));
//         setEmojiHistory(prev => [...prev, { user: userId, emoji }]);

//         setTimeout(() => {
//           setEmojis(prev => {
//             const updated = { ...prev };
//             delete updated[userId];
//             return updated;
//           });
//         }, 3000);
//       });
//     });

//     return () => {
//       if (socketRef.current) socketRef.current.disconnect();
//       if (stream) stream.getTracks().forEach(track => track.stop());
//       peersRef.current.forEach(({ peer }) => peer.destroy());
//     };
//   }, [roomId]);

//   return (
//     <div className="relative min-h-screen bg-gray-900 text-white">
//       <Navbar />
//       <motion.div className="p-4 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
//         <div className="flex-1">
//           <h1 className="text-3xl font-bold mb-4 text-center">Welcome to the Room</h1>

//           <div className="flex justify-center gap-3 mb-6">
//             <p className="bg-gray-800 px-3 py-1 rounded text-sm">
//               Room ID: <span className="text-yellow-400">{roomId}</span>
//             </p>
//             <button onClick={copyRoomId} className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700">
//               Copy
//             </button>
//             {copied && <span className="text-green-400 text-xs">Copied!</span>}
//           </div>

//           <div className="flex flex-wrap justify-center gap-4 mb-4">
//             <div className={`relative ${expandedVideos['me'] ? 'w-full h-[70vh]' : 'w-full max-w-xs h-56'}`}>
//               <video
//                 playsInline
//                 muted
//                 ref={myVideo}
//                 autoPlay
//                 className="object-cover w-full h-full border-4 border-green-500 rounded-xl"
//               />
//               {emojis['me'] && (
//                 <div className="absolute top-1 left-1 text-3xl floating-emoji">{emojis['me'].emoji}</div>
//               )}
//               <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">{myName}</div>
//               <div className="absolute top-1 right-1 flex gap-1">
//                 <button onClick={() => toggleExpand('me')} className="bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
//                   {expandedVideos['me'] ? 'Minimize' : 'Expand'}
//                 </button>
//                 <button onClick={() => togglePiP(myVideo.current)} className="bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
//                   PiP
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-wrap justify-center gap-4 mb-4">
//             {peers.map((peerObj) => (
//               <div key={peerObj.peerID} className={`relative ${expandedVideos[peerObj.peerID] ? 'w-full h-[70vh]' : 'w-full max-w-xs h-56'}`}>
//                 <video
//                   playsInline
//                   autoPlay
//                   ref={(ref) => {
//                     if (ref && peerObj.stream) ref.srcObject = peerObj.stream;
//                   }}
//                   className="object-cover w-full h-full border-4 border-purple-500 rounded-xl"
//                 />
//                 {emojis[peerObj.peerID] && (
//                   <div className="absolute top-1 left-1 text-3xl floating-emoji">{emojis[peerObj.peerID].emoji}</div>
//                 )}
//                 <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">{peerObj.name || 'Guest'}</div>
//                 <div className="absolute top-1 right-1 flex gap-1">
//                   <button onClick={() => toggleExpand(peerObj.peerID)} className="bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
//                     {expandedVideos[peerObj.peerID] ? 'Minimize' : 'Expand'}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="flex flex-wrap justify-center gap-4 mb-4">
//             <motion.button onClick={toggleMic} className={`px-5 py-2 rounded font-medium ${micOn ? 'bg-green-600' : 'bg-red-600'}`}>
//               {micOn ? 'Mute Mic' : 'Unmute Mic'}
//             </motion.button>
//             <motion.button onClick={toggleCamera} className={`px-5 py-2 rounded font-medium ${cameraOn ? 'bg-green-600' : 'bg-red-600'}`}>
//               {cameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
//             </motion.button>
//             <motion.button onClick={shareScreen} className={`px-5 py-2 rounded font-medium ${screenSharing ? 'bg-yellow-500' : 'bg-indigo-600'}`}>
//               {screenSharing ? 'Stop Sharing' : 'Share Screen'}
//             </motion.button>
//             <motion.button onClick={toggleWhiteboard} className="bg-green-500 px-5 py-2 rounded font-medium">
//               {showWhiteboard ? 'Hide Whiteboard' : 'Open Whiteboard'}
//             </motion.button>
//           </div>

//           <div className="flex justify-center gap-2 mb-4">
//             {['👍', '😂', '❤️', '🔥', '🎉'].map((emoji) => (
//               <button key={emoji} onClick={() => sendEmoji(emoji)} className="text-2xl hover:scale-110 transition-transform">
//                 {emoji}
//               </button>
//             ))}
//           </div>

//           {showWhiteboard && (
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//               <WhiteboardCanvas />
//             </motion.div>
//           )}
//         </div>

//         <div className="w-full lg:w-80 bg-gray-800 rounded-xl p-4 h-[80vh] flex flex-col">
//           <h2 className="text-lg font-semibold mb-2 text-center">Chat</h2>
//           <div className="flex-1 overflow-y-auto mb-2 border border-gray-700 rounded p-2 bg-gray-900 space-y-1">
//             {messages.map((msg, i) => (
//               <div key={i} className="text-sm">
//                 <span className="text-yellow-300 font-semibold">{msg.sender}: </span>
//                 <span>{msg.text}</span>
//               </div>
//             ))}
//           </div>

//           <div className="text-xs mt-3">
//             <h3 className="font-semibold">Reactions:</h3>
//             <div className="flex flex-wrap gap-1">
//               {emojiHistory.slice(-10).map((e, i) => (
//                 <span key={i}>{e.emoji}</span>
//               ))}
//             </div>
//           </div>

//           <div className="flex gap-2 mt-2">
//             <input
//               type="text"
//               value={inputMsg}
//               onChange={(e) => setInputMsg(e.target.value)}
//               className="flex-1 px-3 py-1 rounded bg-gray-700 text-white focus:outline-none"
//               placeholder="Type message..."
//             />
//             <button onClick={sendMessage} className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
//               Send
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default RoomPage;


// import React, { useEffect, useRef, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import io from 'socket.io-client';
// import Peer from 'simple-peer';
// import WhiteboardCanvas from '../components/WhiteboardCanvas';
// import Navbar from '../components/Navbar';
// import { motion } from 'framer-motion';

// const RoomPage = () => {
//   const { roomId } = useParams();
//   const socketRef = useRef();
//   const myVideo = useRef();
//   const peersRef = useRef([]);
//   const [stream, setStream] = useState(null);
//   const [micOn, setMicOn] = useState(true);
//   const [cameraOn, setCameraOn] = useState(true);
//   const [screenSharing, setScreenSharing] = useState(false);
//   const [showWhiteboard, setShowWhiteboard] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [peers, setPeers] = useState([]);
//   const [expandedVideos, setExpandedVideos] = useState({});
//   const [messages, setMessages] = useState([]);
//   const [inputMsg, setInputMsg] = useState('');
//   const [emojis, setEmojis] = useState({});
//   const [emojiHistory, setEmojiHistory] = useState([]);

//   const myName = localStorage.getItem('username') || 'Me';

//   const toggleWhiteboard = () => setShowWhiteboard(prev => !prev);
//   const toggleExpand = id => setExpandedVideos(prev => ({ ...prev, [id]: !prev[id] }));

//   const toggleMic = () => {
//     if (stream?.getAudioTracks()[0]) {
//       stream.getAudioTracks()[0].enabled = !micOn;
//       setMicOn(!micOn);
//     }
//   };

//   const toggleCamera = () => {
//     if (stream?.getVideoTracks()[0]) {
//       stream.getVideoTracks()[0].enabled = !cameraOn;
//       setCameraOn(!cameraOn);
//     }
//   };

//   const copyRoomId = async () => {
//     try {
//       await navigator.clipboard.writeText(roomId);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1500);
//     } catch (err) {
//       console.error('Copy failed', err);
//     }
//   };

//   const togglePiP = (videoRef) => {
//     if (videoRef && videoRef.requestPictureInPicture) {
//       videoRef.requestPictureInPicture();
//     }
//   };

//   const sendMessage = () => {
//     if (inputMsg.trim()) {
//       const msg = { sender: myName, text: inputMsg };
//       socketRef.current.emit('chat-message', msg);
//       setMessages(prev => [...prev, msg]);
//       setInputMsg('');
//     }
//   };

//   const sendEmoji = (emoji) => {
//     const audio = new Audio('/sounds/pop.mp3');
//     audio.play();

//     socketRef.current.emit('emoji-reaction', { userId: socketRef.current.id, emoji });
//     setEmojis(prev => ({
//       ...prev,
//       me: { emoji, time: Date.now() },
//     }));
//     setEmojiHistory(prev => [...prev, { user: 'Me', emoji }]);

//     setTimeout(() => {
//       setEmojis(prev => {
//         const updated = { ...prev };
//         delete updated.me;
//         return updated;
//       });
//     }, 3000);
//   };

//   const shareScreen = async () => {
//     if (!stream) return;

//     try {
//       const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
//       const screenTrack = screenStream.getVideoTracks()[0];

//       peersRef.current.forEach(({ peer }) => {
//         const sender = peer._pc.getSenders().find(s => s.track && s.track.kind === 'video');
//         if (sender) sender.replaceTrack(screenTrack);
//       });

//       if (myVideo.current) myVideo.current.srcObject = screenStream;

//       setScreenSharing(true);

//       screenTrack.onended = () => {
//         const originalTrack = stream.getVideoTracks()[0];
//         peersRef.current.forEach(({ peer }) => {
//           const sender = peer._pc.getSenders().find(s => s.track && s.track.kind === 'video');
//           if (sender && originalTrack) sender.replaceTrack(originalTrack);
//         });
//         if (myVideo.current) myVideo.current.srcObject = stream;
//         setScreenSharing(false);
//       };
//     } catch (err) {
//       console.error('Error sharing screen:', err);
//     }
//   };

//   useEffect(() => {
//     socketRef.current = io('http://localhost:5000');

//     navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(currentStream => {
//       setStream(currentStream);
//       if (myVideo.current) myVideo.current.srcObject = currentStream;

//       socketRef.current.emit('join-room', {
//         roomId,
//         userId: socketRef.current.id,
//         name: myName,
//       });

//       socketRef.current.on('user-joined', ({ userId, name }) => {
//         const peer = new Peer({
//           initiator: true,
//           trickle: false,
//           stream: currentStream,
//         });

//         peer.on('signal', signal => {
//           socketRef.current.emit('signal', {
//             userToSignal: userId,
//             callerId: socketRef.current.id,
//             signal,
//             name: myName,
//           });
//         });

//         peer.on('stream', remoteStream => {
//           setPeers(prev => [...prev, { peerID: userId, stream: remoteStream, name }]);
//         });

//         peersRef.current.push({ peerID: userId, peer });
//       });

//       socketRef.current.on('user-signal', ({ callerId, signal, name }) => {
//         const peer = new Peer({
//           initiator: false,
//           trickle: false,
//           stream: currentStream,
//         });

//         peer.on('signal', signal => {
//           socketRef.current.emit('return-signal', { signal, callerId });
//         });

//         peer.on('stream', remoteStream => {
//           setPeers(prev => [...prev, { peerID: callerId, stream: remoteStream, name }]);
//         });

//         peer.signal(signal);
//         peersRef.current.push({ peerID: callerId, peer });
//       });

//       socketRef.current.on('received-return-signal', ({ signal, id }) => {
//         const item = peersRef.current.find(p => p.peerID === id);
//         if (item) item.peer.signal(signal);
//       });

//       socketRef.current.on('chat-message', (msg) => {
//         setMessages(prev => [...prev, msg]);
//       });

//       socketRef.current.on('emoji-reaction', ({ userId, emoji }) => {
//         setEmojis(prev => ({
//           ...prev,
//           [userId]: { emoji, time: Date.now() },
//         }));
//         setEmojiHistory(prev => [...prev, { user: userId, emoji }]);

//         setTimeout(() => {
//           setEmojis(prev => {
//             const updated = { ...prev };
//             delete updated[userId];
//             return updated;
//           });
//         }, 3000);
//       });
//     });

//     return () => {
//       if (socketRef.current) socketRef.current.disconnect();
//       if (stream) stream.getTracks().forEach(track => track.stop());
//       peersRef.current.forEach(({ peer }) => peer.destroy());
//     };
//   }, [roomId]);

//   return (
//     <div className="relative min-h-screen bg-gray-900 text-white">
//       <Navbar />
//       <motion.div className="p-4 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
//         <div className="flex-1">
//           <h1 className="text-3xl font-bold mb-4 text-center">Welcome to the Room</h1>

//           <div className="flex justify-center gap-3 mb-6">
//             <p className="bg-gray-800 px-3 py-1 rounded text-sm">
//               Room ID: <span className="text-yellow-400">{roomId}</span>
//             </p>
//             <button onClick={copyRoomId} className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700">
//               Copy
//             </button>
//             {copied && <span className="text-green-400 text-xs">Copied!</span>}
//           </div>

//           <div className="flex flex-wrap justify-center gap-4 mb-4">
//             <div className={`relative ${expandedVideos['me'] ? 'w-full h-[70vh]' : 'w-full max-w-xs h-56'}`}>
//               <video
//                 playsInline
//                 muted
//                 ref={myVideo}
//                 autoPlay
//                 className="object-cover w-full h-full border-4 border-green-500 rounded-xl"
//               />
//               {emojis['me'] && (
//                 <div className="absolute top-1 left-1 text-3xl floating-emoji">{emojis['me'].emoji}</div>
//               )}
//               <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">{myName}</div>
//               <div className="absolute top-1 right-1 flex gap-1">
//                 <button onClick={() => toggleExpand('me')} className="bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
//                   {expandedVideos['me'] ? 'Minimize' : 'Expand'}
//                 </button>
//                 <button onClick={() => togglePiP(myVideo.current)} className="bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
//                   PiP
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-wrap justify-center gap-4 mb-4">
//             {peers.map((peerObj) => (
//               <div key={peerObj.peerID} className={`relative ${expandedVideos[peerObj.peerID] ? 'w-full h-[70vh]' : 'w-full max-w-xs h-56'}`}>
//                 <video
//                   playsInline
//                   autoPlay
//                   ref={(ref) => {
//                     if (ref && peerObj.stream) ref.srcObject = peerObj.stream;
//                   }}
//                   className="object-cover w-full h-full border-4 border-purple-500 rounded-xl"
//                 />
//                 {emojis[peerObj.peerID] && (
//                   <div className="absolute top-1 left-1 text-3xl floating-emoji">{emojis[peerObj.peerID].emoji}</div>
//                 )}
//                 <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">{peerObj.name || 'Guest'}</div>
//                 <div className="absolute top-1 right-1 flex gap-1">
//                   <button onClick={() => toggleExpand(peerObj.peerID)} className="bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
//                     {expandedVideos[peerObj.peerID] ? 'Minimize' : 'Expand'}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="flex flex-wrap justify-center gap-4 mb-4">
//             <motion.button onClick={toggleMic} className={`px-5 py-2 rounded font-medium ${micOn ? 'bg-green-600' : 'bg-red-600'}`}>
//               {micOn ? 'Mute Mic' : 'Unmute Mic'}
//             </motion.button>
//             <motion.button onClick={toggleCamera} className={`px-5 py-2 rounded font-medium ${cameraOn ? 'bg-green-600' : 'bg-red-600'}`}>
//               {cameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
//             </motion.button>
//             <motion.button onClick={shareScreen} className={`px-5 py-2 rounded font-medium ${screenSharing ? 'bg-yellow-500' : 'bg-indigo-600'}`}>
//               {screenSharing ? 'Stop Sharing' : 'Share Screen'}
//             </motion.button>
//             <motion.button onClick={toggleWhiteboard} className="bg-green-500 px-5 py-2 rounded font-medium">
//               {showWhiteboard ? 'Hide Whiteboard' : 'Open Whiteboard'}
//             </motion.button>
//           </div>

//           <div className="flex justify-center gap-2 mb-4">
//             {['👍', '😂', '❤️', '🔥', '🎉'].map((emoji) => (
//               <button key={emoji} onClick={() => sendEmoji(emoji)} className="text-2xl hover:scale-110 transition-transform">
//                 {emoji}
//               </button>
//             ))}
//           </div>

//           {showWhiteboard && (
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//               <WhiteboardCanvas />
//             </motion.div>
//           )}
//         </div>

//         <div className="w-full lg:w-80 bg-gray-800 rounded-xl p-4 h-[80vh] flex flex-col">
//           <h2 className="text-lg font-semibold mb-2 text-center">Chat</h2>
//           <div className="flex-1 overflow-y-auto mb-2 border border-gray-700 rounded p-2 bg-gray-900 space-y-1">
//             {messages.map((msg, i) => (
//               <div key={i} className="text-sm">
//                 <span className="text-yellow-300 font-semibold">{msg.sender}: </span>
//                 <span>{msg.text}</span>
//               </div>
//             ))}
//           </div>

//           <div className="text-xs mt-3">
//             <h3 className="font-semibold">Reactions:</h3>
//             <div className="flex flex-wrap gap-1">
//               {emojiHistory.slice(-10).map((e, i) => (
//                 <span key={i}>{e.emoji}</span>
//               ))}
//             </div>
//           </div>

//           <div className="flex gap-2 mt-2">
//             <input
//               type="text"
//               value={inputMsg}
//               onChange={(e) => setInputMsg(e.target.value)}
//               className="flex-1 px-3 py-1 rounded bg-gray-700 text-white focus:outline-none"
//               placeholder="Type message..."
//             />
//             <button onClick={sendMessage} className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
//               Send
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default RoomPage;




// src/pages/RoomPage.jsx

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import WhiteboardCanvas from '../components/WhiteboardCanvas';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const RoomPage = () => {
  const { roomId } = useParams();
  const socketRef = useRef();
  const myVideo = useRef();
  const peersRef = useRef([]);
  const [stream, setStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [copied, setCopied] = useState(false);
  const [peers, setPeers] = useState([]);
  const [expandedVideos, setExpandedVideos] = useState({});
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [emojis, setEmojis] = useState({});
  const [emojiHistory, setEmojiHistory] = useState([]);
  const myName = localStorage.getItem('username') || 'Me';

  const toggleWhiteboard = () => setShowWhiteboard((prev) => !prev);
  const toggleExpand = (id) =>
    setExpandedVideos((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleMic = () => {
    if (stream?.getAudioTracks()[0]) {
      stream.getAudioTracks()[0].enabled = !micOn;
      setMicOn(!micOn);
    }
  };

  const toggleCamera = () => {
    if (stream?.getVideoTracks()[0]) {
      stream.getVideoTracks()[0].enabled = !cameraOn;
      setCameraOn(!cameraOn);
    }
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const togglePiP = (videoRef) => {
    if (videoRef && videoRef.requestPictureInPicture) {
      videoRef.requestPictureInPicture();
    }
  };

  const sendMessage = () => {
    if (inputMsg.trim()) {
      const msg = { sender: myName, text: inputMsg };
      socketRef.current.emit('chat-message', msg);
      setMessages((prev) => [...prev, msg]);
      setInputMsg('');
    }
  };

  const sendEmoji = (emoji) => {
    const audio = new Audio('/sounds/pop.mp3');
    audio.play();
    socketRef.current.emit('emoji-reaction', {
      userId: socketRef.current.id,
      emoji,
    });
    setEmojis((prev) => ({
      ...prev,
      me: { emoji, time: Date.now() },
    }));
    setEmojiHistory((prev) => [...prev, { user: 'Me', emoji }]);
    setTimeout(() => {
      setEmojis((prev) => {
        const updated = { ...prev };
        delete updated.me;
        return updated;
      });
    }, 3000);
  };

  const shareScreen = async () => {
    if (!stream) return;
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const screenTrack = screenStream.getVideoTracks()[0];
      peersRef.current.forEach(({ peer }) => {
        const sender = peer._pc.getSenders().find(
          (s) => s.track && s.track.kind === 'video'
        );
        if (sender) sender.replaceTrack(screenTrack);
      });
      if (myVideo.current)
        myVideo.current.srcObject = screenStream;
      setScreenSharing(true);
      screenTrack.onended = () => {
        const originalTrack = stream.getVideoTracks()[0];
        peersRef.current.forEach(({ peer }) => {
          const sender = peer._pc.getSenders().find(
            (s) => s.track && s.track.kind === 'video'
          );
          if (sender && originalTrack)
            sender.replaceTrack(originalTrack);
        });
        if (myVideo.current) myVideo.current.srcObject = stream;
        setScreenSharing(false);
      };
    } catch (err) {
      console.error('Error sharing screen:', err);
    }
  };

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current)
          myVideo.current.srcObject = currentStream;

        socketRef.current.emit('join-room', {
          roomId,
          userId: socketRef.current.id,
          name: myName,
        });

        socketRef.current.on('user-joined', ({ userId, name }) => {
          const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: currentStream,
          });
          peer.on('signal', (signal) => {
            socketRef.current.emit('signal', {
              userToSignal: userId,
              callerId: socketRef.current.id,
              signal,
              name: myName,
            });
          });
          peer.on('stream', (remoteStream) => {
            setPeers((prev) => [
              ...prev,
              { peerID: userId, stream: remoteStream, name },
            ]);
          });
          peersRef.current.push({ peerID: userId, peer });
        });

        socketRef.current.on('user-signal', ({ callerId, signal, name }) => {
          const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: currentStream,
          });
          peer.on('signal', (signal) => {
            socketRef.current.emit('return-signal', { signal, callerId });
          });
          peer.on('stream', (remoteStream) => {
            setPeers((prev) => [
              ...prev,
              { peerID: callerId, stream: remoteStream, name },
            ]);
          });
          peer.signal(signal);
          peersRef.current.push({ peerID: callerId, peer });
        });

        socketRef.current.on('received-return-signal', ({ signal, id }) => {
          const item = peersRef.current.find((p) => p.peerID === id);
          if (item) item.peer.signal(signal);
        });

        socketRef.current.on('chat-message', (msg) => {
          setMessages((prev) => [...prev, msg]);
        });

        socketRef.current.on('emoji-reaction', ({ userId, emoji }) => {
          setEmojis((prev) => ({
            ...prev,
            [userId]: { emoji, time: Date.now() },
          }));
          setEmojiHistory((prev) => [
            ...prev,
            { user: userId, emoji },
          ]);
          setTimeout(() => {
            setEmojis((prev) => {
              const updated = { ...prev };
              delete updated[userId];
              return updated;
            });
          }, 3000);
        });
      });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (stream) stream.getTracks().forEach((track) => track.stop());
      peersRef.current.forEach(({ peer }) => peer.destroy());
    };
  }, [roomId]);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <Navbar />
      <motion.div className="p-4 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4 text-center">Welcome to the Room</h1>
          <div className="flex justify-center gap-3 mb-6">
            <p className="bg-gray-800 px-3 py-1 rounded text-sm">
              Room ID: <span className="text-yellow-400">{roomId}</span>
            </p>
            <button
              onClick={copyRoomId}
              className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700"
            >
              Copy
            </button>
            {copied && (
              <span className="text-green-400 text-xs">Copied!</span>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <div
              className={`relative ${
                expandedVideos['me']
                  ? 'w-full h-[70vh]'
                  : 'w-full max-w-xs h-56'
              }`}
            >
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                className="object-cover w-full h-full border-4 border-green-500 rounded-xl"
              />
              {emojis['me'] && (
                <div className="absolute top-1 left-1 text-3xl floating-emoji">
                  {emojis['me'].emoji}
                </div>
              )}
              <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
                {myName}
              </div>
              <div className="absolute top-1 right-1 flex gap-1">
                <button
                  onClick={() => toggleExpand('me')}
                  className="bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded"
                >
                  {expandedVideos['me'] ? 'Minimize' : 'Expand'}
                </button>
                <button
                  onClick={() => togglePiP(myVideo.current)}
                  className="bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded"
                >
                  PiP
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {peers.map((peerObj) => (
              <div
                key={peerObj.peerID}
                className={`relative ${
                  expandedVideos[peerObj.peerID]
                    ? 'w-full h-[70vh]'
                    : 'w-full max-w-xs h-56'
                }`}
              >
                <video
                  playsInline
                  autoPlay
                  ref={(ref) => {
                    if (ref && peerObj.stream)
                      ref.srcObject = peerObj.stream;
                  }}
                  className="object-cover w-full h-full border-4 border-purple-500 rounded-xl"
                />
                {emojis[peerObj.peerID] && (
                  <div className="absolute top-1 left-1 text-3xl floating-emoji">
                    {emojis[peerObj.peerID].emoji}
                  </div>
                )}
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
                  {peerObj.name || 'Guest'}
                </div>
                <div className="absolute top-1 right-1 flex gap-1">
                  <button
                    onClick={() => toggleExpand(peerObj.peerID)}
                    className="bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded"
                  >
                    {expandedVideos[peerObj.peerID]
                      ? 'Minimize'
                      : 'Expand'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <motion.button
              onClick={toggleMic}
              className={`px-5 py-2 rounded font-medium ${
                micOn ? 'bg-green-600' : 'bg-red-600'
              }`}
            >
              {micOn ? 'Mute Mic' : 'Unmute Mic'}
            </motion.button>
            <motion.button
              onClick={toggleCamera}
              className={`px-5 py-2 rounded font-medium ${
                cameraOn ? 'bg-green-600' : 'bg-red-600'
              }`}
            >
              {cameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
            </motion.button>
            <motion.button
              onClick={shareScreen}
              className={`px-5 py-2 rounded font-medium ${
                screenSharing ? 'bg-yellow-500' : 'bg-indigo-600'
              }`}
            >
              {screenSharing ? 'Stop Sharing' : 'Share Screen'}
            </motion.button>
            <motion.button
              onClick={toggleWhiteboard}
              className="bg-green-500 px-5 py-2 rounded font-medium"
            >
              {showWhiteboard ? 'Hide Whiteboard' : 'Open Whiteboard'}
            </motion.button>
          </div>
          <div className="flex justify-center gap-2 mb-4">
            {['👍', '😂', '❤️', '🔥', '🎉'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => sendEmoji(emoji)}
                className="text-2xl hover:scale-110 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
          {showWhiteboard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <WhiteboardCanvas onClose={() => setShowWhiteboard(false)} />
            </motion.div>
          )}
        </div>
        <div className="w-full lg:w-80 bg-gray-800 rounded-xl p-4 h-[80vh] flex flex-col">
          <h2 className="text-lg font-semibold mb-2 text-center">Chat</h2>
          <div className="flex-1 overflow-y-auto mb-2 border border-gray-700 rounded p-2 bg-gray-900 space-y-1">
            {messages.map((msg, i) => (
              <div key={i} className="text-sm">
                <span className="text-yellow-300 font-semibold">
                  {msg.sender}:{' '}
                </span>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          <div className="text-xs mt-3">
            <h3 className="font-semibold">Reactions:</h3>
            <div className="flex flex-wrap gap-1">
              {emojiHistory.slice(-10).map((e, i) => (
                <span key={i}>{e.emoji}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 px-3 py-1 rounded bg-gray-700 text-white focus:outline-none"
              placeholder="Type message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RoomPage;