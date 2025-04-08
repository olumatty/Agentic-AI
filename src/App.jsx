import React from 'react'
import Chatbot from '../components/Chatbot'
import Header from '../components/Header'
import {useState} from "react";


const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState([]);
  return (
    
      <div className='flex h-screen flex-col bg-white transition-all duration-300 '>
        <Header setShowWelcome={setShowWelcome} setMessages={setMessages}/>
        <div className="px-4 md:px-4 pb-4 flex-1 flex flex-col border-b-lg overflow-hidden">
        <Chatbot showWelcome={showWelcome} setShowWelcome={setShowWelcome} setMessages={setMessages} messages={messages} />
        </div>
        
      </div>
  )
}

export default App
