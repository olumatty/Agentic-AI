import { useEffect, useState, useRef} from "react";
import React  from "react";
import { BsSend } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import Loading from "../components/Loading";
import HomeUI from "./HomeUI";

const Chatbot = ({showWelcome, setShowWelcome, messages, setMessages}) => {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    

    const userRef = useRef();

    const handleSend = async (e) => { 
      e.preventDefault();
      setShowWelcome(false);

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
    const onCardClick = async (cardText) => {
        const newUserMessage = {role:'user' , content: cardText};
        setMessages((prev) => [...prev, newUserMessage]);
        setShowWelcome(false);

        const aiThinking = {role:'assistant', content: 'Thinking...'};
        setMessages((prev) => [...prev, aiThinking]);

        try {
            const response = await fetch("http://localhost:8000/mother", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ messages: [...messages, newUserMessage] }),
            });

            if (!response.ok) {
              throw new Error("An error occurred");
            }

            const data = await response.json();

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
            userRef.current?.scrollIntoView({behavior: 'smooth',});
          }
    };

    const formatTime = (date) => {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    useEffect(() => {
        if (userRef.current) {
          userRef.current.scrollTo({
            top: userRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, [messages]);

      return (
        <div className="flex flex-col h-screen bg-gray-100 rounded-lg rounded-b-lg">
          <div className="flex-grow flex flex-col">
        {showWelcome && (
          <div className="flex flex-col justify-center items-center flex-grow">
            <HomeUI onCardClick={onCardClick}/>
          </div>
        )}

        {!showWelcome && (
          <div className="main flex flex-col items-center w-full h-full px-4 sm:px-8 lg:px-20 mt-4 flex-grow overflow-hidden">
            <div
              className="chats overflow-y-auto scroll-smooth w-full max-w-4xl mx-auto"
              style={{
                height: `calc(100vh - ${60}px - ${80}px - ${20}px)`, 
              }}
              ref={userRef}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`m-2 py-2 px-4 flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`flex items-center gap-3 ${
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className="bg-blue-500 text-white rounded-full px-3 py-1 text-sm">
                      {msg.role === 'user' ? 'You' : 'TA'}
                    </div>
                    {msg.content === 'Thinking...' ? (
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
              <div ref={userRef} /> {/* Empty div to scroll to */}
            </div>
          </div>
        )}
      </div>

      <div className="w-full py-4 fixed bottom-0  md:left-0 md:right-0 mb-6 ">
          <form
            className="p-2 pl-4 md:pl-0 flex tems-center rounded-lg w-full md:w-[80%] mx-auto"
            onSubmit={handleSend}
          >
            <div className="relative w-full">
              <input
                type="text"
                className="w-full h-16 pr-16 sm:pr-20 pl-3 sm:pl-6 bg-white text-gray-900 text-xs sm:text-base border border-gray-200 rounded-lg
                outline-none placeholder:text-[12px] sm:placeholder:text-[14px]"
                placeholder="Send a message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-12 top-1/2 -translate-y-1/2 py-2.5 px-4 mr-4 bg-sky-400 text-white rounded-lg text-[14px] shadow outline-none
                transition-transform transform hover:scale-105 hover:bg-sky-500 flex items-center justify-center"
              >
                <div className="flex items-center gap-2">
                <BsSend className="w-4 h-4 " /> 
                <p className="font-medium hidden md:block">Send</p>
                </div>

              </button>
            </div>
          </form>
        </div>
    </div>
      );
}


export default Chatbot
