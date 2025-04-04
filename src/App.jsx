import React from 'react'
import Sidebar from '../components/sidebar'
import Chatbot from '../components/Chatbot'
import Header from '../components/Header'

const App = () => {
  return (
    <div className='flex h-screen'>
      <Sidebar />
      <div className='flex flex-1 flex-col bg-[#1E1E21] ml-16 md:ml-28 lg:ml-64 transition-all duration-300'>
        <Header/>
        <Chatbot />
      </div>
    </div>
  )
}

export default App
