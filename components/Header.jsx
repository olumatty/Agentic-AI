import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router";
import { IoIosMenu, IoIosClose } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";
import { useAuth } from '../context/AuthContext.jsx';
import Modal from './Modal.jsx';

const Header = ({  setIsCollapsed, iscollapsed }) => {
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
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('conversation');
    logout();
    setIsMenuOpen(false);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!iscollapsed);
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
    <div className="flex px-4 py-2.5 items-center justify-between  border-gray-200">
      <div className="flex items-center gap-2">
        {/* Mobile Hamburger Menu */}
        <button 
          onClick={toggleSidebar} 
          className="md:hidden flex items-center text-gray-900 py-2 rounded-xl"
          aria-label="Toggle sidebar"
        >
          <IoIosMenu size={24} className="cursor-pointer" />
        </button>
        
        {/* Desktop Sidebar Toggle with dynamic icon */}
        <button 
          onClick={toggleSidebar}
          className="hidden md:flex items-center text-gray-900 py-2 px-3 rounded-xl cursor-pointer hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          {iscollapsed ? (
            <GoSidebarCollapse size={24} className="cursor-pointer" title="Collapse sidebar" />
          ) : (
            <GoSidebarExpand size={24} className="cursor-pointer" title="Expand sidebar" />
          )}
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
            <div className="relative block sm:hidden" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="flex px-2 sm:px-4 py-2.5 items-center justify-between cursor-pointer focus:outline-none"
              >
                {isMenuOpen ? (
                  <IoIosClose className="w-6 h-6 text-gray-900" />
                ) : (
                  <IoIosMenu className="w-6 h-6 text-gray-900" />
                )}
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
              <h1 className="font-medium text-[13px] cursor-pointer text-center text-gray-900">Logout</h1>
            </button>
            <div>
              <button className="flex items-center cursor-pointer py-1.5 px-5 rounded-xl transition-colors">
                <IoSettingsOutline size={24} onClick={() => setShowModal(!showModal)} className='text-gray-500 hover:text-gray-700 transition-colors' />
              </button>
              {showModal && 
                <Modal onClose={() => setShowModal(false)} setShowModal={setShowModal} />
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;