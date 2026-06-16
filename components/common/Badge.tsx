import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "brand" | "success" | "warning" | "neutral" | "danger";
  onClose?: () => void;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  onClose,
  className = "",
}) => {
  const baseStyle =
    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border transition-all";

  const variants = {
    brand: "bg-[#2957ff]/10 text-[#2957ff] border-[#2957ff]/20",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    neutral: "bg-zinc-100 text-zinc-700 border-zinc-200",
    danger: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
      {onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          type="button"
          className="ml-1 hover:opacity-75 focus:outline-none cursor-pointer font-bold leading-none text-[10px]"
          aria-label="Remove"
        >
          ✕
        </button>
      )}
    </span>
  );
};

export default Badge;
