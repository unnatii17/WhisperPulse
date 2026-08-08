import React, { memo } from "react";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaCode,
  FaAward,
} from "react-icons/fa";
import { TbMailFilled } from "react-icons/tb";

const OurInfo = memo(function OurInfo(props) {
  const skills = [
    "React.js",
    "Redux",
    "Node.js",
    "Express",
    "Firebase",
    "Tailwind CSS",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl border border-amber-200/60 dark:border-gray-700 shadow-xl relative overflow-hidden text-center"
    >
      {/* Avatar */}
      <div className="relative inline-block mb-4">
        <motion.img
          whileHover={{ scale: 1.05, rotate: 3 }}
          src={props?.image || "https://github.com/unnatii17.png"}
          alt={props?.name}
          className="w-24 h-24 rounded-full mx-auto border-4 border-amber-400 dark:border-amber-500 shadow-lg object-cover"
        />

        <div className="absolute -bottom-2 -right-2 p-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full text-xs shadow">
          <FaCode />
        </div>
      </div>

      <h3 className="text-2xl font-black text-gray-900 dark:text-white">
        {props?.name || "Unnati Chauhan"}
      </h3>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold mt-2">
        <FaAward className="text-amber-500" />
        Full-Stack Engineer & Creator
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 max-w-md mx-auto leading-relaxed">
        {props?.description ||
          "Building WhisperPulse with clean architecture, fluid animations, and a focus on uplifting community experiences."}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap justify-center gap-2 mt-5">
        {skills.map((skill, idx) => (
          <span
            key={idx}
            className="px-3 py-1 rounded-xl bg-gray-100 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 text-xs font-semibold"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Social Links */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <a
          href={props?.github || "https://github.com/unnatii17"}
          target="_blank"
          rel="noreferrer"
          title="GitHub Profile"
          className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-amber-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
        >
          <FaGithub size={18} />
        </a>

        <a
          href={
            props?.linkedin ||
            "https://www.linkedin.com/in/unnati-chauhan17"
          }
          target="_blank"
          rel="noreferrer"
          title="LinkedIn Profile"
          className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
        >
          <FaLinkedin size={18} />
        </a>

        <a
          href={`mailto:${props?.email || "unnati7200@gmail.com"}`}
          target="_blank"
          rel="noreferrer"
          title="Send Email"
          className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-pink-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
        >
          <TbMailFilled size={18} />
        </a>
      </div>
    </motion.div>
  );
});

export default OurInfo;
