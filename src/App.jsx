import React from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AgentPage from "../global/AgentPage";
import SignIn from "../global/SignIn";
import SignUp from "../global/SignUp";

const routes = (
  <Router>
    <Routes>
      <Route path="/" element={<AgentPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
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
