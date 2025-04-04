import { useEffect, useState, useRef} from "react";
import React  from "react";
import { BsSend } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import Loading from "../components/Loading";


const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const userRef = useRef();

    const handleSend = async (e) => {
      e.preventDefault();

      if (input.trim() === "" || loading) return;

      const userMessage = { role: "user", content: input };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setLoading(true);
      
        setMessages((prev)=> [
          ...prev, 
          {role:"assistant", content:"Thinking..."}
        ])
      
      try {
        const response = await fetch("http://localhost:8000/mother",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: [...messages, userMessage] }),
        });

        if (!response.ok) {
          throw new Error("An error occurred");
        }

        const data = await response.json();

        setMessages((prev) => [
          ...prev.slice(0,-1),
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

    const formatTime = (date) => {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    useEffect(() => {
      userRef.current.scrollTo({
        top: userRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, [messages]);

  return (
    <div className="flex flex-col min-h-screen bg-[#1E1E21]">
        <div className="flex flex-col justify-center items-center mt-12">
         
        </div>

        <div className="main flex flex-col items-center w-full px-4 sm:px-8 lg:px-20 mt-10">
            <div className="chats overflow-y-scroll scroll-smooth h-[calc(100vh-272px)] w-full max-w-4xl mx-auto" ref={userRef}>
                {messages.map((msg, index) => (
                <div 
                    key={index} 
                    className={`m-2 py-2 px-4 flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                    <div className={`flex items-center gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className="bg-blue-500 text-white rounded-full px-3 py-1 text-sm">
                        {msg.role === "user" ? "You" : "AI"}
                    </div>
                    {msg.content === "Thinking..." ? (
                        <Loading />
                    ) : (
                        <p className="text-white text-sm sm:text-base bg-gray-700 p-3 rounded-lg max-w-[80%]">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </p>
                    )}
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                    {formatTime(new Date())}
                    </p>
                </div>
                ))}
            </div>

          <div className="mt-auto w-full flex flex-col items-center justify-center">
            <form 
              className="p-2 flex items-center rounded-lg w-[80%] mx-auto gap-3"
              onSubmit={handleSend}
            >
              <input
                type="text"
                className="flex-1 h-16 px-3 sm:px-6 text-xs sm:text-base border border-gray-300 rounded-lg 
                    focus:ring-2 focus:ring-gray-400 outline-none placeholder:text-[12px] sm:placeholder:text-[14px]"
                placeholder="Send a message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                className="py-2 px-6 h-16 sm:py-3 sm:px-6 bg-gray-700 text-white rounded-lg shadow outline-none 
                    transition-transform transform hover:scale-105 hover:bg-gray-600 flex items-center justify-center"
                onClick={handleSend}
              >
                <BsSend className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </form>
          </div>  
        </div>
  </div>
  )
}

export default Chatbot
