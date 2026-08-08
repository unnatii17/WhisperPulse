import React from "react";
import "../../App.css";
import { HiChevronDown } from "react-icons/hi";

const DropDownModal = ({ name, setModal, showModal, getValues }) => {
  const handleClick = () => {
    setModal(true);
  };

  const selectedValue = getValues(name.toLowerCase());

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer flex items-center justify-between w-full"
    >
      <span>{name}</span>

      <span
        className={`text-sm ${
          selectedValue
            ? "text-amber-300 font-medium"
            : "text-slate-500"
        }`}
      >
        {selectedValue ? `${name}: ${selectedValue}` : `Select ${name}`}
      </span>

      <HiChevronDown />
    </div>
  );
};

export default DropDownModal;
