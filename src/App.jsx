import React from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AgentPage from "../global/AgentPage";
import SignIn from "../global/SignIn";
import SignUp from "../global/SignUp";
import Modal from '../components/modal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const routes = (
  <Router>
    <Routes>
      <Route path="/chat/:chatId" element={<AgentPage />} />
      <Route path="/" element={<AgentPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/modal" element={<Modal />} />
    </Routes>
  </Router>
)

const App = () => {
  return (
    <div>
      {routes}
      <ToastContainer position="bottom-right" />
    </div>
  )
}

export default App
