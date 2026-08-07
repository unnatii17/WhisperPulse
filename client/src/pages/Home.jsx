import React, { Suspense, useEffect, useState } from 'react';
import logo from "../assets/confettiNoText.png"; 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { HiOutlineMail, HiOutlineLockClosed, HiSparkles, HiShieldCheck, HiUserGroup, HiFire } from "react-icons/hi";
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import SubmitButton from '../components/common/SubmitButton';
import { login } from '../services/operations/authAPI';
import Loader from '../components/common/Loader';
import { setRedirection } from '../slices/authSlice';

const Home = () => { 
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const { email, password } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password, navigate));
  };

  const redirection = useSelector((state) => state.auth.redirection);

  useEffect(() => { 
    if (token && redirection) {
      dispatch(setRedirection(null));
      navigate(redirection);
    }

    if (token) {
      navigate("/feed");
    }
  }, [token, navigate, redirection]);

  return (
    <Suspense fallback={<Loader />}>
      <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-[#0c0a20] to-[#18092b] text-white flex items-center justify-center p-4 md:p-8 overflow-hidden">
        {/* Animated Background Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-pink-500/15 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Brand Experience & Visual Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col justify-center gap-6 p-6 lg:p-10 bg-white/5 dark:bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-purple-600/20 rounded-bl-full blur-xl pointer-events-none"></div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-amber-500/20">
                <img src={logo} className="w-10 h-10 object-contain brightness-125" alt="WhisperPulse Logo" />
              </div>
              <div>
                <span className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-amber-300 via-orange-400 to-pink-500 bg-clip-text text-transparent">
                  WhisperPulse
                </span>
                <span className="block text-xs text-amber-200/70 font-medium tracking-widest uppercase">
                  Anonymous Campus Network
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-white">
                Unfiltered Campus Stories. <br />
                <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Zero Drama. Pure Vibe.
                </span>
              </h1>

              {/* Typewriter Effect */}
              <div className="h-10 text-lg md:text-xl font-medium text-purple-200/90 flex items-center gap-2">
                <HiSparkles className="text-amber-400 shrink-0 text-xl animate-spin" style={{ animationDuration: '4s' }} />
                <TypeAnimation
                  sequence={[
                    'Share your deepest college confessions 🤫',
                    2000,
                    'Comment & react anonymously 💬',
                    2000,
                    'Stay connected with real campus tea ☕',
                    2000,
                    'Climb the anonymous leaderboard 🔥',
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </div>
            </div>

            {/* Sample Confession Snippets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }}
                className="p-3.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-1">
                  <HiFire /> #TrendingGossip • CS Dept
                </div>
                <p className="text-xs text-slate-300 italic">"Prof gave a surprise test and literally 90% of the class swapped answer keys mid-lab 😭"</p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }}
                className="p-3.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-pink-400 mb-1">
                  <HiSparkles /> #CampusCrush • Library
                </div>
                <p className="text-xs text-slate-300 italic">"To the girl reading sci-fi in section B every Tuesday... your playlist tastes are elite ✨"</p>
              </motion.div>
            </div>

            {/* Platform Highlights */}
            <div className="flex flex-wrap gap-4 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                <HiShieldCheck className="text-emerald-400 text-base" /> 100% Anonymous
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                <HiUserGroup className="text-indigo-400 text-base" /> Verified Students
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                <HiFire className="text-orange-400 text-base" /> Real-Time Feed
              </div>
            </div>
          </motion.div>

          {/* Right Column: Modern Glassmorphism Login Card */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-5 w-full"
          >
            <div className="p-8 md:p-10 bg-slate-900/70 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                <p className="text-sm text-slate-400 mt-1">Sign in to join your campus conversation</p>
              </div>

              <form onSubmit={handleOnSubmit} className="flex flex-col gap-5">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <HiOutlineMail className="text-amber-400 text-sm" /> Email Address
                  </label>
                  <div className="relative flex items-center">
                    <input
                      required
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleOnChange}
                      placeholder="student@college.edu"
                      className="w-full bg-white/5 text-white placeholder-slate-500 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition duration-200 text-sm"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <HiOutlineLockClosed className="text-amber-400 text-sm" /> Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={handleOnChange}
                      placeholder="••••••••"
                      className="w-full bg-white/5 text-white placeholder-slate-500 border border-white/10 rounded-xl px-4 py-3.5 pr-11 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition duration-200 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 text-slate-400 hover:text-amber-400 transition duration-150"
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible className="text-xl" />
                      ) : (
                        <AiOutlineEye className="text-xl" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <span
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs font-medium text-amber-400 hover:text-amber-300 hover:underline cursor-pointer transition duration-150"
                  >
                    Forgot password?
                  </span>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <SubmitButton
                    text="Sign In 🚀"
                    type="submit"
                    customClasses="w-full"
                  />
                </div>

                {/* Signup Redirection */}
                <div className="text-center text-xs text-slate-400 mt-4 pt-4 border-t border-white/10">
                  Don't have an account?{" "}
                  <span 
                    onClick={() => navigate("/signup")} 
                    className="text-amber-400 font-semibold hover:text-amber-300 hover:underline cursor-pointer transition duration-150"
                  >
                    Register Here
                  </span>
                </div>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </Suspense>
  );
};

export default Home;




