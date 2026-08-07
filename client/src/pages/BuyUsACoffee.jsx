import React, { Suspense } from 'react';
import Loader from '../components/common/Loader';
import coffeeCup from "../assets/coffeeCup.gif";
import { FaHeart, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const BuyUsACoffee = () => {
  return (
    <Suspense fallback={<Loader/>}>
      <div className='text-black dark:text-white max-w-4xl mx-auto py-10 px-4'>
        <div className='flex my-6 text-amber-500 items-center justify-center gap-4'>
          <h1 className='text-4xl font-extrabold tracking-wide bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent'>
            Support Unnati & WhisperPulse
          </h1>
          <img src={coffeeCup} alt="coffeecup" className='w-12 h-12 animate-bounce'/>
        </div>

        <div className='bg-white/70 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center gap-8'>
          <div className='w-full md:w-1/2 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 rounded-xl border border-amber-500/30'>
            <img  
              alt="Support QR Code" 
              className='w-64 rounded-xl shadow-lg border-2 border-amber-400 transform hover:scale-105 transition-transform duration-300'
            />
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-3 font-mono'>Scan to buy Unnati a coffee ☕</p>
          </div>

          <div className='w-full md:w-1/2 flex flex-col justify-between text-left space-y-4'>
            <h2 className='text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2'>
              Fuel Creativity & Code <FaHeart className="text-red-500" />
            </h2>
            <p className='text-gray-600 dark:text-gray-300 text-base leading-relaxed'>
              Hi! I'm <span className="font-bold text-amber-500 dark:text-amber-400">Unnati Chauhan</span>, creator and developer of WhisperPulse. 
              Your virtual coffee contributions directly support server costs, continuous feature releases, and keeping WhisperPulse clean, ad-free, and delightful for everyone!
            </p>

            <div className='pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-3'>
              <span className='font-semibold text-amber-500 text-lg'>Connect with Unnati:</span>
              <div className='flex items-center gap-4 text-2xl'>
                <a href="https://github.com/unnatii17" target="_blank" rel="noreferrer" className='text-gray-700 dark:text-gray-300 hover:text-purple-500 transition-colors'>
                  <FaGithub />
                </a>
                <a href="https://www.linkedin.com/in/unnati-chauhan17" target="_blank" rel="noreferrer" className='text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors'>
                  <FaLinkedin />
                </a>
                <a href="mailto:unnati7200@gmail.com" className='text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors'>
                  <FaEnvelope />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default BuyUsACoffee;