import React, { useState, useEffect, useRef } from 'react';
import Logo from "../src/assets/star-inside-circle-svgrepo-com.svg";
import { BiMessageRoundedAdd } from "react-icons/bi";
import { useNavigate } from "react-router";
import { IoIosMenu, IoIosClose} from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { useAuth } from '../context/authContext.jsx';
import Modal from './modal.jsx';

const Header = ({ startNewChat }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/signin");
    setIsMenuOpen(false);
  };

  const handleSignup = () => {
    navigate("/signup");
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('chatId');
    localStorage.removeItem('sessionCreatedAt');
    logout();
    setIsMenuOpen(false);
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutsideMenu = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutsideMenu);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMenu);
    };
  }, [isMenuOpen]);

  return (
    <div ref={menuRef}  className="flex p-4 items-center justify-between ">
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 border cursor-pointer border-gray-300 py-2 px-3 rounded-xl">
          <img src={Logo} alt="Logo" className="w-5 h-5" />
          <h1 className="font-medium text-[13px] text-gray-900">Travel1.0</h1>
        </button>
        <button 
          onClick={startNewChat} 
          className="flex items-center gap-1.5 border cursor-pointer border-transparent hover:bg-sky-500 bg-sky-400 py-2 px-3 rounded-xl transition-colors"
        >
          <BiMessageRoundedAdd className="w-5 h-5" />
          <h1 className="text-[13px]">New Chat</h1>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {!isAuthenticated ? (
          <>
            {/* Login / Signup for larger screens */}
            <div className="hidden sm:flex items-center gap-2">
              <button 
                onClick={handleLogin} 
                className="flex items-center border cursor-pointer border-transparent hover:bg-sky-500 bg-sky-400 py-2 px-5 rounded-xl transition-colors"
              >
                <h1 className="text-[13px] font-medium text-center">Log in</h1>
              </button>
              <button 
                onClick={handleSignup} 
                className="flex items-center border cursor-pointer hover:bg-gray-100 border-gray-300 py-2 px-5 rounded-xl transition-colors"
              >
                <h1 className="font-medium text-[13px] text-center text-gray-900">Sign up</h1>
              </button>
            </div>

            {/* Dropdown menu (mobile) */}
            <div className="relative block lg:hidden" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="flex items-center border cursor-pointer focus:outline-none"
              >
                <IoIosMenu className="w-6 h-6 text-gray-900" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-10 flex flex-col gap-2 p-3 w-48 bg-gray-100 rounded-lg shadow-md z-10">
                  <button 
                    onClick={() => setIsMenuOpen(false)} 
                    className="cursor-pointer text-gray-900 rounded-xl self-end"
                  >
                    <IoIosClose size={22} />
                  </button>
                  <button 
                    onClick={handleLogin} 
                    className="w-full flex items-center justify-center border cursor-pointer border-transparent hover:bg-sky-500 bg-sky-400 p-2 rounded-xl transition-colors"
                  >
                    <h1 className="text-[12px] font-medium text-center">Log in</h1>
                  </button>
                  <button 
                    onClick={handleSignup} 
                    className="w-full flex items-center justify-center border cursor-pointer hover:bg-gray-200 border-gray-300 p-2 rounded-xl transition-colors"
                  >
                    <h1 className="font-medium text-[12px] text-center text-gray-900">Sign up</h1>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className='flex items-center gap-2'>
            <button 
            onClick={handleLogout} 
            className="flex items-center border cursor-pointer hover:bg-gray-200 border-gray-300 py-2 px-5 rounded-xl transition-colors"
          >
            <h1 className="font-medium text-[13px] text-center text-gray-900">Logout</h1>
          </button>
            <div>
            <button  className="flex items-center  cursor-pointer  py-1.5 px-5 rounded-xl transition-colors">
              <IoSettingsOutline size={24} onClick={() => setShowModal(!showModal)} className='text-gray-500 hover:text-gray-700 transition-colors' />
            </button>
            {showModal && 
            <Modal onClose={() => setShowModal(false)} 
                setShowModal={setShowModal}

             />}
            </div>

          </div>
          
        )}
      </div>
    </div>
  );
};

export default Header;
