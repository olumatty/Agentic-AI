import { useEffect, useState, useRef } from "react";
import React from "react";
import { IoIosArrowRoundUp } from "react-icons/io";
import ReactMarkdown from "react-markdown";
import Loading from "../components/Loading";
import HomeUI from "./HomeUI";
import Logo from "../src/assets/star-inside-circle-svgrepo-com.svg";
import {useAuth} from '../context/authContext.jsx'; 
import { useParams } from 'react-router-dom'; // Import useParams

const Chatbot = ({ showWelcome, setShowWelcome, messages, setMessages, currentChatId, setCurrentChatId }) => {
  const [input, setInput] = useState("");
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

  useEffect(() => {
    if (inputBarRef.current) {
      setInputBarHeight(inputBarRef.current.offsetHeight);
    }
  }, []);


  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/get-chat-history?userId=${user?.id || userIdFromUrl || ''}`); // Send userId for history
        if (response.ok) {
          const history = await response.json();
          // Make sure all messages have timestamps
          console.log("Chat history received:", history);
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
        if (history.length > 0 && history[0]?.chatId) {
          setCurrentChatId(history[0].chatId);
          localStorage.setItem('chatId', history[0].chatId);
        } else if (history.length === 0) {
          setCurrentChatId(null); // Or some default value
          localStorage.removeItem('chatId');
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [setMessages, setShowWelcome, user?.id, userIdFromUrl, API_URL, setCurrentChatId]); // Depend on user?.id and userIdFromUrl

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

    const currentUserId = user?.id || userIdFromUrl || '';
    const sessionIdFromStorage = localStorage.getItem('sessionId');
    let sessionCreatedAt = localStorage.getItem('sessionCreatedAt');

    // Session expiration check
    if (sessionCreatedAt) {
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

    const headers = {
      "Content-Type": "application/json",
      'user-id': currentUserId,
      'x-user-openai-key': localStorage.getItem('apiKeys') || '',
    };
    if (sessionIdFromStorage) {
      headers['session-id'] = sessionIdFromStorage;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/mother`, {
        method: "POST",
        headers: headers,
        withCredentials: true,
        body: JSON.stringify({
          messages: [...messages.filter(m => !m.isLoading), userMessage]
        }),
      });
      console.log("Messages being sent:", [...messages.filter(m => !m.isLoading), userMessage]);

      if (response.status === 429) {
        setMessages(prev => [
          ...prev.slice(0, -1),
          {
            role: "assistant",
            content: data?.content || "You've hit the rate limit. Add your own API key by using the settings button or wait before trying again.",
            timestamp: new Date().toISOString(),
            isError: true
          },
        ]);
        return;
      }

      const data = await response.json();
      console.log("Data received:", data);

      // Store sessionId in localStorage if received and not already present
      if (data.sessionId && !sessionIdFromStorage) {
        localStorage.setItem('sessionId', data.sessionId);
        localStorage.setItem('sessionCreatedAt', new Date().toISOString());
      }

      if(data.chatId){
        setCurrentChatId(data.chatId);
        localStorage.setItem('chatId', data.chatId);
      }

      // Replace thinking message with real response
      setMessages(prev => {
        const newMessages = [...prev.slice(0, -1), {
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toISOString(),
          toolResults: data.toolResults,
          chatId: data.chatId
        }];
        return newMessages;
      });

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
    if (currentChatId) {
      console.log("Current chat ID:", currentChatId);
    }
  }, [currentChatId]);

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