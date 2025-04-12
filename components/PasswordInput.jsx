import React from 'react'
import { useState } from 'react'
import { FaRegEye,FaRegEyeSlash } from "react-icons/fa";

const PasswordInput = ({value, onChange, placeholder}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
  return (
    <div className={`flex items-center bg-white border border-gray-300 px-4 py-3 rounded-md focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 transition duration-200 `}>
    <input
        type={showPassword ? 'text':'password'}
        className='w-full text-sm bg-transparent placeholder:text-gray-400 text-gray-900 border-none outline-none mr-18'
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'Password'}
    />
    <div onClick={togglePasswordVisibility} className='cursor-pointer text-gray-600 hover:text-gray-800 transition duration-200 '>
        {showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
    </div>
</div>
  )
}

export default PasswordInput
