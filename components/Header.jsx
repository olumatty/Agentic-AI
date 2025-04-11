import React from 'react'
import Logo from "../src/assets/star-inside-circle-svgrepo-com.svg"
import { BiMessageRoundedAdd } from "react-icons/bi";
import { useNavigate } from "react-router";

const Header = ({startNewChat}) => {
  let navigate = useNavigate();

  const handleLogin = () => {
    navigate("/signin");
  };

  const handleSignup = () => {
    navigate("/signup");
  };
    
  return (
    <div className="flex px-4 py-1 items-center justify-between">
      <div className='flex items-center gap-2'>
      <div className='flex items-center gap-2'>
        <button className='flex items-center gap-1 border cursor-pointer border-gray-300 py-2 px-3 rounded-xl'>
        <img src={Logo} alt="Logo" className="w-5 h-5" />
        <h1 className='font-medium text-[13px] text-gray-900'>Travel1.0</h1>
        </button>
      </div>
      <div className='p-3 flex items-center gap-2'>
        <button onClick ={startNewChat} className='flex items-center gap-1.5 border cursor-pointer border-transparent hover:bg-sky-500 bg-sky-400  py-2 px-3 rounded-xl'>
          <BiMessageRoundedAdd className='w-5 h-5' />
          <h1 className='text-[13px]'>New Chat</h1>
        </button>
      </div>
      </div>

      <div className='flex items-center'>
      <div className='p-3 flex items-center '>
        <button onClick={handleLogin} className='flex items-center  border cursor-pointer border-transparent hover:bg-sky-500 bg-sky-400  py-2 px-5 rounded-xl'>
          <h1 className='text-[13px] font-medium text-center'>Log in</h1>
        </button>
      </div>

      <div className='flex items-center'>
        <button onClick={handleSignup} className='flex items-center border cursor-pointer hover:bg-gray-100 border-gray-300 py-2 px-5 rounded-xl'>
        <h1 className='font-medium text-[13px] text-center text-gray-900'>Sign up</h1>
        </button>
      </div>

      </div>
      
    </div>
  )
}

export default Header
