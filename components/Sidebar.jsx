import React, { useEffect, useState } from 'react';
import { BsPencilSquare } from "react-icons/bs";
import Logo from "../src/assets/star-inside-circle-svgrepo-com.svg";
import axios from 'axios';
import { useAuth } from '../context/authContext.jsx'; // Assuming the path to your authContext

const Sidebar = ({ startNewChat, iscollapsed, currentConversationId, onChatSelect }) => {
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth(); // Get the user object

    const fetchChatHistory = async () => {
        try {
            setIsLoading(true);
            const userId = user?.id; // Get the user ID from your authentication context
            if (userId) {
                const response = await axios.get(`http://localhost:8000/api/v1/chats/${userId}/history`, {
                    withCredentials: true,
                    headers: {
                        'user-id': user?.id || '',
                        'session-id': localStorage.getItem('sessionId') || ''
                    }
                });
                setChatHistory(response.data);
                console.log("Chat history received:", response.data);
            } else {
                console.warn("User ID not available, cannot fetch chat history.");
                setChatHistory([]); // Or handle this case as needed
            }
        } catch (error) {
            console.error("Error fetching chat history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch on component mount
    useEffect(() => {
        fetchChatHistory();
    }, []);

    // Also fetch when currentChatId changes (you might want to remove this if history should only load once)
    // useEffect(() => {
    //     if (currentConversationId) {
    //         fetchChatHistory();
    //     }
    // }, [currentConversationId]);

    const handleChatClick = (conversationId) => { // Changed from chatId to conversationId to match backend
        onChatSelect(conversationId);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    };

    return (
        iscollapsed && (
            <div className="flex flex-col h-screen border-r border-gray-300 w-[20%] md:w-[15%] lg:w-[12%] min-w-[60px] bg-white">
                {/* Header */}
                <div className="border-b border-gray-300 py-3.5 px-4 flex items-center justify-between">
                    <h1 className="text-[14px] font-medium text-gray-800 hidden md:block">Conversations</h1>
                    <div className="flex gap-2">
                        <BsPencilSquare
                            onClick={startNewChat}
                            size={16}
                            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                            title="New Chat"
                        />
                    </div>
                </div>
                <button
                    onClick={fetchChatHistory}
                    className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    title="Refresh"
                >
                    {isLoading ? "..." : "↻"}
                </button>

                {/* Recent */}
                <div className="flex flex-col p-3 overflow-y-auto">
                    <p className="text-gray-400 text-[12px] px-1 font-medium hidden md:block">Recent</p>

                    {isLoading ? (
                        <div className="text-center py-4 text-gray-500">Loading...</div>
                    ) : chatHistory.length > 0 ? (
                        chatHistory.map((chat) => (
                            <div
                                key={chat.conversationId} // Use conversationId from backend
                                className={`p-2 rounded cursor-pointer mb-2 text-gray-900 transition-all hover:shadow-md ${
                                    chat.conversationId === currentConversationId ? 'bg-blue-100 border border-blue-500' : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                                onClick={() => handleChatClick(chat.conversationId)} // Pass conversationId
                            >
                                <div className="truncate text-sm">{chat.title}</div> {/* Assuming your history returns a title */}
                                <p className="text-xs text-gray-500 truncate hidden md:block">
                                    {formatDate(chat.updatedAt)}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 text-gray-500">No chat history</div>
                    )}
                </div>

                {/* Logo Button */}
                <button className="flex items-center justify-center mt-auto mx-auto gap-1 border mb-8
                               cursor-pointer w-[90%] border-gray-300 py-2 px-3 rounded-xl">
                    <img src={Logo} alt="Logo" className="w-5 h-5" />
                    <h1 className="font-medium text-[13px] text-gray-900 hidden md:block">Travel1.0</h1>
                </button>
            </div>
        )
    );
};

export default Sidebar;