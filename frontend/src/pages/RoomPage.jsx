import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';

const socket = io('http://localhost:5000'); // backend

const RoomPage = () => {
  const { roomId } = useParams();
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      setStream(currentStream);
      if (myVideo.current) {
        myVideo.current.srcObject = currentStream;
      }

      socket.emit('join-room', { roomId, userId: socket.id });

      socket.on('user-joined', (userId) => {
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: currentStream,
        });

        peer.on('signal', (signal) => {
          socket.emit('signal', {
            userToSignal: userId,
            callerId: socket.id,
            signal,
          });
        });

        peer.on('stream', (remoteStream) => {
          if (userVideo.current) {
            userVideo.current.srcObject = remoteStream;
          }
        });

        socket.on('received-return-signal', ({ signal }) => {
          peer.signal(signal);
        });

        connectionRef.current = peer;
        setCallStarted(true);
      });

      socket.on('user-signal', ({ callerId, signal }) => {
        setReceivingCall(true);
        setCallerSignal(signal);

        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: currentStream,
        });

        peer.on('signal', (signal) => {
          socket.emit('return-signal', { signal, callerId });
        });

        peer.on('stream', (remoteStream) => {
          if (userVideo.current) {
            userVideo.current.srcObject = remoteStream;
          }
        });

        peer.signal(signal);
        connectionRef.current = peer;
        setCallAccepted(true);
        setCallStarted(true);
      });
    });
  }, []);

  const toggleMic = () => {
    stream.getAudioTracks()[0].enabled = !micOn;
    setMicOn(!micOn);
  };

  const toggleCamera = () => {
    stream.getVideoTracks()[0].enabled = !cameraOn;
    setCameraOn(!cameraOn);
  };

//   const shareScreen = async () => {
//     if (!screenSharing) {
//       const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
//       const sender = connectionRef.current._pc.getSenders().find(s => s.track.kind === 'video');
//       sender.replaceTrack(screenStream.getVideoTracks()[0]);
//       setScreenSharing(true);

//       screenStream.getVideoTracks()[0].onended = () => {
//         sender.replaceTrack(stream.getVideoTracks()[0]);
//         setScreenSharing(false);
//       };
//     }
//   };
const shareScreen = async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const screenTrack = stream.getVideoTracks()[0];

    if (!peer || !peer._pc) {
      console.error('Peer connection not ready');
      return;
    }

    const sender = peer._pc.getSenders().find(s => s.track.kind === 'video');
    if (sender) {
      sender.replaceTrack(screenTrack);
    }

    // Optional: stop screen share when done
    screenTrack.onended = () => {
      // Replace screen with webcam again or end call
      console.log('Screen share stopped');
    };
  } catch (err) {
    console.error('Error sharing screen:', err);
  }
};

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <video
          playsInline
          muted
          ref={myVideo}
          autoPlay
          className="w-full max-w-md border-4 border-green-500 rounded-lg"
        />
        <video
          playsInline
          ref={userVideo}
          autoPlay
          className="w-full max-w-md border-4 border-blue-500 rounded-lg"
        />
      </div>

      <div className="flex space-x-4 mt-4">
        <button
          onClick={toggleMic}
          className={`px-4 py-2 rounded ${micOn ? 'bg-green-600' : 'bg-red-600'}`}
        >
          {micOn ? 'Mute Mic' : 'Unmute Mic'}
        </button>

        <button
          onClick={toggleCamera}
          className={`px-4 py-2 rounded ${cameraOn ? 'bg-green-600' : 'bg-red-600'}`}
        >
          {cameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        </button>

        <button
          onClick={shareScreen}
          className={`px-4 py-2 rounded ${screenSharing ? 'bg-yellow-500' : 'bg-indigo-600'}`}
        >
          {screenSharing ? 'Stop Sharing' : 'Share Screen'}
        </button>
      </div>

      <p className="mt-6 text-sm text-gray-300">Room ID: {roomId}</p>
    </div>
  );
};

export default RoomPage;
