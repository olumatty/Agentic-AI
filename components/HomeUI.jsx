import React from 'react';
import { motion as FramerMotion  } from "framer-motion"
import { LuMessageCircle, LuPlane, LuHotel } from "react-icons/lu";

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
  const typingSpeed = 100;

  return (
    <div className="px-4 md:px-6">
    <FramerMotion.div
      initial="hidden"
      animate="visible"
      variants={slideIn}
      className="md:-mt-30 -mt-24 mb-5 flex flex-col items-center"
    >
      <h1 className="bg text-2xl md:text-3xl lg:text-4xl font-bold text-center">
        Hello there, Welcome to AI Flight Assistant
      </h1>
      <FramerMotion.h2
        initial={{ width: 0 }}
        animate={{ width: `${typeWriterText.length}ch` }}
        transition={{
          duration: (typingSpeed * typeWriterText.length) / 1000,
          ease: 'linear',
        }}
        className="text-lg md:text-xl lg:text-2xl font-semibold mt-3 text-[#97a7ca] text-center overflow-hidden whitespace-nowrap"
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
      className="flex flex-col md:flex-row gap-4 md:gap-6 mt-6 md:mt-10 w-full justify-center items-center"
    >
      <FramerMotion.button
        variants={buttonSlide}
        whileHover={{ scale: 1.05 }}
        className="w-full md:w-[228px] p-4 md:p-[18px] flex flex-col items-center hover:bg-[#202635] rounded-[12px] bg-[#283045] cursor-pointer"
        onClick={() => onCardClick('What can you do for me?')}
      >
        <p className="text-center">What can you do for me?</p>
        <div className="bg-[#101623] mt-4 md:mt-8 flex items-end p-3 rounded-full">
          <LuMessageCircle className="text-[#1d7efd]" />
        </div>
      </FramerMotion.button>

      <FramerMotion.button
        variants={buttonSlide}
        whileHover={{ scale: 1.05 }}
        className="w-full md:w-[228px] p-4 md:p-[18px] flex flex-col items-center hover:bg-[#202635] rounded-[12px] bg-[#283045] cursor-pointer"
        onClick={() => onCardClick('Can you help me find a flight ?')}
      >
        <p className="text-center">Can you help me find a flight ?</p>
        <div className="bg-[#101623] mt-4 md:mt-8 flex items-end p-3 rounded-full">
          <LuPlane className="text-[#28a745]" />
        </div>
      </FramerMotion.button>

      <FramerMotion.button
        variants={buttonSlide}
        whileHover={{ scale: 1.05 }}
        className="w-full md:w-[228px] p-4 md:p-[18px] flex flex-col items-center hover:bg-[#202635] rounded-[12px] bg-[#283045] cursor-pointer"
        onClick={() => onCardClick('Can you help me find a hotel ?')}
      >
        <p className="text-center">Can you help me find a hotel ?</p>
        <div className="bg-[#101623] mt-4 md:mt-8 flex items-end p-3 rounded-full">
          <LuHotel className="text-[#6f42c1]" />
        </div>
      </FramerMotion.button>
    </FramerMotion.div>
  </div>
  );
};

export default HomeUI;
