import React from 'react'
import { useState } from 'react'
import PasswordInput from '../components/PasswordInput'
import { validateEmail } from '../util/Helper'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Logo from "../src/assets/star-inside-circle-svgrepo-com.svg";
import { useAuth } from '../context/authContext.jsx';

const SignIn = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { login } = useAuth(); 

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if(!password) {
            setError('Please enter a password.');
            return;
        }
        setError('');

        try {
            const response = await axios.post('http://localhost:8000/api/v1/auth/login', {
                email,
                password
            },{
                withCredentials: true,
            });
            
            if (response.status === 200 && response.data.userId) {
                // Store only userId, username, and email
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('email', response.data.email);
                
                login(response.data); // Pass the entire user data object
                console.log("Login successful:", response.data);
                navigate(`/`);
            }
        
        } catch (err) {
            if (err.response) {
                if (err.response.status === 400) {
                    setError("Invalid email or password.");
                } else {
                    setError("An error occurred: " + (err.response.data.message || "Please try again later."));
                }
            } else {
                setError("Network error. Please check your connection.");
            }
            console.error("Login error:", err);
        }        
    };
  return (
    <div className='p-4 bg-white'>
        <div className='flex items-center gap-2'>
                <button className='flex items-center gap-1 border cursor-pointer border-gray-300 py-2 px-3 rounded-xl'>
                <img src={Logo} alt="Logo" className="w-5 h-5" />
                <h1 className='font-medium text-[13px] text-gray-900'>Travel1.0</h1>
                </button>
        </div>

        <div className='flex h-screen flex-col  transition-all duration-300 items-center justify-center'>
            <div className='w-full max-w-md bg-gray-100 p-8 rounded-xl shadow-md border border-gray-100'>
                <h1 className='text-2xl font-semibold text-gray-800 mb-6 text-center'>Log in</h1>
                <form onSubmit={handleLogin} className='space-y-4'>
                    <div>
                        <label htmlFor='email' className='block text-gray-700 text-sm font-medium mb-2'>Email</label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full text-sm bg-white border border-gray-300 placeholder:text-[12px] placeholder:text-gray-400 text-gray-900 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500'
                            placeholder='Enter your email'
                        />
                    </div>
                    
                    <div>
                        <label htmlFor='password' className='block text-gray-700 text-sm font-medium mb-2'>Password</label>
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Enter your password'
                            className='w-full text-sm bg-gray-100 border border-gray-300 placeholder:text-gray-900 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 flex items-center'
                        />
                    </div>
                    {error && <div className='text-red-500 text-sm font-medium'>{error}</div>}
                    <button
                        type='submit'
                        className='w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-md transition duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1'
                    >
                        Log in
                    </button>
                    <div className='text-sm text-gray-600 mt-4 text-center'>
                        Don't have an account?
                        <span className='text-sky-500 hover:underline cursor-pointer ml-2 font-medium' onClick={() => navigate('/signup')}>
                            Sign up
                        </span>
                    </div>
                </form>
            </div>
        </div>
    </div>
   
  )
}

export default SignIn
