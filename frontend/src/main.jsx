import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import App from './App.jsx'
import React from 'react'; 
import App from "./App"
import "./index.css"; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     <App />
    </BrowserRouter>
   </StrictMode>,
)