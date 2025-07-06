import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import RoomPage from './pages/RoomPage';


const App = () => {
  const token = localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/" element={token ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/room/:roomId" element={<RoomPage />} />

    </Routes>
  );
};

export default App;
