import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaTrophy, FaRocket, FaShieldAlt, FaHeart } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { Link } from "react-router-dom";

const AboutHero = () => {
  return (
    <section className="relative pt-6 pb-10 px-4 text-center max-w-5xl mx-auto">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-400/20 via-pink-500/20 to-purple-600/20 blur-3xl rounded-full pointer-events-none" />

      {/* Floating Header Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-purple-500/10 border border-amber-300/40 dark:border-purple-500/40 backdrop-blur-md mb-6 shadow-sm"
      >
        <HiSparkles className="text-amber-500 animate-pulse text-sm" />
        <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-600 via-pink-600 to-purple-600 dark:from-amber-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
          Welcome to WhisperPulse • Social Platform & Gallery
        </span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-tight"
      >
        Share Stories. Express Art. <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Celebrate Creativity.
        </span>
      </motion.h1>

      {/* Short & Punchy Subtitle (Not bloated!) */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-4 text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed"
      >
        WhisperPulse is a high-vibe social feed for sharing confessions, artwork, and real moments with privacy and pure joy.
      </motion.p>

      {/* Visual Feature Badges */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-wrap justify-center gap-3 mt-8"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-sm text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200">
          <FaRocket className="text-amber-500" /> Blazing Fast
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-sm text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200">
          <FaShieldAlt className="text-purple-500" /> Safe & Anonymous
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-sm text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200">
          <FaHeart className="text-pink-500" /> Built with Love
        </div>
        <Link 
          to="/feed/leaderboard"
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md shadow-amber-500/20 text-xs sm:text-sm font-extrabold hover:scale-105 transition-transform"
        >
          <FaTrophy className="text-white" /> View Leaderboard
        </Link>
      </motion.div>

      {/* Social Links & Creator Pill */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 flex items-center justify-center gap-4"
      >
        <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Crafted by Unnati Chauhan</span>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/unnatii17"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-amber-500 hover:text-white transition-colors"
          >
            <FaGithub size={16} />
          </a>
          <a
            href="https://www.linkedin.com/in/unnati-chauhan17"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-600 hover:text-white transition-colors"
          >
            <FaLinkedin size={16} />
          </a>
          <a
            href="mailto:unnati7200@gmail.com"
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-pink-500 hover:text-white transition-colors"
          >
            <FaEnvelope size={16} />
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutHero;