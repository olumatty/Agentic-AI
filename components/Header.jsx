import React from 'react'
import { LuStarHalf } from "react-icons/lu";

const Header = () => {
  return (
    <div className="text-white flex justify-between border-b border-gray-700 ">
      <div className='  p-3 '>
        <div className='flex items-center gap-2 border border-gray-700 py-2 px-4 rounded-md'>
        <LuStarHalf className='w-5 h-5' />
        <h1 className='font-medium text-gray-300'>Travel1.0</h1>
        </div>
      
      </div>
    </div>
  )
}

export default Header
