import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  HiFire, 
  HiSparkles, 
  HiShieldCheck, 
  HiOutlineLightBulb, 
  HiChatAlt2, 
  HiTrendingUp
} from 'react-icons/hi';
import { FaQuoteLeft, FaCoffee } from 'react-icons/fa';

const RightSidebar = ({ onSelectPrompt }) => {
  const navigate = useNavigate();

  const trendingTopics = [
    { name: '#ExamVent', count: '142 whispers', icon: '📝', color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30' },
    { name: '#LibraryCrush', count: '98 whispers', icon: '💖', color: 'from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30' },
    { name: '#HostelDiaries', count: '87 whispers', icon: '🌙', color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30' },
    { name: '#CanteenGossip', count: '65 whispers', icon: '☕', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30' },
  ];

  const dailyPrompts = [
    "What's a secret you haven't shared with your roommates yet?",
    "That one professor who actually saved your semester...",
    "Most embarrassing moment in the college library?",
    "If you could say one honest thing to your crush right now..."
  ];

  const [promptIndex, setPromptIndex] = useState(0);

  const handleNextPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % dailyPrompts.length);
  };

  const handleUsePrompt = () => {
    const promptText = dailyPrompts[promptIndex];
    if (onSelectPrompt) {
      onSelectPrompt(promptText);
    } else {
      window.dispatchEvent(new CustomEvent('insertConfessionPrompt', { detail: promptText }));
    }
  };

  return (
    <div className="hidden lg:flex flex-col gap-5 w-80 shrink-0 py-6 pr-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto custom-scrollbar">
      
      {/* 1. Campus Energy Card */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl group-hover:bg-amber-500/25 transition duration-500"></div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-xl text-slate-950 shadow-lg shadow-amber-500/20">
              <HiFire className="text-lg animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white tracking-wide">Campus Pulse</h4>
              <p className="text-[11px] text-slate-400">Live Community Vibe</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> 99% Active
          </span>
        </div>

        {/* Pulse Progress Bar */}
        <div className="space-y-1.5 mt-2">
          <div className="flex justify-between text-[11px] font-semibold text-slate-300">
            <span>Confession Energy</span>
            <span className="text-amber-400">High 🔥</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "88%" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <HiShieldCheck className="text-emerald-400 text-sm" /> 100% Encrypted & Safe
          </span>
          <span className="flex items-center gap-1 text-slate-300 font-medium">
            <HiChatAlt2 className="text-amber-400" /> Active Feed
          </span>
        </div>
      </motion.div>

      {/* 2. Daily Confession Spark Card */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/70 via-slate-900/90 to-indigo-950/70 backdrop-blur-xl border border-purple-500/20 shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <HiOutlineLightBulb className="text-amber-400 text-xl animate-bounce" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">Daily Spark</h4>
          </div>
          <button 
            onClick={handleNextPrompt}
            className="text-[11px] text-purple-400 hover:text-purple-200 font-medium underline transition"
          >
            Shuffle 🎲
          </button>
        </div>

        <div className="relative p-3.5 bg-white/5 border border-white/10 rounded-2xl mb-3">
          <FaQuoteLeft className="text-purple-400/30 text-lg absolute top-2 left-2 pointer-events-none" />
          <p className="text-xs text-slate-200 italic leading-relaxed pl-3 font-medium">
            "{dailyPrompts[promptIndex]}"
          </p>
        </div>

        <button
          onClick={handleUsePrompt}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 hover:from-purple-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1.5"
        >
          <HiSparkles className="text-amber-300 text-sm" /> Use This Prompt
        </button>
      </motion.div>

      {/* 3. Trending Hot Campus Topics */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-3">
          <HiTrendingUp className="text-orange-400 text-lg" />
          <h4 className="text-sm font-black text-white">Trending Topics</h4>
        </div>

        <div className="space-y-2.5">
          {trendingTopics.map((topic, idx) => (
            <motion.div
              key={idx}
              whileHover={{ x: 4 }}
              onClick={() => {
                window.dispatchEvent(new CustomEvent('insertConfessionTag', { detail: topic.name }));
              }}
              className={`p-3 rounded-2xl bg-gradient-to-r ${topic.color} border cursor-pointer flex items-center justify-between transition-all`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{topic.icon}</span>
                <div>
                  <p className="text-xs font-bold">{topic.name}</p>
                  <p className="text-[10px] opacity-80">{topic.count}</p>
                </div>
              </div>
              <span className="text-xs font-bold opacity-60">→</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 4. Support Campus Network CTA */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-pink-500/15 backdrop-blur-xl border border-amber-500/30 shadow-2xl text-center relative overflow-hidden"
      >
        <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30">
          <FaCoffee className="text-xl" />
        </div>
        <h4 className="text-xs font-extrabold text-white">Keep WhisperPulse Alive</h4>
        <p className="text-[11px] text-slate-300 mt-1 mb-3">Support server costs & fuel upcoming campus features</p>

        <button
          onClick={() => navigate('/feed/buy-us-coffee')}
          className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
        >
          ☕ Buy Us A Coffee
        </button>
      </motion.div>

    </div>
  );
};

export default RightSidebar;
