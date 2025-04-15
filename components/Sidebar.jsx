import React from 'react';
import { BsPencilSquare } from "react-icons/bs";
import Logo from "../src/assets/star-inside-circle-svgrepo-com.svg";

const Sidebar = () => {
    const database = [
        {
            id: 1,
            historyName: "Debugging code Errors",
        },
        {
            id: 2,
            historyName: "High Converting Financial Landing Page",
        },
        {
            id: 3,
            historyName: "Travelling to Dubai",
        }
    ];

    return (
        <div className='flex flex-col h-screen border-r border-gray-300 
                        w-[20%] md:w-[15%] lg:w-[12%] min-w-[60px] bg-white'>

            {/* Header */}
            <div className='border-b border-gray-300 py-3.5 px-4 flex items-center justify-between'>
                <h1 className='text-[14px] font-medium text-gray-800 hidden md:block'>Conversation</h1>
                <BsPencilSquare size={16} className='text-gray-500 hover:text-gray-700 transition-colors cursor-pointer' />
            </div>

            {/* Recent */}
            <div className='flex flex-col p-3 overflow-y-auto'>
                <p className='text-gray-400 text-[12px] px-1 font-medium hidden md:block'>Recent</p>

                {database.map((item, key) => (
                    <div
                        key={key}
                        className='flex items-center gap-3 text-gray-600 cursor-pointer mt-3 
                                   hover:bg-gray-100 hover:text-gray-900 rounded-lg p-1.5 transition-colors duration-200'
                    >
                        <p className='text-[12px] truncate hidden md:block'>
                            {item.historyName}
                        </p>
                        <div className='md:hidden w-2 h-2 bg-gray-400 rounded-full'></div>
                    </div>
                ))}
            </div>

            {/* Logo Button */}
            <button className="flex items-center justify-center mt-auto mx-auto gap-1 border mb-8 
                               cursor-pointer w-[90%] border-gray-300 py-2 px-3 rounded-xl">
                <img src={Logo} alt="Logo" className="w-5 h-5" />
                <h1 className="font-medium text-[13px] text-gray-900 hidden md:block">Travel1.0</h1>
            </button>
        </div>
    );
};

export default Sidebar;
