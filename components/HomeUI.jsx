import React from 'react';
import { motion as FramerMotion  } from "framer-motion"
import { LuMessageCircle, LuPlane, LuHotel, LuStar } from "react-icons/lu";
import Logo from "../src/assets/star-inside-circle-svgrepo-com.svg";

const HomeUI = ({ onCardClick }) => {
  const slideIn = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 2.5, delay: 0.1, type: 'spring', bounce: 0.4, staggerChildren: 0.2 },
      
    },
  };

  const buttonSlide = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const typeWriterText = "How can I help you today?";
  const typingSpeed = 50;

  return (
    <div className="px-4 md:px-6">
    <FramerMotion.div
      initial="hidden"
      animate="visible"
      variants={slideIn}
      className="md:-mt-40 -mt-24 flex flex-col items-center"
    >
      
      <img src={Logo} alt="Logo" className="w-10 h-10 md:w-14 md:h-14 mb-2 md:mb-4" />

      <h1 className="text-[14px] md:text-xl text-center text-gray-400">
      Hi, there 👋
      </h1>
      <FramerMotion.h2
        initial={{ width: 0 }}
        animate={{ width: `${typeWriterText.length}ch` }}
        transition={{
          duration: (typingSpeed * typeWriterText.length) / 1000,
          ease: 'linear',
        }}
        className="text-2xl mt-1 md:mt-2 text-black text-center overflow-hidden whitespace-nowrap"
      >
        {typeWriterText}
      </FramerMotion.h2>
    </FramerMotion.div>

    <FramerMotion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
      className="flex flex-col md:flex-row gap-2 md:gap-4 mt-4 md:mt-10 w-full justify-center items-center"
    >
      {[
        {
          icon: <LuMessageCircle className="text-[#1d7efd]" />,
          text: 'What can you do for me? Tell me how you can assist with my trip.?',
          color: '#1d7efd10',
          onClickText: 'What can you do for me? Tell me how you can assist with my trip.?',
        },
        {
          icon: <LuPlane className="text-[#28a745]" />,
          text: 'Can you help me find a hotel? I need a comfortable place to stay.',
          color: '#28a74510',
          onClickText: 'Can you help me find a hotel? I need a comfortable place to stay.',
        },
        {
          icon: <LuHotel className="text-[#6f42c1]" />,
          text: 'Can you help me find a flight? I’m looking for the best options.',
          color: '#6f42c110',
          onClickText: 'Can you help me find a flight? I’m looking for the best options.',
        },
      ].map(({ icon, text, color, onClickText }, idx) => (
        <FramerMotion.button
          key={idx}
          variants={buttonSlide}
          whileHover={{ scale: 1.05 }}
          onClick={() => onCardClick(onClickText)}
          className="w-[80%] md:w-[232px] p-3 flex flex-col items-start justify-between rounded-[12px] bg-white border border-gray-200 cursor-pointer"
        >
          <div className={`border-gray-100 border-2 flex py-1.5 px-2 rounded-lg`}style={{backgroundColor: color}} >
            {icon}
          </div>
          <p className="mt-2 text-[13px] text-left text-gray-700">{text}</p>
        </FramerMotion.button>
      ))}
    </FramerMotion.div>
  </div>
  );
};

export default HomeUI;
