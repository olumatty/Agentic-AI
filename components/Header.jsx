import React from 'react'
import Logo from "../src/assets/star-inside-circle-svgrepo-com.svg"
import { BiMessageRoundedAdd } from "react-icons/bi";

const Header = ({setShowWelcome}) => {

    const homePageShow = () => {
      setShowWelcome(true);
    }
  return (
    <div className="flex pt-3 px-5">
      <div className='flex items-center gap-2'>
        <button className='flex items-center gap-1 border cursor-pointer border-gray-300 py-2.5 px-4 rounded-xl'>
        <img src={Logo} alt="Logo" className="w-5 h-5" />
        <h1 className='font-medium text-gray-900'>Travel1.0</h1>
        </button>
      </div>
      <div className='p-3 flex items-center gap-2'>
        <button onClick ={homePageShow} className='flex items-center gap-1.5 border cursor-pointer border-transparent bg-sky-400  py-2.5 px-4 rounded-xl'>
          <BiMessageRoundedAdd className='w-5 h-5' />
          <h1 className=''>New Chat</h1>
        </button>
      </div>
    </div>
  )
}

export default Header
