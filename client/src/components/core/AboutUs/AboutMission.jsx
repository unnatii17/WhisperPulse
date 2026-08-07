import React from "react";
import { motion } from "framer-motion";
import { FaBullseye, FaEye, FaHeart, FaCode, FaUsers, FaLightbulb, FaLayerGroup } from "react-icons/fa";

const AboutMission = () => {
  const cards = [
    {
      icon: <FaBullseye className="text-2xl text-pink-500" />,
      title: "Our Mission",
      description: "Creating a positive digital sanctuary where genuine stories connect people meaningfully without toxic algorithms.",
      border: "border-pink-500/30",
      glow: "hover:shadow-pink-500/10"
    },
    {
      icon: <FaEye className="text-2xl text-purple-500" />,
      title: "Our Vision",
      description: "A world where self-expression is celebrated, artwork is rewarded, and privacy is respected by design.",
      border: "border-purple-500/30",
      glow: "hover:shadow-purple-500/10"
    },
    {
      icon: <FaLightbulb className="text-2xl text-amber-500" />,
      title: "Core Values",
      description: "Community first, total transparency, elegant design, and relentless commitment to clean engineering.",
      border: "border-amber-500/30",
      glow: "hover:shadow-amber-500/10"
    },
    {
      icon: <FaLayerGroup className="text-2xl text-indigo-500" />,
      title: "Tech Stack",
      description: "Powered by React, Redux, Node.js, Express, Firebase Firestore & Tailwind CSS for liquid-smooth performance.",
      border: "border-indigo-500/30",
      glow: "hover:shadow-indigo-500/10"
    }
  ];

  return (
    <section className="py-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
          Why WhisperPulse Exists ✨
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Designed with purpose, built with passion.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className={`p-6 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border ${card.border} shadow-lg transition-all duration-300 ${card.glow}`}
          >
            <div className="p-3 w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-700/60 flex items-center justify-center mb-4 border border-gray-100 dark:border-gray-600">
              {card.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {card.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AboutMission;