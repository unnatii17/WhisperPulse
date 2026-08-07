import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import Loader from "../components/common/Loader";
import { 
  FaCrown, 
  FaHeart, 
  FaFileAlt, 
  FaTrophy, 
  FaSearch, 
  FaFire, 
  FaMedal,
  FaStar,
  FaAward,
  FaUserCheck
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import gold from "../assets/gold.png";
import silver from "../assets/silver.png";
import bronze from "../assets/bronze.png";

// Sample mock data for fallback when live database is loading or empty
const FALLBACK_LEADERBOARD_LIKES = [
  { id: "f1", author: "Unnati Chauhan", dp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Unnati", likes: 342, posts: 28, badge: "👑 Founder & Legend" },
  { id: "f2", author: "Aarav Sharma", dp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav", likes: 289, posts: 19, badge: "🔥 Confession Master" },
  { id: "f3", author: "Priya Patel", dp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", likes: 245, posts: 16, badge: "✨ Star Storyteller" },
  { id: "f4", author: "Rohan Verma", dp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan", likes: 198, posts: 14, badge: "💎 Elite Member" },
  { id: "f5", author: "Ananya Gupta", dp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya", likes: 167, posts: 12, badge: "🌟 Rising Star" },
  { id: "f6", author: "Vikram Malhotra", dp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram", likes: 142, posts: 10, badge: "🚀 Active Contributor" },
  { id: "f7", author: "Sneha Reddy", dp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha", likes: 115, posts: 8, badge: "💖 Community Favorite" },
];

const FALLBACK_LEADERBOARD_POSTS = [
  { id: "fp1", author: "Unnati Chauhan", dp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Unnati", posts: 28, likes: 342, badge: "👑 Top Creator" },
  { id: "fp2", author: "Aarav Sharma", dp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav", posts: 19, likes: 289, badge: "✍️ Prolific Author" },
  { id: "fp3", author: "Priya Patel", dp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", posts: 16, likes: 245, badge: "🎨 Artful Confessor" },
  { id: "fp4", author: "Kabir Mehta", dp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir", posts: 15, likes: 180, badge: "⚡ Daily Contributor" },
  { id: "fp5", author: "Rohan Verma", dp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan", posts: 14, likes: 198, badge: "💎 Elite Creator" },
  { id: "fp6", author: "Diya Roy", dp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diya", posts: 11, likes: 130, badge: "🌟 Creative Mind" },
];

const Leaderboard = () => {
  const [postCount, setPostCount] = useState([]);
  const [likeCount, setLikeCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("likes"); // "likes" | "posts" | "trending"
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let unsubscribed = false;

    try {
      const postRef = collection(db, "userPosts");
      const likeRef = collection(db, "Post");

      const qPost = query(postRef, orderBy("posts", "desc"));
      const qLike = query(likeRef, orderBy("likes", "desc"));

      const unsubscribe1 = onSnapshot(
        qPost,
        (snap) => {
          if (unsubscribed) return;
          const posts = [];
          snap.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() });
          });
          setPostCount(posts.length > 0 ? posts : FALLBACK_LEADERBOARD_POSTS);
          setLoading(false);
        },
        (err) => {
          console.warn("Firestore userPosts query fallback triggered:", err);
          setPostCount(FALLBACK_LEADERBOARD_POSTS);
          setLoading(false);
        }
      );

      const unsubscribe2 = onSnapshot(
        qLike,
        (snap) => {
          if (unsubscribed) return;
          const posts = [];
          snap.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() });
          });
          setLikeCount(posts.length > 0 ? posts : FALLBACK_LEADERBOARD_LIKES);
          setLoading(false);
        },
        (err) => {
          console.warn("Firestore Post query fallback triggered:", err);
          setLikeCount(FALLBACK_LEADERBOARD_LIKES);
          setLoading(false);
        }
      );

      return () => {
        unsubscribed = true;
        unsubscribe1();
        unsubscribe2();
      };
    } catch (e) {
      console.warn("Firebase snapshot failed, using fallback mock data", e);
      setPostCount(FALLBACK_LEADERBOARD_POSTS);
      setLikeCount(FALLBACK_LEADERBOARD_LIKES);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Determine active dataset
  let rawData = activeTab === "likes" ? (likeCount.length > 0 ? likeCount : FALLBACK_LEADERBOARD_LIKES) : (postCount.length > 0 ? postCount : FALLBACK_LEADERBOARD_POSTS);
  
  if (activeTab === "trending") {
    rawData = [...rawData].sort((a, b) => ((b.likes || b.posts || 0) - (a.likes || a.posts || 0)));
  }

  // Filter by search term
  const filteredData = rawData.filter((item) => {
    const name = item.author || item.name || item.username || "Anonymous";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const top3 = filteredData.slice(0, 3);
  const remainingList = filteredData.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-purple-50/30 to-slate-100 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center relative py-6 px-4 rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-amber-200/60 dark:border-gray-800 shadow-xl overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="inline-flex items-center justify-center p-4 bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-400 rounded-2xl shadow-lg shadow-amber-500/30 mb-4 cursor-pointer"
          >
            <FaCrown className="text-4xl text-white animate-pulse" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
            WhisperPulse Leaderboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-3 text-base sm:text-lg max-w-xl mx-auto font-medium">
            Celebrating our community's top confessors, most loved stories & vibrant creators! 🏆
          </p>

          {/* Search & Navigation Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
            {/* Tabs */}
            <div className="flex bg-white/80 dark:bg-gray-800/80 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-inner w-full sm:w-auto">
              <button
                onClick={() => setActiveTab("likes")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                  activeTab === "likes"
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30"
                    : "text-gray-600 dark:text-gray-400 hover:text-pink-500"
                }`}
              >
                <FaHeart className="text-sm" /> Most Liked
              </button>
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                  activeTab === "posts"
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/30"
                    : "text-gray-600 dark:text-gray-400 hover:text-purple-500"
                }`}
              >
                <FaFileAlt className="text-sm" /> Top Creators
              </button>
              <button
                onClick={() => setActiveTab("trending")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                  activeTab === "trending"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30"
                    : "text-gray-600 dark:text-gray-400 hover:text-amber-500"
                }`}
              >
                <FaFire className="text-sm" /> Trending
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800 dark:text-white placeholder-gray-400"
              />
            </div>
          </div>
        </motion.div>

        {/* Podium Display for Top 3 */}
        {top3.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4 pb-2">
            
            {/* 2nd Place (Silver) */}
            {top3[1] && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -6 }}
                className="order-2 md:order-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl border-2 border-slate-300 dark:border-slate-600 text-center shadow-xl relative"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black px-3 py-1 rounded-full border border-slate-400">
                  RANK #2 🥈
                </div>
                <div className="relative inline-block mt-3 mb-3">
                  <img
                    src={top3[1]?.dp || "https://api.dicebear.com/7.x/avataaars/svg?seed=WhisperPulse2"}
                    alt={top3[1]?.author || "Runner Up"}
                    className="w-20 h-20 rounded-full mx-auto border-4 border-slate-300 dark:border-slate-500 shadow-md object-cover"
                  />
                  <img src={silver} alt="Silver Medal" className="w-8 h-8 absolute -bottom-2 -right-2 drop-shadow" />
                </div>
                <h3 className="font-extrabold text-lg text-gray-800 dark:text-white truncate">
                  {top3[1]?.author || top3[1]?.name || "Anonymous Confessor"}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                  {top3[1]?.badge || "Silver Contributor"}
                </p>
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 dark:bg-slate-700/80 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-black shadow-inner">
                  <FaHeart className="text-pink-500" /> {top3[1]?.likes || 0} Likes
                  <span className="mx-1">•</span>
                  <FaFileAlt className="text-purple-500" /> {top3[1]?.posts || 0} Posts
                </div>
              </motion.div>
            )}

            {/* 1st Place (Gold Champion) */}
            {top3[0] && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="order-1 md:order-2 bg-gradient-to-b from-amber-500/20 via-white/95 to-amber-500/10 dark:from-amber-500/30 dark:via-gray-800/95 dark:to-amber-500/20 backdrop-blur-xl p-8 rounded-3xl border-2 border-amber-400 dark:border-amber-500 text-center shadow-2xl shadow-amber-500/20 transform md:-translate-y-4 relative"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg border border-amber-300 flex items-center gap-1">
                  <HiSparkles /> CHAMPION 👑
                </div>
                <div className="relative inline-block mt-4 mb-4">
                  <motion.div 
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-7 left-1/2 -translate-x-1/2 text-3xl"
                  >
                    👑
                  </motion.div>
                  <img
                    src={top3[0]?.dp || "https://api.dicebear.com/7.x/avataaars/svg?seed=WhisperPulse1"}
                    alt={top3[0]?.author || "Champion"}
                    className="w-24 h-24 rounded-full mx-auto border-4 border-amber-400 dark:border-amber-400 shadow-xl object-cover"
                  />
                  <img src={gold} alt="Gold Medal" className="w-10 h-10 absolute -bottom-2 -right-2 drop-shadow-md" />
                </div>
                <h3 className="font-black text-xl text-gray-900 dark:text-white truncate">
                  {top3[0]?.author || top3[0]?.name || "Unnati Chauhan"}
                </h3>
                <p className="text-xs text-amber-600 dark:text-amber-300 font-bold mt-0.5">
                  {top3[0]?.badge || "👑 Undisputed Leader"}
                </p>
                <div className="mt-4 inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-2xl text-xs font-black shadow-md">
                  <span className="flex items-center gap-1"><FaHeart /> {top3[0]?.likes || 0} Likes</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><FaFileAlt /> {top3[0]?.posts || 0} Posts</span>
                </div>
              </motion.div>
            )}

            {/* 3rd Place (Bronze) */}
            {top3[2] && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -6 }}
                className="order-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl border-2 border-amber-700/30 dark:border-amber-700/50 text-center shadow-xl relative"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-900/10 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-black px-3 py-1 rounded-full border border-amber-700/40">
                  RANK #3 🥉
                </div>
                <div className="relative inline-block mt-3 mb-3">
                  <img
                    src={top3[2]?.dp || "https://api.dicebear.com/7.x/avataaars/svg?seed=WhisperPulse3"}
                    alt={top3[2]?.author || "Third Place"}
                    className="w-20 h-20 rounded-full mx-auto border-4 border-amber-700/40 dark:border-amber-700/60 shadow-md object-cover"
                  />
                  <img src={bronze} alt="Bronze Medal" className="w-8 h-8 absolute -bottom-2 -right-2 drop-shadow" />
                </div>
                <h3 className="font-extrabold text-lg text-gray-800 dark:text-white truncate">
                  {top3[2]?.author || top3[2]?.name || "Anonymous Confessor"}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                  {top3[2]?.badge || "Bronze Elite"}
                </p>
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-amber-900/10 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200 rounded-xl text-xs font-black shadow-inner">
                  <FaHeart className="text-pink-500" /> {top3[2]?.likes || 0} Likes
                  <span className="mx-1">•</span>
                  <FaFileAlt className="text-purple-500" /> {top3[2]?.posts || 0} Posts
                </div>
              </motion.div>
            )}

          </div>
        )}

        {/* Full Leaderboard Rankings Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
              <FaTrophy className="text-amber-500" /> Community Rankings
            </h2>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              Showing {filteredData.length} Members
            </span>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {filteredData.map((item, index) => {
                const rank = index + 1;
                const authorName = item.author || item.name || item.username || "Anonymous Confessor";

                return (
                  <motion.div
                    key={item.id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.04 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className={`flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl transition-all border ${
                      rank === 1
                        ? "bg-gradient-to-r from-amber-500/10 via-amber-100/40 to-transparent dark:from-amber-500/20 dark:via-gray-700/60 border-amber-300 dark:border-amber-600"
                        : rank === 2
                        ? "bg-slate-100/60 dark:bg-slate-800/40 border-slate-300 dark:border-slate-600"
                        : rank === 3
                        ? "bg-amber-900/5 dark:bg-amber-900/20 border-amber-700/30 dark:border-amber-700/50"
                        : "bg-gray-50/80 dark:bg-gray-700/40 border-gray-100 dark:border-gray-700 hover:bg-purple-50/50 dark:hover:bg-gray-700/80"
                    }`}
                  >
                    {/* Left Rank & User Info */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                        rank === 1
                          ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                          : rank === 2
                          ? "bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-white"
                          : rank === 3
                          ? "bg-amber-700/40 text-amber-900 dark:text-amber-200"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}>
                        #{rank}
                      </span>

                      <div className="relative">
                        <img
                          src={item?.dp || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`}
                          alt={authorName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-purple-400/80 shadow-sm"
                        />
                        {rank <= 3 && (
                          <div className="absolute -bottom-1 -right-1 text-xs">
                            {rank === 1 ? "👑" : rank === 2 ? "🥈" : "🥉"}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-gray-900 dark:text-white text-base">
                            {authorName}
                          </h4>
                          {rank === 1 && <FaUserCheck className="text-amber-500 text-xs" />}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {item.badge || (rank <= 5 ? "🔥 WhisperPulse Elite" : "Active Community Member")}
                        </p>
                      </div>
                    </div>

                    {/* Right Stats Pills */}
                    <div className="flex items-center gap-3 mt-3 sm:mt-0 w-full sm:w-auto justify-end">
                      <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border border-pink-200/60 dark:border-pink-800/40 font-bold text-xs">
                        <FaHeart className="text-pink-500" />
                        <span>{item.likes || 0} Likes</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/40 font-bold text-xs">
                        <FaFileAlt className="text-purple-500" />
                        <span>{item.posts || 0} Posts</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredData.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                <FaTrophy className="text-4xl text-amber-400 mx-auto mb-2 opacity-50" />
                <p className="font-semibold">No creators found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Leaderboard;
