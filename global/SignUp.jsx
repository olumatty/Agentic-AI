import React from 'react'
import { useState } from 'react'
import PasswordInput from '../components/PasswordInput'
import { validateEmail } from '../util/Helper'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import Logo from "../src/assets/star-inside-circle-svgrepo-com (1).svg";


const SignUp = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault();

        setError('');

        if (!username) {
            setError('Please enter a username.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if(!password) {
            setError('Please enter a password.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('https://travelai-server.onrender.com/api/v1/auth/signup', {
                username,
                email,
                password
            });
            console.log('SIGNUP RESPONSE:', response.data);
        
            localStorage.setItem('userId', response.data.userId);
        
            if (response.status === 201) {
                console.log("Signup successful:", response.data);
                toast.success('Signup successful! Please log in.');
                navigate("/signin");
            }
        }catch (err) {
          if (err.response) {
              // Handle specific error codes from your backend
              if (err.response.status === 400 && err.response.data.message.includes('Username already exists')) {
                  setError("Username is already taken. Please choose another.");
              }
              else if (err.response.status === 400 && err.response.data.message.includes('Email already exists')) {
                  setError("Email is already registered. Please use another email or login.");
              }
              else {
                  setError(err.response.data.message || "Registration failed. Please try again.");
              }
          } else {
              setError("Network error. Please check your connection.");
          }
          console.error("Signup error:", err);
        } finally {
            setLoading(false);
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
                <h1 className='text-2xl font-semibold text-gray-800 mb-6 text-center'>Sign up</h1>
                <form onSubmit={handleSignup} className='space-y-4'>

                    <div>
                        <label htmlFor='Text' className='block text-gray-700 text-sm font-medium mb-2'>Username</label>
                        <input
                            type='text'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className='w-full text-sm bg-white border border-gray-300 placeholder:text-[12px] placeholder:text-gray-400 text-gray-900 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500'
                            placeholder='Enter your username'
                        />
                    </div>

                    <div>
                        <label htmlFor='email' className='block text-gray-700 text-sm font-medium mb-2'>Email</label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full text-sm bg-white border border-gray-300 placeholder:text-gray-400 placeholder:text-[12px] text-gray-900 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500'
                            placeholder='Enter your email'
                        />
                    </div>

                    <div>
                        <label htmlFor='password' className='block text-gray-700 text-sm font-medium mb-2'>Password</label>
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Enter your password'
                            className=''
                        />
                    </div>
                    {error && <div className='text-red-500 text-sm font-medium'>{error}</div>}
                    <button
                        type='submit'
                        className='w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-md transition duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1'
                    >
                        {loading ? 'Signing up...' : 'Sign up'}
                    </button>
                    <div className='text-sm text-gray-600 mt-4 text-center'>
                        Already have an account?
                        <span className='text-sky-500 hover:underline cursor-pointer ml-2 font-medium' onClick={() => navigate('/signin')}>
                            Log in
                        </span>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default SignUp;