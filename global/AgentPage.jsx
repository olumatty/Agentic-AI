import React from 'react'
import Chatbot from '../components/Chatbot'
import Header from '../components/Header'
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from 'react-router';

const AgentPage = () => {
    const [showWelcome, setShowWelcome] = useState(true);
    const [messages, setMessages] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);

    const navigate = useNavigate();
  
    const startNewChat = async () => {
      const newChatId = uuidv4();
      setMessages([]);
      setShowWelcome(true);
      setCurrentChatId(newChatId);
      navigate(`/chat/${newChatId}`)

      try {
        const response = await fetch(`http://localhost:8000/api/v1/auth/reset-chat-state`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: newChatId,
          }),
        });
        if (!response.ok) {
          console.error("Failed to reset chat state:", response.status);
        }
      } catch (error) {
        console.error("Error resetting chat state:", error);
      }
    };

    return (
        <div className="flex h-screen flex-col bg-white transition-all duration-300">
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
    )
}

export default AgentPage