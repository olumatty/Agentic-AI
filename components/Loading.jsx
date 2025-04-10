import React from 'react'
import  Logo from "../src/assets/star-inside-circle-svgrepo-com.svg"

const Loading = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-gray-700"></div>
    </div>
  )
}

export default Loading
