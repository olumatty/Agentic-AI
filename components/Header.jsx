import React from 'react'
import { LuStarHalf } from "react-icons/lu";

const Header = ({setShowWelcome}) => {

    const homePageShow = () => {
      setShowWelcome(true);
    }
  return (
    <div className="text-white flex justify-between border-b border-gray-700 ">
      <div className='  p-3 '>
        <button onClick ={homePageShow} className='flex items-center gap-1 border cursor-pointer border-gray-700 py-2 px-3 rounded-md'>
        <LuStarHalf className='w-5 h-5' />
        <h1 className='font-medium text-gray-300'>Travel1.0</h1>
        </button>
      
      </div>
    </div>
  )
}

export default Header
