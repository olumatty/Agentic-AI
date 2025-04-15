import React from 'react'
import Chatbot from '../components/Chatbot'
import Header from '../components/Header'
import { useState } from "react";
import axios from 'axios';
import Sidebar from '../components/sidebar';

const AgentPage = () => {
    const [showWelcome, setShowWelcome] = useState(true);
    const [messages, setMessages] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    
  
    const startNewChat = async () => {
        setMessages([]);
        setShowWelcome(true);
        setCurrentChatId(null);

        try{
          await axios.post('http://localhost:8000/api/v1/auth/clear-chat-id');
          console.log('Chat ID cleared from backend session.');
        }catch(err){
          console.error('Error clearing chat ID from backend session:', err);
        }
      };

    return (
        <div className="flex h-screen flex-row bg-white transition-all duration-300">
          <Sidebar/>
          <div className='flex flex-col flex-1'>
          <Header setShowWelcome={setShowWelcome} setMessages={setMessages} startNewChat={startNewChat} />
          <div className="px-4 md:px-4 pb-4 flex-1 flex flex-col overflow-hidden">
            <Chatbot 
              showWelcome={showWelcome}
              setShowWelcome={setShowWelcome} 
              setMessages={setMessages} 
              messages={messages}
              currentChatId={currentChatId}
              setCurrentChatId={setCurrentChatId}
            />
          </div>
          </div>
          
        </div>
    )
}

export default AgentPage