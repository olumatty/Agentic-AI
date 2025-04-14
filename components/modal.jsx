import React, { useEffect } from 'react';
import { IoIosClose } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { useState, } from 'react';

const Modal = ({ onClose }) => {
    const [apiKey, setApiKey] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const storeKeys = localStorage.getItem('apiKeys');
        if (storeKeys) {
            setApiKey(JSON.parse(storeKeys));
            setIsSaved(true);
        }
    }, []);

    const handleInputChange = (e) => {
        setApiKey(e.target.value);
        setIsSaved(false);
    };

    const handleSave = () => {
        if (!apiKey) {
            alert('Please enter an API key.');
            return;
        }
        localStorage.setItem('apiKey', apiKey);
        setIsSaved(true);
    };

    const handleEdit = () => {
        setApiKey(localStorage.getItem('apiKey') || '');
        setIsSaved(false);
    };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white w-[90%] sm:w-[35%] h-auto rounded-lg shadow-lg animate-fadeIn">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex gap-2 items-center">
            <IoSettingsOutline size={24} className="text-gray-500 hover:text-gray-700 transition-colors" />
            <h1 className="text-[16px] font-semibold text-gray-800">Enter API key</h1>
          </div>
          <IoIosClose
            onClick={onClose}
            size={30}
            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          />
        </div>

        <div className='p-4 '>
          <p className="text-[14px] p-2.5 text-gray-500 mb-4 bg-[#1d7efd10] rounded-lg">
            Enter your OpenAI API key below to continue using the assistant if you reach the default usage limit.
            Your key will be stored locally in your browser and used only for this app.
          </p>

          <input
            type="text"
            className="w-full text-sm bg-white border border-gray-300 placeholder:text-[12px] placeholder:text-gray-400 text-gray-900 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="sk-..."
            autoComplete="off"
            value={apiKey}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                // Handle Enter key press
                console.log('API Key:', apiKey);
              }
            }}
          />

          <div className="flex justify-end gap-2 mt-6">
          <button
              onClick={handleSave}
              disabled={!apiKey || isSaved}
              className={`${
                !apiKey || isSaved
                  ? "bg-sky-200 text-white cursor-not-allowed"
                  : "bg-sky-500 hover:bg-sky-600 text-white"
              } font-semibold py-2 px-4 rounded-md transition duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1`}
            >
              Save
            </button>
            <button
              onClick={handleEdit}
              disabled={!isSaved}
              className={`${
                !isSaved
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              } font-semibold py-2 px-4 rounded-md transition duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1`}
            >
                Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
