import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'creatify';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  className = '',
  disabled,
  icon,
  ...props 
}) => {
  
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple rounded-lg disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-purple text-white hover:bg-indigo-600 shadow-lg shadow-brand-purple/20",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm",
    outline: "bg-transparent border border-white/20 text-white hover:bg-white/10",
    ghost: "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100",
    creatify: "bg-black text-white hover:bg-slate-900 border border-white/10 pl-1 pr-6 py-1 gap-4", 
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-6 py-3.5 text-lg",
  };

  // Custom rendering for the specific 'creatify' style button seen in the hero
  if (variant === 'creatify') {
      return (
        <button 
            className={`${baseStyles} ${variants.creatify} ${className} h-14`} // Fixed height for uniformity
            disabled={disabled || isLoading}
            {...props}
        >
            <div className="h-10 w-10 flex items-center justify-center bg-brand-purple rounded text-white">
                {isLoading ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/> : (icon || <ArrowRight className="w-5 h-5" />)}
            </div>
            <span className="font-bold tracking-wide text-sm uppercase">{children}</span>
        </button>
      )
  }

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
           <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
           Processing...
        </span>
      ) : children}
    </button>
  );
};