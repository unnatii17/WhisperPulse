import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaHeart, FaTrophy, FaCoffee, FaImages } from "react-icons/fa";

const AboutCTA = () => {
  return (
    <section className="py-6 max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-pink-500/10 border border-amber-200 dark:border-gray-700 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="text-left max-w-md">
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
            Ready to Join the Fun? 🎉
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 font-medium">
            Explore the feed, share your confessions, or check your rank on the leaderboard!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/feed/leaderboard"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-extrabold text-xs sm:text-sm shadow-md hover:scale-105 transition-transform"
          >
            <FaTrophy /> Leaderboard
          </Link>
          <Link
            to="/feed/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 font-extrabold text-xs sm:text-sm shadow-sm hover:scale-105 transition-transform"
          >
            <FaImages /> Gallery
          </Link>
          <Link
            to="/feed/buy-us-coffee"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-pink-500 text-white font-extrabold text-xs sm:text-sm shadow-sm hover:scale-105 transition-transform"
          >
            <FaCoffee /> Coffee
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutCTA;