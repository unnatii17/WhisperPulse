import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../../../services/operations/userAPI";
import { motion } from "framer-motion";
import { HiShieldCheck, HiLockClosed } from "react-icons/hi";

const ChangePassword = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitPasswordForm = async (data) => {
    try {
      data = { ...data, userId: user?._id };
      const formData = new FormData();
      formData.append("oldPassword", data?.oldPassword);
      formData.append("newPassword", data?.newPassword);
      formData.append("userId", data?.userId);
      dispatch(changePassword(formData, token));
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      onSubmit={handleSubmit(submitPasswordForm)} 
      className="space-y-4"
    >
      <div className="p-6 md:p-8 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-xl text-white shadow-md">
              <HiShieldCheck className="text-lg" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white tracking-wide">Security & Password</h3>
              <p className="text-xs text-slate-400">Ensure your account remains safe and protected</p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Current Password */}
          <div className="space-y-1.5 relative">
            <label htmlFor="oldPassword" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <HiLockClosed className="text-purple-400 text-xs" /> Current Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                id="oldPassword"
                placeholder="Enter current password"
                disabled={user?._id === "66d9f75d5950dde630be7c3c"}
                className="w-full bg-white/5 text-white placeholder-slate-500 border border-white/10 rounded-xl px-4 py-3 pr-11 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-xs font-medium"
                {...register("oldPassword", { required: true })}
              />
              <button
                type="button"
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="absolute right-3 text-slate-400 hover:text-white transition"
              >
                {showOldPassword ? (
                  <AiOutlineEyeInvisible className="text-lg" />
                ) : (
                  <AiOutlineEye className="text-lg" />
                )}
              </button>
            </div>
            {errors.oldPassword && (
              <span className="text-[11px] text-rose-400 font-medium">Please enter your current password</span>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-1.5 relative">
            <label htmlFor="newPassword" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <HiLockClosed className="text-amber-400 text-xs" /> New Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                id="newPassword"
                placeholder="Enter new password"
                disabled={user?._id === "66d9f75d5950dde630be7c3c"}
                className="w-full bg-white/5 text-white placeholder-slate-500 border border-white/10 rounded-xl px-4 py-3 pr-11 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-xs font-medium"
                {...register("newPassword", { required: true })}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 text-slate-400 hover:text-white transition"
              >
                {showNewPassword ? (
                  <AiOutlineEyeInvisible className="text-lg" />
                ) : (
                  <AiOutlineEye className="text-lg" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <span className="text-[11px] text-rose-400 font-medium">Please enter your new password</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-white/10">
          <button
            type="button"
            onClick={() => navigate("/feed/my-profile")}
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition border border-white/5"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 transition duration-200"
          >
            Update Password
          </button>
        </div>
      </div>
    </motion.form>
  );
};

export default ChangePassword;