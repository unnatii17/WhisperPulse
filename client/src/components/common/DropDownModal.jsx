import React, { useEffect, useState } from 'react';
import "../../App.css";
import { HiChevronDown } from "react-icons/hi";

const DropDownModal = ({ name, setModal, showModal, getValues }) => {
  const handleClick = () => {
    setModal(true);
  };
  const [inputValues, setInputValues] = useState(getValues(name.toLowerCase()));

  useEffect(() => {
    setInputValues(getValues(name.toLowerCase()));
  }, [showModal, getValues, name]);

  const selectedValue = getValues(name.toLowerCase());

  return (
    <div className="w-full text-white flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-slate-300 capitalize flex items-center gap-1">
        {name}
      </span>
      <div 
        onClick={handleClick} 
        className="relative w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:border-amber-400/50 transition duration-200 flex items-center justify-between group"
      >
        <span className={`text-sm ${selectedValue ? "text-amber-300 font-medium" : "text-slate-500"}`}>
          {selectedValue ? `${name}: ${selectedValue}` : `Select ${name}`}
        </span>
        <HiChevronDown className="text-slate-400 group-hover:text-amber-400 transition duration-150 text-lg" />
      </div>
    </div>
  );
};

export default DropDownModal;

