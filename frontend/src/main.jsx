import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';

// src/main.tsx or src/main.jsx
import { Buffer } from 'buffer';
import process from 'process';

window.global = window;  // 👈 Adds `global`
window.Buffer = Buffer;
window.process = process;


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
  </BrowserRouter>
  </StrictMode>,
)
