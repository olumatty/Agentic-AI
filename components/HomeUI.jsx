import React from 'react'
import { LuMessageCircle, LuPlane,LuHotel} from "react-icons/lu";


const HomeUI = ({onCardClick}) => {
  return (
    <div>
        <div className='mt-10 mb-5 flex flex-col items-center'> 
        <h1 className='bg text-4xl font-bold '>Hello there, Welcome to AI Flight Assistant</h1> 
        <h2 className='text-2xl font-semibold mt-3 text-[#97a7ca]'>How can I help you today?</h2>
    </div>

    <ul className='flex gap-6 mt-10 list-style-none overflow-x-0 scroollbar-w-none'>
        <button 
        className='flex-shrink-0 p-[18px] w-[228px] flex flex-col items-center rounded-[12px] bg-[#283045] cursor-pointer '
        onClick={() => onCardClick('What can you do for me?')}>
            <p>What can you do for me?</p>
            <div className='bg-[#101623] mt-8 flex items-end p-3 rounded-full'>
            <LuMessageCircle className=' text-[#1d7efd]' /> 
            </div>
        </button>

        <button 
        className='flex-shrink-0 p-[18px] w-[228px] flex flex-col items-center rounded-[12px] bg-[#283045] cursor-pointer'
        onClick={() => onCardClick('Can you help me find a flight ?')}>
            <p>Can you help me find a flight ?</p>
            <div className='bg-[#101623] mt-8 flex items-end p-3 rounded-full'>
            <LuPlane className='text-[#28a745]' />
            </div>
        </button>

        <button 
        className='flex-shrink-0 p-[18px] w-[228px] flex flex-col items-center rounded-[12px] bg-[#283045] cursor-pointer'
        onClick={() => onCardClick('Can you help me find a hotel ?')}>
            <p>Can you help me find a hotel ?</p>
            <div className='bg-[#101623] mt-8 flex items-end p-3 rounded-full'>
            <LuHotel className='text-[#6f42c1]' />
            </div>
        </button>   

    </ul>
    </div>

  )
}

export default HomeUI
