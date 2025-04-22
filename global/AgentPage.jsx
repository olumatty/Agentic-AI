import React from 'react';
import Chatbot from '../components/Chatbot';
import Header from '../components/Header';
import { useState, useEffect } from "react";
import axios from 'axios';
import Sidebar from '../components/sidebar';
import { useAuth } from '../context/authContext.jsx';
import { useParams, useNavigate } from 'react-router-dom';

const AgentPage = () => {
    const [showWelcome, setShowWelcome] = useState(true);
    const [messages, setMessages] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [isNewChat, setIsNewChat] = useState(true); // Start with true for initial page load
    const [iscollapsed, setIsCollapsed] = useState(false); // Default to open on desktop
    const [input, setInput] = useState("");
    const { user } = useAuth();
    const { userId: userIdFromUrl, conversationId: urlConversationId } = useParams();
    const navigate = useNavigate();

    // Check screen size on mount and resize
    useEffect(() => {
        const handleResize = () => {
            // Auto-open sidebar on desktop and close on mobile
            if (window.innerWidth >= 768) {
                setIsCollapsed(false); 
            } else {
                setIsCollapsed(true); // hide sidebar on mobile
            }
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);
        
        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handlesidebarCollapse = () => {
        setIsCollapsed(!iscollapsed);
    };

    const startNewChat = () => {
        // Only reset UI state, no API call yet
        setMessages([]);
        setShowWelcome(true);
        setIsNewChat(true);
        setCurrentConversationId(null);
        setInput("");
        
        // Navigate to base chat route without ID
        navigate('/');
        console.log("Ready for new chat - waiting for user input");
    };

    const loadChat = async(conversationId) => {
        setCurrentConversationId(conversationId);
        setIsNewChat(false);
        try {
            const token = localStorage.getItem('authToken') || '';
            
            const response = await axios.get(`http://localhost:8000/api/v1/chats/${conversationId}`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'user-id': user?.id || userIdFromUrl || '',
                    'session-id': localStorage.getItem('sessionId') || ''
                }
            });

            setMessages(response.data.messages || []); 
            setShowWelcome(false);
        } catch(error) {
            console.error('Error loading chat:', error);
            setMessages([{ role: 'assistant', content: 'Failed to load chat history.' }]);
            setShowWelcome(false);
        }
    };
    
    // Check if we have a conversation ID in URL on initial load
    React.useEffect(() => {
        if (urlConversationId) {
            loadChat(urlConversationId);
        }
    }, [urlConversationId]);

    return (
        <div className="flex h-screen flex-col md:flex-row bg-white">
            <Sidebar
                startNewChat={startNewChat}
                iscollapsed={iscollapsed}
                setIsCollapsed={setIsCollapsed}
                currentConversationId={currentConversationId}
                onChatSelect={loadChat}
            />

            <div className='flex flex-col flex-1 overflow-hidden'>
                <Header 
                    setShowWelcome={setShowWelcome} 
                    setMessages={setMessages} 
                    handlesidebarCollapse={handlesidebarCollapse}
                    setIsCollapsed={setIsCollapsed}
                    iscollapsed={iscollapsed}
                />
                <div className="px-4 md:px-4 pb-4 flex-1 flex flex-col overflow-hidden">
                    <Chatbot
                        showWelcome={showWelcome}
                        setShowWelcome={setShowWelcome}
                        setMessages={setMessages}
                        messages={messages}
                        currentConversationId={currentConversationId}
                        setCurrentConversationId={setCurrentConversationId}
                        input={input}
                        setInput={setInput}
                        isNewChat={isNewChat}
                        setIsNewChat={setIsNewChat}
                    />
                </div>
            </div>
        </div>
    );
};

export default AgentPage;