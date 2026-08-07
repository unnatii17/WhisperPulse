import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createPost } from '../../../../services/operations/postAPI';
import SubmitButton from '../../../common/SubmitButton';
import { FaUser, FaGraduationCap, FaPaintRoller } from 'react-icons/fa';
import { HiSparkles, HiColorSwatch, HiChevronDown } from 'react-icons/hi';
import "../Settings/Settings.css";
import './post.css';

const CreatePost = memo(function CreatePost() {
  const [maxLen, setMaxLen] = useState(0);
  const [openMoreInfo, setOpenMoreInfo] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [gradient, setGradient] = useState(0);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.profile);
  const gradientColor = [
    "light1", "light2", "light3", "light4", "light5", "light6"
  ];
  
  const gradientColorDark = [
    "dark1", "dark2", "dark3", "dark4", "dark5", "dark6"
  ];

  const { 
    register, 
    handleSubmit,
    setValue,
    getValues,
    formState: { errors }, 
    reset 
  } = useForm();

  React.useEffect(() => {
    const handlePrompt = (e) => {
      const promptText = e.detail;
      setValue('description', promptText);
      setMaxLen(promptText.length);
    };

    const handleTag = (e) => {
      const tagText = e.detail;
      const current = getValues('description') || '';
      const updated = current ? `${current} ${tagText}` : tagText;
      setValue('description', updated);
      setMaxLen(updated.length);
    };

    window.addEventListener('insertConfessionPrompt', handlePrompt);
    window.addEventListener('insertConfessionTag', handleTag);
    return () => {
      window.removeEventListener('insertConfessionPrompt', handlePrompt);
      window.removeEventListener('insertConfessionTag', handleTag);
    };
  }, [setValue, getValues]);

  const quickMoods = [
    { label: "🔥 Tea", tag: "#CampusTea" },
    { label: "🤫 Secret", tag: "#DeepSecret" },
    { label: "💖 Crush", tag: "#CampusCrush" },
    { label: "😂 Meme", tag: "#FunnyMoments" },
    { label: "💡 Advice", tag: "#SeniorAdvice" },
  ];

  const handleMoodClick = (tag) => {
    const current = getValues('description') || '';
    const updated = current ? `${current} ${tag}` : tag;
    setValue('description', updated);
    setMaxLen(updated.length);
  };
    
  const onSubmitHandle = async (data) => {
    if (data.branch === "Do you know their branch?") {
      data.branch = "";
    }
    if (data.year === "Do you know their year") {
      data.year = "";
    }
    data.color = gradient;
    setLoading(true);
    await dispatch(createPost(token, data));
    setLoading(false);
    reset();
    setMaxLen(0);
    setOpenMoreInfo(false);
  };

  const years = ["Do you know their year", "First", "Second", "Third", "Fourth"];
  const branches = ["Do you know their branch?", 'CS', 'IS', 'AD', 'AI', 'AT', 'BT', 'CH', 'CI', 'CY', 'EC', 'EE', 'EI', 'IM', 'BA', 'MC', 'MD', 'ME', 'CV'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="relative mx-auto w-full max-w-xl my-4 lg:my-6"
    >
      {/* Ambient Backdrop Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition duration-500"></div>

      <div className="relative bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 shadow-2xl text-white overflow-hidden">
        
        {/* Widget Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-xl text-slate-950 shadow-md">
              <HiSparkles className="text-lg animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-wide bg-gradient-to-r from-amber-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                Anonymous Confession Studio
              </h3>
              <p className="text-xs text-slate-400">Share your thoughts with the campus community</p>
            </div>
          </div>
          
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-amber-300">
            {maxLen}/500
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmitHandle)} className="flex flex-col gap-4">
          {/* Quick Mood Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            <span className="text-[11px] font-semibold text-slate-400 shrink-0 mr-1">Vibe:</span>
            {quickMoods.map((m, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleMoodClick(m.tag)}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 text-slate-300 hover:text-amber-300 transition shrink-0"
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Main Confession Input */}
          <div className="space-y-1">
            <textarea
              rows={3}
              placeholder="Paint your confession on this canvas..."
              {...register('description', { required: true, maxLength: 500 })}
              onChange={(e) => setMaxLen(e.target.value.length)}
              onClick={() => !openMoreInfo && setOpenMoreInfo(true)}
              className={`w-full bg-white/5 text-white placeholder-slate-500 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition duration-200 text-sm leading-relaxed resize-none ${
                user?._id === "66d9f75d5950dde630be7c3c" ? "disabled opacity-50" : ""
              }`}
              disabled={user?._id === "66d9f75d5950dde630be7c3c"}
            />
            {errors.description && (
              <span className="text-xs text-rose-400 font-medium">Confession content is required</span>
            )}
            {maxLen > 500 && (
              <span className="text-xs text-rose-400 font-medium">Maximum character limit reached (500)</span>
            )}
          </div>

          {/* Color Gradient Chips Picker */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <HiColorSwatch className="text-amber-400" /> Theme Card:
              </span>
              <div className="flex items-center gap-1.5">
                {gradientColor.map((ele, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setGradient(i);
                    }}
                    className={`w-6 h-6 rounded-full ${ele} dark:${gradientColorDark[i]} border ${
                      i === gradient ? "border-2 border-white scale-110 shadow-lg shadow-amber-400/30" : "border-white/20 opacity-70 hover:opacity-100"
                    } transition duration-150`}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpenMoreInfo(!openMoreInfo)}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 hover:underline transition"
            >
              {openMoreInfo ? "Hide Details" : "Add Tags"} <HiChevronDown className={`transition transform ${openMoreInfo ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Expandable Optional Details (Name, Year, Branch) */}
          <AnimatePresence>
            {openMoreInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 pt-3 border-t border-white/10 overflow-hidden"
              >
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <FaUser className="text-amber-400 text-xs" /> Target / Mention Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Someone in Section B"
                    {...register('name')}
                    className="w-full bg-white/5 text-white placeholder-slate-500 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-400 transition text-xs"
                    disabled={user?._id === "66d9f75d5950dde630be7c3c"}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <FaGraduationCap className="text-emerald-400 text-xs" /> Year
                    </label>
                    <select
                      {...register("year")}
                      defaultValue=""
                      className="w-full bg-slate-800 text-white border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400"
                      disabled={user?._id === "66d9f75d5950dde630be7c3c"}
                    >
                      {years.map((ele, i) => (
                        <option key={i} value={ele} className="bg-slate-900 text-white">
                          {ele}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <FaPaintRoller className="text-indigo-400 text-xs" /> Branch
                    </label>
                    <select
                      {...register("branch")}
                      defaultValue=""
                      className="w-full bg-slate-800 text-white border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400"
                      disabled={user?._id === "66d9f75d5950dde630be7c3c"}
                    >
                      {branches.map((ele, i) => (
                        <option key={i} value={ele} className="bg-slate-900 text-white">
                          {ele}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <SubmitButton 
              type="submit" 
              text={loading ? "Publishing..." : "✨ Publish Whisper"} 
              disabled={loading || user?._id === "66d9f75d5950dde630be7c3c"}
              customClasses="w-full sm:w-auto min-w-[160px]"
            />
          </div>
        </form>
      </div>
    </motion.div>
  );
});

export default CreatePost;