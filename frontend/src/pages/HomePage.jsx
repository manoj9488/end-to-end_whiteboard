import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import { motion } from 'framer-motion';

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
      await axios.post('http://localhost:5000/api/room/join', { roomId });
      navigate(`/room/${roomId}`);
    } catch (err) {
      alert('Room not found');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4 sm:p-6 md:p-10">
      <motion.div
        className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg md:max-w-xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-3xl sm:text-4xl font-extrabold text-center text-blue-700 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Secure Video Meet
        </motion.h1>

        <motion.button
          onClick={handleCreateRoom}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition text-sm sm:text-base"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
        >
          + Create New Room
        </motion.button>

        <div className="my-4 border-t border-gray-300" />

        <motion.div
          className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <input
            type="text"
            placeholder="Enter Room ID"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <motion.button
            onClick={handleJoinRoom}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm sm:text-base"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
          >
            Join
          </motion.button>
        </motion.div>

        <motion.button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="mt-6 text-sm text-red-600 underline block text-center"
          whileHover={{ scale: 1.05 }}
        >
          Logout
        </motion.button>
      </motion.div>
    </div>
  );
};

export default HomePage;
