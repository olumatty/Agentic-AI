import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import AgentPage from '../global/AgentPage.jsx';
import SignIn from "../global/SignIn.jsx";
import SignUp from "../global/SignUp.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext.jsx';

const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<AgentPage />} />
        <Route 
          path="/chat/:conversationId" 
          element={isAuthenticated ? <AgentPage /> : <Navigate to="/signin" state={{ from: window.location.pathname }} />} 
        />
        <Route 
          path="/signin" 
          element={!isAuthenticated ? <SignIn /> : <Navigate to="/" />} 
        />
        <Route 
          path="/signup" 
          element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />} 
        />
        {/* Add a catch-all route that redirects to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default App;