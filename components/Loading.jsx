import React from 'react'
import  Logo from "../src/assets/star-inside-circle-svgrepo-com.svg"

const Loading = () => {
  return (
    <div className=' text-white text-sm sm:text-base p-3 rounded-lg max-w-[80%]'>
        <div className='flex items-center gap-1'>
          <img src ={Logo} alt='Logo' className='w-5 h-5 animate-bounce' />
        </div>
    </div>
  )
}

export default Loading
