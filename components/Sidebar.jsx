import React, { useEffect, useState, useRef } from 'react';
import { BsPencilSquare } from "react-icons/bs";
import Logo from "../src/assets/star-inside-circle-svgrepo-com (1).svg";
import axios from 'axios';
import { useAuth } from '../context/authContext.jsx';
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";

const Sidebar = ({ startNewChat, iscollapsed, setIsCollapsed, currentConversationId, onChatSelect }) => {
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [conversationIdToDelete, setConversationIdToDelete] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    
    const { user, getHeaders } = useAuth();
    const API_URL = "http://localhost:8000";
    const modalRef = useRef(null);
    const sidebarRef = useRef(null);

    // Check if we're on mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const fetchChatHistory = async () => {
        try {
            setIsLoading(true);
            const userId = user?.id;
            if (userId) {
                const response = await axios.get(`${API_URL}/api/v1/chats/${userId}/history`, {
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
                setChatHistory([]);
            }
        } catch (error) {
            console.error("Error fetching chat history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchChatHistory();
    }, []);

    // Handle clicks outside of sidebar on mobile to close it
    useEffect(() => {
        function handleClickOutside(event) {
            if (iscollapsed && isMobile && 
                sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsCollapsed(false);
            }
        }

        if (iscollapsed && isMobile) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [iscollapsed, setIsCollapsed, isMobile]);

    // Handle clicks outside of the modal
    useEffect(() => {
        function handleClickOutside(event) {
            if (isDeleteModalOpen && modalRef.current && !modalRef.current.contains(event.target)) {
                closeDeleteModal();
            }
        }

        if (isDeleteModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDeleteModalOpen]);

    const handleChatClick = (conversationId) => {
        console.log("Clicked on conversation ID:", conversationId);
        onChatSelect(conversationId);
        // Close sidebar on mobile after selecting a chat
        if (isMobile) {
            setIsCollapsed(false);
        }
    };

    const openDeleteModal = (conversationId) => {
        setConversationIdToDelete(conversationId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setConversationIdToDelete(null);
    };

    const handleDeleteIndividualChat = async () => {
        if (conversationIdToDelete) {
            try {
                const response = await fetch(`${API_URL}/api/v1/chats/${conversationIdToDelete}`, {
                    method: 'DELETE',
                    headers: getHeaders(false),
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data.message);
                    setChatHistory(prevHistory =>
                        prevHistory.filter(chat => chat.conversationId !== conversationIdToDelete)
                    );
                } else if (response.status === 404) {
                    const errorData = await response.json();
                    alert(errorData.message);
                } else {
                    const errorData = await response.json();
                    console.error("Error deleting chat:", errorData.message);
                    alert(`Error deleting chat: ${errorData.message}`);
                }
            } catch (error) {
                console.error("Error deleting chat:", error);
                alert("An error occurred while deleting the chat conversation.");
            } finally {
                closeDeleteModal(); 
            }
        }
    };

    return (
        <>
            {/* Mobile overlay when sidebar is open */}
            {iscollapsed && isMobile && (
                <div 
                    className="fixed inset-0 bg-opacity-100 z-10"
                    onClick={() => setIsCollapsed(false)}
                />
            )}
            
            {/* Sidebar */}
            <div 
                ref={sidebarRef}
                className={`
                    ${isMobile ? 'fixed z-20' : 'relative'} 
                    flex flex-col h-screen border-r border-gray-300 
                    bg-white transition-all duration-300 ease-in-out
                    ${isMobile 
                        ? iscollapsed ? 'translate-x-0' : '-translate-x-full' 
                        : iscollapsed ? 'w-[280px]' : 'w-0 overflow-hidden'}
                    md:w-auto md:min-w-[${iscollapsed ? '280px' : '0px'}]
                    md:max-w-[${iscollapsed ? '280px' : '0px'}]
                `}
                style={!isMobile ? {
                    minWidth: iscollapsed ? '220px' : '0px',
                    maxWidth: iscollapsed ? '280px' : '0px',
                } : {}}
            >
                {/* Header */}
                <div className="border-b border-gray-300 py-3.5 px-4 flex items-center justify-between">
                    <h1 className="text-[14px] font-medium text-gray-800">Conversations</h1>
                    <div className="flex gap-2 items-center">
                        <BsPencilSquare
                            onClick={() => {
                                startNewChat();
                                if (isMobile) setIsCollapsed(false);
                            }}
                            size={16}
                            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                            title="New Chat"
                        />
                        {/* Close button visible only on mobile */}
                        {isMobile && (
                            <IoMdClose 
                                className="text-gray-500 hover:text-gray-700 cursor-pointer ml-2" 
                                size={20}
                                onClick={() => setIsCollapsed(false)}
                            />
                        )}
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
                <div className="flex flex-col p-3 overflow-y-auto flex-1">
                    <p className="text-gray-400 text-[12px] px-1 font-medium">Recent</p>

                    {isLoading ? (
                        <div className="text-center py-4 text-gray-500">Loading...</div>
                    ) : chatHistory.length > 0 ? (
                        chatHistory.map((chat) => (
                            <div
                                key={chat.conversationId}
                                className={`p-2 rounded cursor-pointer mb-2 text-gray-900 transition-all hover:shadow-md flex items-center justify-between ${
                                    chat.conversationId === currentConversationId ? 'bg-blue-100 border border-blue-500' : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                                onClick={() => handleChatClick(chat.conversationId)}
                            >
                                <div className="truncate text-sm">{chat.title}</div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openDeleteModal(chat.conversationId);
                                    }}
                                    className="focus:outline-none hover:text-red-500 text-gray-400"
                                    title="Delete Chat"
                                >
                                    <AiOutlineDelete size={16} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 text-gray-500">No history</div>
                    )}
                </div>

                {/* Logo Button */}
                <button className="flex items-center justify-center mt-auto mx-auto gap-1 border mb-8
                               cursor-pointer w-[90%] border-gray-300 py-2 px-3 rounded-xl">
                    <img src={Logo} alt="Logo" className="w-5 h-5" />
                    <h1 className="font-medium text-[13px] text-gray-900">Travel1.0</h1>
                </button>

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <div 
                        className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300'
                    >
                        <div 
                            ref={modalRef}
                            className="bg-white w-[90%] sm:w-[35%] h-auto rounded-lg shadow-lg animate-fadeIn"
                        >
                            <div className="flex items-center p-3 border-b flex-col">
                                <p className="mb-4 text-gray-900 text-center">Are you sure you want to delete this chat conversation?</p>
                                <div className="flex justify-end gap-4">
                                    <button onClick={closeDeleteModal} className="px-4 py-2 rounded-md text-gray-600 bg-gray-200 hover:bg-gray-300">
                                        No
                                    </button>
                                    <button onClick={handleDeleteIndividualChat} className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600">
                                        Yes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Sidebar;