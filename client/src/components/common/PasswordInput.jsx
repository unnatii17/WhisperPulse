import React, { memo, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const PasswordInput = memo(function PasswordInput(props) {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <label className="w-full text-white flex flex-col gap-1.5 relative">
      <span className="text-xs font-semibold text-slate-300 capitalize flex items-center gap-1">
        {props.name} {props.required && <span className="text-amber-400">*</span>}
      </span>
      <div className="relative flex items-center">
        <input
          required={props.required}
          type={showPassword ? "text" : "password"}
          name={props.name.trim()}
          placeholder={`Enter ${props.name}`}
          {...props?.register(props?.value, { required: props?.required })}
          className="w-full bg-white/5 text-white placeholder-slate-500 border border-white/10 rounded-xl px-4 py-3 pr-11 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition duration-200 text-sm"
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
      {props?.error && (
        <span className="text-xs text-rose-400 font-medium">
          {props?.value.charAt(0).toUpperCase() + props?.value.slice(1)} is required *
        </span>
      )}
    </label>
  );
});

export default PasswordInput;