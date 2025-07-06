import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

const HomePage = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleCreateRoom = async () => {
    const newRoomId = uuid();
    try {
      await axios.post('http://localhost:5000/api/room/create', {
        roomId: newRoomId,
        createdBy: user.name || 'Guest',
      });
      navigate(`/room/${newRoomId}`);
    } catch (err) {
      alert('Room create failed');
    }
  };

  const handleJoinRoom = async () => {
    if (!roomId) return alert('Enter Room ID');
    try {
      await axios.post('http://localhost:5000/api/room/join', {
        roomId,
      });
      navigate(`/room/${roomId}`);
    } catch (err) {
      alert('Room not found');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">🎥 Secure Video Meet</h1>

      <div className="flex flex-col space-y-4 w-full max-w-md">
        <button
          onClick={handleCreateRoom}
          className="bg-green-600 text-white py-3 rounded hover:bg-green-700"
        >
          + Create New Room
        </button>

        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter Room ID"
            className="flex-1 border px-4 py-2 rounded"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button
            onClick={handleJoinRoom}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Join
          </button>
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="mt-6 text-sm text-red-600 underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
