import React, { Suspense, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import ChangeDp from './Settings/ChangeDp';
import EditProfile from "../Feed/Settings/EditProfile";
import ChangePassword from "../Feed/Settings/ChangePassword";
import DeleteAccount from "../Feed/Settings/DeleteAccount";
import Loader from "../../common/Loader";
import { HiUser, HiLockClosed, HiShieldCheck } from 'react-icons/hi';
import { FiSliders, FiAlertCircle } from 'react-icons/fi';

const Settings = () => {
  const { user } = useSelector((state) => state.profile);
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Settings', icon: FiSliders },
    { id: 'profile', label: 'Profile & Avatar', icon: HiUser },
    { id: 'security', label: 'Security & Password', icon: HiLockClosed },
    { id: 'danger', label: 'Danger Zone', icon: FiAlertCircle },
  ];

  return (
    <Suspense fallback={<Loader />}>
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl mx-auto space-y-6 pb-12"
      >
        {/* Settings Header Banner Card */}
        <div className="p-6 md:p-8 bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-lg shadow-amber-500/20">
                  <img src={user?.displayPicture} alt={user?.name} className="w-full h-full object-cover" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
              </div>

              <div>
                <h2 className="text-xl font-extrabold tracking-wide flex items-center justify-center sm:justify-start gap-2">
                  {user?.name || "Campus Member"}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-semibold">
                    {user?.year ? `${user.year} Year` : 'Student'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400">@{user?.username || 'anonymous'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-emerald-400">
              <HiShieldCheck className="text-base" /> 100% Anonymous Profile
            </div>
          </div>

          {/* Interactive Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition duration-200 shrink-0 ${
                    isActive
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md scale-105"
                      : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
                  }`}
                >
                  <Icon className={isActive ? "text-slate-950" : "text-amber-400"} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabbed Content View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {(activeTab === 'all' || activeTab === 'profile') && (
              <>
                <ChangeDp />
                <EditProfile />
              </>
            )}

            {(activeTab === 'all' || activeTab === 'security') && (
              <ChangePassword />
            )}

            {(activeTab === 'all' || activeTab === 'danger') && (
              <DeleteAccount />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </Suspense>
  );
};

export default Settings;