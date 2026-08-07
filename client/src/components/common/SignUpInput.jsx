import { memo } from "react";

const SignUpInput = memo(function SignUpInput({ name, type, value, register, error, required }) {
  return (
    <label className="w-full text-white flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-slate-300 capitalize flex items-center gap-1">
        {name} {required && <span className="text-amber-400">*</span>}
      </span>
      <input
        type={type}
        name={value}
        {...register(value, { required })}
        placeholder={`Enter ${name}`}
        className="w-full bg-white/5 text-white placeholder-slate-500 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition duration-200 text-sm"
      />
      {error && (
        <span className="text-xs text-rose-400 font-medium">
          {error.message ? error.message : `${name} is required`}
        </span>
      )}
    </label>
  );
});

export default SignUpInput;