import React, { useEffect, useRef, useState } from 'react';
import { FiUpload, FiCamera, FiCheck } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updateDisplayPicture } from '../../../../services/operations/userAPI';
import { motion } from 'framer-motion';

const ChangeDp = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      previewFile(file);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleFileUpload = () => {
    if (!imageFile) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("displayPicture", imageFile);
      dispatch(updateDisplayPicture(token, formData)).then(() => {
        setLoading(false);
      });
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile);
    }
  }, [imageFile]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden"
    >
      {/* Background ambient accent */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-500/10 to-pink-500/10 rounded-bl-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar Container with Glow & Hover Action */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 rounded-full blur-md opacity-60 group-hover:opacity-100 transition duration-300"></div>
          
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 bg-slate-800 flex items-center justify-center">
            <img
              src={previewSource || user?.displayPicture}
              alt={`profile-${user?.name}`}
              className="w-full h-full object-cover"
            />
            
            <div 
              onClick={handleClick}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition duration-200 flex flex-col items-center justify-center cursor-pointer text-white"
            >
              <FiCamera className="text-2xl mb-1 text-amber-400" />
              <span className="text-[10px] font-bold">Change</span>
            </div>
          </div>

          <span className="absolute bottom-0 right-0 p-1.5 bg-amber-400 text-slate-950 rounded-full shadow-md border border-slate-900 text-xs">
            <FiCamera />
          </span>
        </div>

        {/* Info & Action Controls */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">Avatar & Display Picture</h3>
            <p className="text-xs text-slate-400">
              Upload a custom PNG, JPG or GIF (max 5MB)
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/gif, image/jpeg"
            disabled={user?._id === "66d9f75d5950dde630be7c3c"} 
          />

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
            <button
              type="button"
              onClick={handleClick}
              disabled={loading || user?._id === "66d9f75d5950dde630be7c3c"}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-xs transition duration-200 flex items-center gap-1.5"
            >
              <FiCamera className="text-amber-400 text-sm" /> Select New Photo
            </button>

            <button
              type="button"
              onClick={handleFileUpload}
              disabled={!imageFile || loading || user?._id === "66d9f75d5950dde630be7c3c"}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition duration-200 flex items-center gap-2 ${
                imageFile && !loading
                  ? "bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-105"
                  : "bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed"
              }`}
            >
              <FiUpload className="text-sm" />
              {loading ? "Uploading..." : "Save Picture"}
            </button>
          </div>

          {imageFile && (
            <p className="text-[11px] text-amber-300 font-medium flex items-center justify-center sm:justify-start gap-1">
              <FiCheck className="text-emerald-400" /> Selected: {imageFile.name}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChangeDp;