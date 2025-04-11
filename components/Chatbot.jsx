import { useEffect, useState, useRef } from "react";
import React from "react";
import { BsSend } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import Loading from "../components/Loading";
import HomeUI from "./HomeUI";
import Logo from "../src/assets/star-inside-circle-svgrepo-com.svg";

const Chatbot = ({ showWelcome, setShowWelcome, messages, setMessages }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userRef = useRef(); 
  const messagesEndRef = useRef();
  const chatContainerRef = useRef(); 

  // Get the height of the input bar dynamically
  const inputBarRef = useRef(null);
  const [inputBarHeight, setInputBarHeight] = useState(0);

  // API URL - better to define as a constant or from environment
  const API_URL = "http://localhost:8000";

  useEffect(() => {
    if (inputBarRef.current) {
      setInputBarHeight(inputBarRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/get-chat-history`);
        if (response.ok) {
          const history = await response.json();
          // Make sure all messages have timestamps
          const historyWithTimestamps = history.map(msg => ({
            ...msg,
            timestamp: msg.timestamp || new Date().toISOString()
          }));
          setMessages(historyWithTimestamps);
          setShowWelcome(historyWithTimestamps.length === 0);
        } else {
          console.error("Failed to fetch chat history:", response.status);
          setError("Failed to load chat history");
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };
    
    fetchChatHistory();
  }, [setMessages, setShowWelcome]);

  const sendMessage = async (messageContent) => {
    const userMessage = { 
      role: "user", 
      content: messageContent, 
      timestamp: new Date().toISOString() 
    };

    setMessages(prev => [...prev, userMessage]);
    setShowWelcome(false);
    setLoading(true);
    
    // Show thinking message
    const thinkingMessage = { 
      role: "assistant", 
      content: "Thinking...", 
      timestamp: new Date().toISOString(),
      isLoading: true
    };
    setMessages(prev => [...prev, thinkingMessage]);

    let userId = localStorage.getItem('userId');
    let sessionId = localStorage.getItem('sessionId');
    let sessionCreatedAt = localStorage.getItem('sessionCreatedAt');

    if(sessionCreatedAt){
      const sessionAge = (new Date() - new Date(sessionCreatedAt)) / 1000;
      const sessionTimeout = 60 * 60; // 1 hour in seconds

      if (sessionAge > sessionTimeout) {
        console.error("Session has expired. Please refresh or start a new session.");
        setMessages(prev => [
          ...prev.slice(0, -1),
          { 
            role: "assistant", 
            content: "Your session has expired. Please refresh and start a new session.",
            timestamp: new Date().toISOString(),
            isError: true
          },
        ]);
        setLoading(false);
        return; // Prevent message sending if the session is expired
      }
    }

    // If sessionId exists, proceed
    if (!sessionId) {
      console.error("No session ID found. Please start a new session.");
      setMessages(prev => [
        ...prev.slice(0, -1),
        { 
          role: "assistant", 
          content: "Sorry, session not found. Please refresh and start a new session.",
          timestamp: new Date().toISOString(),
          isError: true
        },
      ]);
      setLoading(false);
      return; // Prevent the message from being sent if no session exists
    }


    try {
      const response = await fetch(`${API_URL}/mother`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'user-id': userId || '', 
          'session-id': sessionId || '' 
        },
        body: JSON.stringify({ 
          messages: [...messages.filter(m => !m.isLoading), userMessage] 
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      // Store session info
      if (data.userId) {
        localStorage.setItem('userId', data.userId);
      }
      
      if (data.sessionId) {
        localStorage.setItem('sessionId', data.sessionId);
        localStorage.setItem('sessionCreatedAt', new Date().toISOString());
      }

      // Replace thinking message with real response
      setMessages(prev => [
        ...prev.slice(0, -1),
        { 
          role: "assistant", 
          content: data.reply,
          timestamp: new Date().toISOString(),
          toolResults: data.toolResults
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { 
          role: "assistant", 
          content: "Sorry, something went wrong. Please try again later.",
          timestamp: new Date().toISOString(),
          isError: true
        },
      ]);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === "" || loading) return;
    
    const messageText = input.trim();
    setInput("");
    await sendMessage(messageText);
  };

  const onCardClick = async (cardText) => {
    if (loading) return;
    await sendMessage(cardText);
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
        
        {/* If there are tool results, we could render them here */}
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

  return (
    <div className="flex flex-col h-screen bg-gray-100 rounded-lg">
      {/* Show error banner if there's an error */}
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
              className={`absolute right-14 sm:right-14 top-1/2 -translate-y-1/2 py-2.5 px-4 
                ${loading ? 'bg-gray-400' : 'bg-sky-400 hover:bg-sky-500'} 
                text-white rounded-lg text-sm shadow outline-none transition-transform transform 
                hover:scale-105 flex items-center justify-center`}
              disabled={loading || input.trim() === ""}
            >
              <div className="flex items-center gap-2">
                <BsSend className="w-4 h-4" />
                <p className="font-medium hidden md:block">{loading ? 'Sending...' : 'Send'}</p>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;