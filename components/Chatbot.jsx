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

  const userRef = useRef(); // Remains as you had it
  const messagesEndRef = useRef();
  const chatContainerRef = useRef(); // Ref for the scrollable container

  // Get the height of the input bar dynamically
  const inputBarRef = useRef(null);
  const [inputBarHeight, setInputBarHeight] = useState(0);

  let userId = localStorage.getItem('userId');
  let sessionId = localStorage.getItem('sessionId');

  useEffect(() => {
    if (inputBarRef.current) {
      setInputBarHeight(inputBarRef.current.offsetHeight);
    }
  }, []); // Run once after initial render

  const handleSend = async (e) => {
    e.preventDefault();
    setShowWelcome(false);

    if (input.trim() === "" || loading) return;

    const userMessage = { role: "user", content: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "Thinking..." }]);

    try {
      const response = await fetch("http://localhost:8000/mother", {
        method: "POST",
        headers: 
        { "Content-Type": "application/json", 'user-id': userId, 'session-id': sessionId },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error("An error occurred");

      const data = await response.json();

      if (data.userId) {
        userId = data.userId;
        localStorage.setItem('userId', userId);
      }
      
      if (data.sessionId) {
        sessionId = data.sessionId;
        localStorage.setItem('sessionId', sessionId);
      }

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onCardClick = async (cardText) => {
    const newUserMessage = { role: "user", content: cardText };
    setMessages((prev) => [...prev, newUserMessage]);
    setShowWelcome(false);

    const aiThinking = { role: "assistant", content: "Thinking..." };
    setMessages((prev) => [...prev, aiThinking]);

    try {
      const response = await fetch("http://localhost:8000/mother", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'user-id': userId, 'session-id': sessionId },
        body: JSON.stringify({ messages: [...messages, newUserMessage] }),
      });

      if (!response.ok) throw new Error("An error occurred");

      const data = await response.json();


      if (data.userId) {
        userId = data.userId;
        localStorage.setItem('userId', userId);
      }
      
      if (data.sessionId) {
        sessionId = data.sessionId;
        localStorage.setItem('sessionId', sessionId);
      }

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

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

  return (
    <div className="flex flex-col h-screen bg-gray-100 rounded-lg">
      <div className="flex-grow flex flex-col min-h-0">
        {showWelcome ? (
          <div className="flex flex-col justify-center items-center flex-grow">
            <HomeUI onCardClick={onCardClick} />
          </div>
        ) : (
          <div className="flex flex-col flex-grow min-h-0 px-4 sm:px-8 lg:px-20">
            <div
              ref={chatContainerRef}
              className="flex-1 min-h-0 overflow-y-auto scroll-smooth w-full max-w-4xl mx-auto py-4 pr-5 pt-14"
              style={{
                maxHeight: `calc(100vh - ${inputBarHeight}px - 32px)`, // Adjust 32px for padding/margins
              }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`py-2 px-4 flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  {msg.role === "user" ? (
                    <div ref={userRef} className="flex flex-col items-end -mr-4 max-w-[80%] mb-2">
                      <div className="bg-gray-900 text-white py-2 px-4 rounded-xl rounded-tr-none">
                        <p className="whitespace-pre-line pr-2">{msg.content}</p>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-400 mr-1 mt-1">
                        {formatTime(new Date())}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-row gap-3 max-w-[90%] mb-2">
                      <div className="mt-0 flex-shrink-0">
                        <div className="bg-white p-3 rounded-full">
                          <img src={Logo} alt="Logo" className="w-7 h-7" />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="bg-white p-2 rounded-xl rounded-tl-none shadow-sm">
                          {msg.content === "Thinking..." ? (
                            <Loading />
                          ) : (
                            <div className="text-gray-800 p-2 prose prose-sm">
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                          {formatTime(new Date())}
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
      <div ref={inputBarRef} className="w-full py-4 sticky bottom-0 bg-gray-100 z-10">
        <form
          className="p-2 pl-4 md:pl-0 flex items-center rounded-lg w-full md:w-[80%] mx-auto"
          onSubmit={handleSend}
        >
          <div className="relative w-full">
            <input
              type="text"
              className="w-full h-16 pr-16 sm:pr-20 pl-3 sm:pl-6 bg-white text-gray-900 text-xs sm:text-base border border-gray-200 rounded-lg outline-none placeholder:text-[12px] sm:placeholder:text-[14px]"
              placeholder="Send a message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-12 top-1/2 -translate-y-1/2 py-2.5 px-4 mr-4 bg-sky-400 text-white rounded-lg text-[14px] shadow outline-none transition-transform transform hover:scale-105 hover:bg-sky-500 flex items-center justify-center"
            >
              <div className="flex items-center gap-2">
                <BsSend className="w-4 h-4" />
                <p className="font-medium hidden md:block">Send</p>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;