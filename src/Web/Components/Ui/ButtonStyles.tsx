import type { ReactNode } from "react";

interface ButtonStylesProps {
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
  icon?: ReactNode; 
}

export default function ButtonStyles({ onClick, children, className = "", disabled = false, icon, variant = "primary" }: ButtonStylesProps) {

  const baseClasses =  `
    py-1 px-2 sm:py-2 sm:px-3 flex items-center justify-center gap-2 font-semibold text-white
    text-xs sm:text-sm rounded-sm sm:rounded-md
  `;

  const variantClasses = variant === "primary"
    ? "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-[linear-gradient(90deg,#06b6d4,#6366f1)]"
    : "bg-gray-800 hover:bg-gray-700";

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";


  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${className} ${baseClasses} ${variantClasses} ${disabledClasses}`}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
}
