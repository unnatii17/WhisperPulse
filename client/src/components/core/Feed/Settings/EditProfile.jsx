import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../../../common/SubmitButton";
import { editUser } from "../../../../services/operations/userAPI";
import { motion } from "framer-motion";
import { FaUser, FaIdBadge, FaGraduationCap } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

const years = ["First", "Second", "Third", "Fourth"];

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitProfileForm = async (data) => {
    try {
      dispatch(editUser(data, token));
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      onSubmit={handleSubmit(submitProfileForm)} 
      className="space-y-4"
    >
      <div className="p-6 md:p-8 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-xl text-slate-950 shadow-md">
              <HiSparkles className="text-lg" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white tracking-wide">Personal Details</h3>
              <p className="text-xs text-slate-400">Update how your identity appears on your account</p>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FaUser className="text-amber-400 text-xs" /> Display Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter your name"
                disabled={user?._id === "66d9f75d5950dde630be7c3c"}
                className="w-full bg-white/5 text-white placeholder-slate-500 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-xs font-medium"
                {...register("name", { required: true })}
                defaultValue={user?.name}
              />
              {errors.name && (
                <span className="text-[11px] text-rose-400 font-medium">Please enter your name</span>
              )}
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FaIdBadge className="text-purple-400 text-xs" /> Username (@handle)
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter your username"
                disabled={user?._id === "66d9f75d5950dde630be7c3c"}
                className="w-full bg-white/5 text-white placeholder-slate-500 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-xs font-medium"
                {...register("username", { required: true })}
                defaultValue={user?.username}
              />
              {errors.username && (
                <span className="text-[11px] text-rose-400 font-medium">Please enter your username</span>
              )}
            </div>
          </div>

          {/* Academic Year */}
          <div className="space-y-1.5">
            <label htmlFor="year" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FaGraduationCap className="text-emerald-400 text-xs" /> Academic Year
            </label>
            <select
              name="year"
              id="year"
              disabled={user?._id === "66d9f75d5950dde630be7c3c"}
              className="w-full bg-slate-800 text-white border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 transition text-xs font-medium"
              {...register("year", { required: true })}
              defaultValue={user?.year}
            >
              {years.map((ele, i) => (
                <option key={i} value={ele} className="bg-slate-900 text-white">
                  {ele} Year
                </option>
              ))}
            </select>
            {errors.year && (
              <span className="text-[11px] text-rose-400 font-medium">Please select your year of study</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => navigate("/feed/my-profile")}
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition border border-white/5"
          >
            Cancel
          </button>
          <SubmitButton type="submit" text="Save Profile Changes" />
        </div>
      </div>
    </motion.form>
  );
}