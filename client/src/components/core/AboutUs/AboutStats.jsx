import React from "react";
import { motion } from "framer-motion";
import {
  FaCode,
  FaUsers,
  FaRocket,
  FaTrophy,
  FaHeart,
} from "react-icons/fa";

const AboutStats = () => {
  const stats = [
    {
      icon: <FaCode className="text-blue-500 text-xl" />,
      value: "10K+",
      label: "Lines of Code",
      gradient: "from-blue-500/10 to-cyan-500/10",
      border: "border-blue-500/20",
    },
    {
      icon: <FaUsers className="text-purple-500 text-xl" />,
      value: "1,000+",
      label: "Active Members",
      gradient: "from-purple-500/10 to-pink-500/10",
      border: "border-purple-500/20",
    },
    {
      icon: <FaHeart className="text-pink-500 text-xl" />,
      value: "5,000+",
      label: "Confessions Shared",
      gradient: "from-pink-500/10 to-rose-500/10",
      border: "border-pink-500/20",
    },
    {
      icon: <FaRocket className="text-amber-500 text-xl" />,
      value: "99.9%",
      label: "Platform Uptime",
      gradient: "from-amber-500/10 to-yellow-500/10",
      border: "border-amber-500/20",
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white font-semibold text-sm mb-4">
            <FaTrophy />
            Platform Metrics
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            WhisperPulse by Numbers
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className={`p-5 rounded-2xl bg-gradient-to-b ${stat.gradient} border ${stat.border} text-center flex flex-col items-center justify-center`}
            >
              <div className="mb-2 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                {stat.icon}
              </div>

              <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {stat.value}
              </div>

              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutStats;
