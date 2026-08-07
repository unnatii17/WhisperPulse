import React, { useEffect, useState } from 'react';
import gold from '../../../assets/gold.png';
import silver from '../../../assets/silver.png';
import bronze from '../../../assets/bronze.png';
import { db } from '../../../firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { FaCrown, FaHeart, FaFileAlt, FaTrophy } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Stats = () => {
  const [postCount, setPostCount] = useState([]);
  const [likeCount, setLikeCount] = useState([]);
  const [activeTab, setActiveTab] = useState("likes");

  useEffect(() => {
    const postRef = collection(db, "userPosts");
    const likeRef = collection(db, "Post");

    const qPost = query(postRef, orderBy("posts", "desc"));
    const qLike = query(likeRef, orderBy("likes", "desc"));

    const unsubscribe1 = onSnapshot(qPost, (snap) => {
      const posts = [];
      snap.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });
      setPostCount(posts);
    }, (err) => console.log("Error fetching post count", err));

    const unsubscribe2 = onSnapshot(qLike, (snap) => {
      const posts = [];
      snap.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });
      setLikeCount(posts);
    }, (err) => console.log("Error fetching like count", err));

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, []);

  const activeData = activeTab === "likes" ? likeCount : postCount;

  return (
    <div className='text-black dark:text-white mx-auto w-full max-w-xl py-4 px-2'>
      <div className="text-center mb-6">
        <h2 className='text-3xl font-extrabold bg-gradient-to-r from-amber-500 via-purple-500 to-pink-500 bg-clip-text text-transparent inline-flex items-center gap-2'>
          <FaCrown className="text-amber-500 text-2xl" /> Leaderboard
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Celebrating our top community stars</p>
      </div>

      {/* Tab switch */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex gap-1 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("likes")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "likes"
                ? "bg-pink-500 text-white shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:text-pink-500"
            }`}
          >
            <FaHeart /> Most Liked
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "posts"
                ? "bg-purple-500 text-white shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:text-purple-500"
            }`}
          >
            <FaFileAlt /> Top Confessors
          </button>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 space-y-3">
        {activeData?.slice(0, 10)?.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
              index === 0
                ? "bg-amber-500/10 border border-amber-400/40 dark:bg-amber-500/20"
                : index === 1
                ? "bg-slate-200/50 border border-slate-300 dark:bg-slate-700/50"
                : index === 2
                ? "bg-amber-900/10 border border-amber-700/30 dark:bg-amber-900/30"
                : "bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 flex items-center justify-center font-bold text-sm">
                {index === 0 ? (
                  <img src={gold} alt="gold" className="w-5 h-5" />
                ) : index === 1 ? (
                  <img src={silver} alt="silver" className="w-5 h-5" />
                ) : index === 2 ? (
                  <img src={bronze} alt="bronze" className="w-5 h-5" />
                ) : (
                  <span className="text-gray-400">#{index + 1}</span>
                )}
              </div>
              <img
                src={item?.dp || "https://api.dicebear.com/7.x/bottts/svg?seed=WhisperPulse"}
                alt={item?.author}
                className="w-9 h-9 rounded-full object-cover border border-purple-300"
              />
              <span className="font-bold text-sm text-gray-800 dark:text-white truncate max-w-[150px]">
                {item?.author}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-bold">
              {activeTab === "likes" ? (
                <>
                  <FaHeart className="text-pink-500" />
                  <span>{item?.likes || 0}</span>
                </>
              ) : (
                <>
                  <FaFileAlt className="text-purple-500" />
                  <span>{item?.posts || 0}</span>
                </>
              )}
            </div>
          </motion.div>
        ))}

        {activeData?.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-4">No entries found.</p>
        )}
      </div>
    </div>
  );
};

export default Stats;