// chatbot.jsx
import { useEffect, useState, useRef } from "react";
import React from "react";
import { IoIosArrowRoundUp } from "react-icons/io";
import ReactMarkdown from "react-markdown";
import Loading from "../components/Loading";
import HomeUI from "./HomeUI";
import Logo from "../src/assets/star-inside-circle-svgrepo-com.svg";
import { useAuth } from '../context/authContext.jsx';
import { useParams } from 'react-router-dom';


const Chatbot = ({ showWelcome, setShowWelcome, messages, setMessages, currentConversationId, setCurrentConversationId, input, setInput, isNewChat, setIsNewChat}) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { userId: userIdFromUrl } = useParams();

  const userRef = useRef();
  const messagesEndRef = useRef();
  const chatContainerRef = useRef();
  const inputBarRef = useRef(null);
  const [inputBarHeight, setInputBarHeight] = useState(0);

  // API URL - better to define as a constant or from environment
  const API_URL = "http://localhost:8000";

  const getHeaders = (includeContentType = true) => {
    const headers = {};
    
    // Add Content-Type if needed
    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Add authentication token consistently
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add user identification (used by your backend)
    if (user?.id || userIdFromUrl) {
      headers['user-id'] = user?.id || userIdFromUrl || '';
    }
    
    // Add session ID if available (used by some of your endpoints)
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      headers['session-id'] = sessionId;
    }
    
    return headers;
  };

  useEffect(() => {
    if (inputBarRef.current) {
      setInputBarHeight(inputBarRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const loadInitialChat = async () => {
      if (currentConversationId) {
        try {
          setLoading(true);
          // Consistent API endpoint format (/api/v1/chats/...)
          const response = await fetch(`${API_URL}/api/v1/chats/${currentConversationId}`, {
            credentials: 'include', // Important for cookies
            headers: getHeaders(false)
          });
          
          if (response.ok) {
            const chatData = await response.json();
            console.log("Chat data loaded:", chatData);
            // Fixed: Use messages instead of messges
            setMessages(chatData.messages || []);
            setShowWelcome(false);
          } else {
            console.error("Failed to load chat:", response.status);
            setError("Failed to load chat history");
            setMessages([{
              role: 'assistant',
              content: 'Failed to load chat history.',
              timestamp: new Date().toISOString()
            }]);
            setShowWelcome(false);
          }
        } catch (error) {
          console.error("Error loading chat:", error);
          setError("Error connecting to server");
          setMessages([{
            role: 'assistant',
            content: 'Error connecting to server.',
            timestamp: new Date().toISOString()
          }]);
          setShowWelcome(false);
        } finally {
          setLoading(false);
        }
      }
    };

    loadInitialChat();
  }, [currentConversationId, setMessages, setShowWelcome, user?.id, userIdFromUrl]);

  useEffect(() => {
    if (isNewChat) {
      setMessages([]);
      setInput("");
      setShowWelcome(true);
    }
  }, [isNewChat, setMessages, setShowWelcome, setInput]);

  const sendMessage = async (messageContent) => {
    if (!messageContent.trim()) {
      return;
    }

    const userMessage = {
      role: "user",
      content: messageContent,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setShowWelcome(false);
    setLoading(true);

    try {
      // Create a new conversation if this is a new chat
      if (isNewChat) {
        console.log("Creating new conversation with first message");
        
        // Add the user's first message to travel API
        const aiHeaders = getHeaders();
        const apiKey = localStorage.getItem('apiKeys');
        if (apiKey) {
          aiHeaders['x-user-openai-key'] = apiKey;
        }

        const requestBody = {
          messages: [userMessage],
          // Don't provide conversationId - let the backend generate one
        };

        const response = await fetch(`${API_URL}/api/v1/travel`, {
          method: "POST",
          headers: aiHeaders,
          credentials: 'include',
          body: JSON.stringify(requestBody),
        });
        console.log("Sending first message to /api/v1/travel", requestBody);

        if (response.status === 429) {
          setMessages(prev => [
            ...prev.slice(0, -1),
            {
              role: "assistant",
              content: "You've hit the rate limit. Please try again later.",
              timestamp: new Date().toISOString(),
              isError: true
            },
          ]);
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log("Response from /api/v1/travel for new conversation:", data);

        if (data.conversationId) {
          // Update conversation ID and URL
          setCurrentConversationId(data.conversationId);
          setIsNewChat(false);
          
          // Update browser URL
          window.history.replaceState(
            null, 
            '', 
            `/chat/${data.conversationId}`
          );
        }

        // Add assistant response
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: data.reply || "No response from AI.",
            timestamp: new Date().toISOString(),
            toolResults: data.toolResults
          }
        ]);
      } else if (currentConversationId) {
        console.log("Conversation ID NOT received from backend in the response."); 
        // This is an existing conversation
        // Add a thinking message
        const thinkingMessage = {
          role: "assistant",
          content: "Thinking...",
          timestamp: new Date().toISOString(),
          isLoading: true
        };
        setMessages(prev => [...prev, thinkingMessage]);

        // Create headers with OpenAI key if present
        const aiHeaders = getHeaders();
        const apiKey = localStorage.getItem('apiKeys');
        if (apiKey) {
          aiHeaders['x-user-openai-key'] = apiKey;
        }

        const requestBody = {
          messages: [...messages.filter(m => !m.isLoading), userMessage],
          conversationId: currentConversationId
        };

        const response = await fetch(`${API_URL}/api/v1/travel`, {
          method: "POST",
          headers: aiHeaders,
          credentials: 'include',
          body: JSON.stringify(requestBody),
        });
        console.log("Sending messages to /api/v1/travel", requestBody);

        if (response.status === 429) {
          setMessages(prev => [
            ...prev.slice(0, -1),
            {
              role: "assistant",
              content: "You've hit the rate limit. Please try again later.",
              timestamp: new Date().toISOString(),
              isError: true
            },
          ]);
          return;
        }

        const data = await response.json();
        console.log("Response from /api/v1/travel:", data);

        // Replace thinking message with the AI's response
        setMessages(prev => [
          ...prev.slice(0, -1),
          {
            role: "assistant",
            content: data.reply || "No response from AI.",
            timestamp: new Date().toISOString(),
            toolResults: data.toolResults
          }
        ]);
      }
    } catch (error) {
      console.error("Error calling /api/v1/travel:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong with the AI. Please try again later.",
          timestamp: new Date().toISOString(),
          isError: true
        }
      ]);
      setError(error.message);
    } finally {
      setLoading(false);
      setInput("");
    }
};

  const handleSend = async (e) => {
    e.preventDefault();
    console.log("handleSend function triggered");
    if (input.trim() === "" || loading) return;

    const messageText = input.trim();
    await sendMessage(messageText);
  };

  const onCardClick = async (cardText) => {
    if (loading) return;
    setInput(cardText); // Set the input to the card text
    await sendMessage(cardText); // Optionally send the message immediately
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const animation = requestAnimationFrame(() => {
      setTimeout(scrollToBottom, 100); // wait 100ms after frame paint
    });

    return () => cancelAnimationFrame(animation);
  }, [messages]);

  // Render message content based on its type and state
  const renderMessageContent = (msg) => {
    if (msg.isLoading || msg.content === "Thinking...") {
      return <Loading />;
    }

    if (msg.isError) {
      return <div className="text-red-500">{msg.content}</div>;
    }

    return (
      <div className="text-gray-800 p-1 sm:p-2 prose prose-sm">
        <ReactMarkdown>{msg.content}</ReactMarkdown>

        {msg.toolResults && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">Information sources used:</p>
            <ul className="text-xs text-gray-500 mt-1">
              {msg.toolResults.map((tool, idx) => (
                <li key={idx}>{tool.agent}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (currentConversationId) {
      console.log("Current chat ID:", currentConversationId);
    }
  }, [currentConversationId]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 rounded-lg">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}

      <div className="flex-grow flex flex-col min-h-0">
        {showWelcome ? (
          <div className="flex flex-col justify-center items-center flex-grow px-4 sm:px-6">
            <HomeUI onCardClick={onCardClick} />
          </div>
        ) : (
          <div className="flex flex-col flex-grow min-h-0 px-2 sm:px-4 md:px-10 lg:px-20">
            <div
              ref={chatContainerRef}
              className="flex-1 min-h-0 overflow-y-auto scroll-smooth w-full max-w-5xl mx-auto py-4 pr-2 pt-14"
              style={{ maxHeight: `calc(100vh - ${inputBarHeight}px - 32px)` }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`py-2 px-2 flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  {msg.role === "user" ? (
                    <div ref={userRef} className="flex flex-col items-end -mr-2 max-w-[90%] mb-2">
                      <div className="bg-gray-900 text-white py-2 px-4 rounded-xl rounded-tr-none">
                        <p className="whitespace-pre-line pr-2 text-sm sm:text-base">{msg.content}</p>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-400 mr-1 mt-1">
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-row gap-2 sm:gap-3 max-w-[95%] mb-2">
                      <div className="mt-0 flex-shrink-0">
                        <div className="bg-white p-2 sm:p-3 rounded-full">
                          <img src={Logo} alt="Logo" className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className={`bg-white p-2 rounded-xl rounded-tl-none shadow-sm ${msg.isError ? 'border border-red-300' : ''}`}>
                          {renderMessageContent(msg)}
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* INPUT BAR */}
      <div ref={inputBarRef} className="w-full py-3 sticky bottom-0 bg-gray-100 z-10">
        <form
          className="px-2 sm:px-4 flex items-center rounded-lg w-full max-w-5xl mx-auto"
          onSubmit={handleSend}
        >
          <div className="relative w-full">
            <input
              type="text"
              className="w-full h-14 sm:h-16 pr-16 sm:pr-20 pl-3 sm:pl-6 bg-white text-gray-900 text-sm sm:text-base border border-gray-300 rounded-lg outline-none placeholder:text-xs sm:placeholder:text-sm"
              placeholder="Send a message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              className={`absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 py-2 px-2
                text-white rounded-lg text-sm shadow outline-none transition-all duration-200 transform flex items-center justify-center
                ${loading ? 'bg-gray-400 cursor-not-allowed' : input.trim() === ''
                  ? 'bg-sky-300 opacity-90 cursor-default scale-95'
                  : 'bg-sky-400 hover:bg-sky-500 hover:scale-105 opacity-100 scale-100'}`}
              disabled={loading}
            >
              <div className="flex items-center gap-1">
                <IoIosArrowRoundUp className="w-7 h-7 font-bold" />
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;