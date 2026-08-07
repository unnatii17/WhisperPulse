import React, { memo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useOnClickOutside from "../../hooks/useOnClickOutside";
import useEscape from '../../hooks/useEscape';
import { HiCheckCircle, HiX } from 'react-icons/hi';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const Modal = memo(function Modal({ data, name, value, error, register, required, setModal }) {
  const [chosen, setChosen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const modalRef = useRef();

  const modalHandler = () => {
    setIsVisible(false);
    setTimeout(() => setModal(false), 200);
  };

  useOnClickOutside(modalRef, modalHandler);
  useEscape(modalRef, modalHandler);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md w-screen h-screen flex items-center justify-center z-50 p-4">
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            ref={modalRef}
            className="w-full max-w-md bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/15 p-6 shadow-2xl text-white relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <h2 className="text-xl font-bold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                Choose {name}
              </h2>
              <button 
                onClick={modalHandler}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <HiX className="text-xl" />
              </button>
            </div>

            {/* Options List */}
            <div className="overflow-y-auto max-h-[240px] pr-1 space-y-2 no-scrollbar">
              {data.map((topic, index) => (
                <label 
                  key={index} 
                  htmlFor={topic}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 cursor-pointer transition duration-150 group"
                >
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white">{topic}</span>
                  <div className="relative flex items-center">
                    <input
                      onClick={() => setChosen(true)}
                      {...register(`${name.toLowerCase()}`)}
                      id={topic}
                      value={topic}
                      type="radio"
                      className="w-4 h-4 text-amber-400 bg-transparent border-white/30 focus:ring-0 cursor-pointer"
                    />
                  </div>
                </label>
              ))}
            </div>

            {/* Done Button */}
            <button
              disabled={!chosen}
              onClick={modalHandler}
              className={`w-full mt-6 py-3 rounded-xl font-semibold text-sm transition duration-200 flex items-center justify-center gap-2 ${
                chosen 
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 hover:shadow-lg hover:shadow-amber-500/25 cursor-pointer' 
                  : 'bg-white/10 text-slate-500 cursor-not-allowed'
              }`}
            >
              <HiCheckCircle className="text-lg" /> {chosen ? "Confirm Selection" : "Pick an option"}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

export default Modal;

