import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, name, className = "", id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
              error ? "text-red-500" : "text-[#3d4a66]"
            }`}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          name={name}
          className={`w-full px-3.5 py-2.5 bg-[#fafbfd] border rounded-xl focus:outline-none transition-all text-sm text-[#0f172a] disabled:opacity-50 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-[#e5e8ef] focus:border-[#2957ff] focus:ring-1 focus:ring-[#2957ff]"
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;