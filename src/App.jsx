import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import AgentPage from '../global/AgentPage.jsx';
import SignIn from "../global/signIn.jsx";
import SignUp from "../global/signUp.jsx";
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
        <Route path="/" element={<AgentPage />} />
        <Route path="/chat/:conversationId" element={isAuthenticated ? <AgentPage /> : <Navigate to="/signin" />} />
        <Route path="/signin" element={!isAuthenticated ? <SignIn /> : <Navigate to="/" />} />
        <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />} />
      </Routes>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default App;