// src/main.jsx
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './pages/Landing';

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);