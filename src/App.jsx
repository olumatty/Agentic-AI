import React from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AgentPage from "../global/AgentPage";
import SignIn from "../global/SignIn";
import SignUp from "../global/SignUp";
import Modal from '../components/modal';



const routes = (
  <Router>
    <Routes>
      <Route path="/:userId" element={<AgentPage />} />
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
    </div>
  )
}

export default App
