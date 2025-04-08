import React from 'react'

const Loading = () => {
  return (
    <div className=' text-white text-sm sm:text-base p-3 rounded-lg max-w-[80%]'>
        <div className='typing-bubble flex gap-1'>
            <div className='dot w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-0'></div>
            <div className='dot w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150'></div>
            <div className='dot w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300'></div>
            <div className='dot w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-400'></div>
            <div className='dot w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-500'></div>
            <div className='dot w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-600'></div>
        </div>
    </div>
  )
}

export default Loading
