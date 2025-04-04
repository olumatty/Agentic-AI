import React, { useState } from 'react'
import { LuPanelLeftClose, LuPlane, LuHotel,LuMap,LuSquarePen    } from "react-icons/lu";
import { TbEdit } from "react-icons/tb";


const Sidebar = () => {
    const[isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(prev => !prev);
    }

return (
  <div className="w-16 md:w-28 lg:w-64 h-screen bg-[#151517] fixed left-0 top-0 transition-all duration-300 ease-in-out pt-3 shadow-md z-10">
    {/* Logo */}
    <div className="flex items-center md:px-3 justify-between text-gray-300 font-bold text-2xl">
    <LuPanelLeftClose onClick={toggleSidebar} className='cursor-pointer w-6 h-6'/>
    {!isOpen && <LuSquarePen className='w-5 h-5' />}
    </div>

    {!isOpen && (<div className='md:px-3'>
        <div className='flex flex-col items-center mt-8'>
        <h2 className="text-xl font-semibold text-gray-300">Travel Assistant</h2>
        </div>
    
    </div>
    )}
  </div>
  )
}

export default Sidebar
