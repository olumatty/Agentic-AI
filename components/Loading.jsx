import React from 'react'

const Loading = () => {
  return (
    <div className='bg-gray-700 text-white text-sm sm:text-base p-3 rounded-lg max-w-[80%]'>
        <div className='typing-bubble flex gap-1'>
            <div className='dot w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-0'></div>
            <div className='dot w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150'></div>
            <div className='dot w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300'></div>
        </div>
    </div>
  )
}

export default Loading
