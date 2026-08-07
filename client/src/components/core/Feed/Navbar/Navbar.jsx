import React, { useEffect } from 'react';
import logo from "../../../../assets/confettiNoText.png";
import { Link } from 'react-router-dom';
import { MdDarkMode } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../../../../slices/themeSlice';
import UserDetails from './UserDetails';
import Notification from './Notification';
import { AiFillSun } from "react-icons/ai";
import { motion } from 'framer-motion';

const Navbar = () => {
  const user = useSelector((state) => state.profile.user);
  const dispatch = useDispatch();
  const darkMode = useSelector(state => state.theme.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggle = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur-lg bg-amber-50/90 dark:bg-gray-900/90 text-gray-900 dark:text-white border-b border-amber-200/50 dark:border-gray-800 shadow-sm transition-all duration-300">
      <div className="max-w-7xl flex h-16 items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Brand Title */}
        <Link to="/feed" className="flex items-center gap-3 group">
          <motion.img 
            whileHover={{ rotate: 12, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            src={logo} 
            className="h-10 w-auto object-contain" 
            alt="WhisperPulse Logo" 
          />
          <span className="text-2xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
            WhisperPulse
          </span>
        </Link>  

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <Notification />

          {/* Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggle}
            className="p-2 rounded-full bg-amber-200/50 dark:bg-gray-800 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-gray-700 transition-colors shadow-inner"
            aria-label="Toggle theme"
          >
            {!darkMode ? (
              <MdDarkMode className="text-xl" />
            ) : (
              <AiFillSun className="text-xl text-yellow-400 animate-spin-slow" />
            )}
          </motion.button>

          {/* User Details Dropdown */}
          <UserDetails {...user} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;