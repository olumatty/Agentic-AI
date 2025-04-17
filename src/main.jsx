import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from '../context/authContext.jsx';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter here

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>  {/* Wrap the entire app inside BrowserRouter */}
            <AuthProvider>  {/* Ensure AuthProvider is inside Router */}
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
