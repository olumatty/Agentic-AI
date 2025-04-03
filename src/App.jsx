import React, {} from "react";
import { BsSend } from "react-icons/bs";

const App = () => {

  return (
    <div className="flex flex-col min-h-screen">
      <div className="main flex flex-col items-center my-[96px] mx-[160px]">
      <div className="chats">
      <div className="chat flex gap-2">
        <div className="bg-blue-500 rounded-full"> <p className="py-1.5 px-2">You</p> </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      <div className="chat flex gap-2 items-center">
        <div className="bg-blue-500 rounded-full"> <p className="py-1.5 px-3"> AI </p> </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
     </div>


     <div className="mt-auto w-[100%] flex flex-col items-center justify-center ">
      <form className="flex mt-2 items-center gap-2 sm:gap-3">
          <input
            type="text"
            className="flex-1 h-10 sm:h-14 px-3 sm:px-6 text-xs sm:text-base border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-blue-400 outline-none placeholder:text-[12px] sm:placeholder:text-[14px]"
            placeholder="Send a message"
          />
          <button
            className="p-2 sm:py-3 sm:px-4 bg-blue-500 text-white rounded-lg shadow outline-none 
                transition-transform transform hover:scale-105 hover:bg-blue-600 flex items-center justify-center"
          >
            <BsSend className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </form>
     </div>
      </div>
    

    </div>
  );
};

export default App;