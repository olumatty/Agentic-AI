import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import AgentPage from "../global/AgentPage";
import SignIn from "../global/SignIn";
import SignUp from "../global/SignUp";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/authContext.jsx';

const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Routes>
        {/* Chatbot page accessible with or without authentication */}
        <Route path="/" element={<AgentPage />} />

        {/* Specific chat conversations require authentication */}
        <Route path="/chat/:conversationId" element={isAuthenticated ? <AgentPage /> : <Navigate to="/signin" />} />

        {/* Sign-in and sign-up pages accessible only when not authenticated */}
        <Route path="/signin" element={!isAuthenticated ? <SignIn /> : <Navigate to="/" />} />
        <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />} />
      </Routes>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default App;