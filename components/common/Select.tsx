import React, { useState, useRef, useEffect } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  position?: "absolute" | "relative";
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  className = "",
  position = "absolute",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative flex flex-col ${className}`}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-[#3d4a66] mb-1.5">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-2.5 bg-[#fafbfd] border border-[#e5e8ef] hover:border-zinc-300 rounded-xl focus:outline-none focus:border-[#2957ff] focus:ring-1 focus:ring-[#2957ff] text-sm text-[#0f172a] transition-all cursor-pointer font-medium min-w-[160px]"
      >
        <span>{selectedOption?.label || "Select..."}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-200 text-[#6b7890] ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`${
            position === "absolute" ? "absolute right-0 top-full z-50 shadow-lg" : "relative z-10 shadow-sm"
          } mt-2 w-full min-w-[160px] bg-white border border-[#e5e8ef] rounded-xl overflow-hidden animate-fade-in`}
        >
          <ul className="py-1">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                    option.value === value
                      ? "bg-[#2957ff]/5 text-[#2957ff] font-semibold"
                      : "text-[#3d4a66] hover:bg-zinc-50"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
