import React from 'react'

import Chatbot from '../components/Chatbot'
import Header from '../components/Header'

const App = () => {
  return (
    
      <div className='flex flex-1 h-screen flex-col bg-[#1E1E21] transition-all duration-300'>
        <Header/>
        <Chatbot />
      </div>
  )
}

export default App
