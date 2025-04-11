import React from 'react'
import { useState } from 'react'
import { FaRegEye,FaRegEyeSlash } from "react-icons/fa";

const PasswordInput = ({value, onChange, placeholder}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
  return (
    <div className='flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3'>
        <input
            type={showPassword ? 'text' : 'password'}
            className='w-full h-10 border-none outline-none bg-transparent text-gray-900 text-sm py-3'
            value={value}
            onChange={onChange}
            placeholder={placeholder || 'Password'}
        />

        {showPassword ? (
          <FaRegEye
           onClick={() => togglePasswordVisibility}
           className='text-gray-800 cursor-pointer'
           size={20}
           />
        ) : (
            <FaRegEyeSlash
             onClick={() => togglePasswordVisibility}
             className='text-gray-800 cursor-pointer'
             size={20}
             />
        )}
    </div>
  )
}

export default PasswordInput
