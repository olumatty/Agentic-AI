import React from 'react'
import Chatbot from '../components/Chatbot'
import Header from '../components/Header'
import {useState} from "react";


const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  return (
    
      <div className='flex flex-1 h-screen flex-col bg-[#1E1E21] transition-all duration-300'>
        <Header setShowWelcome={setShowWelcome}/>
        <Chatbot showWelcome={showWelcome} setShowWelcome={setShowWelcome} />
      </div>
  )
}

export default App
