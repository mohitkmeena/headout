import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  variant = 'default',
  hover = false,
  ...props 
}) => {
  const baseClasses = "rounded-xl transition-all duration-300";
  
  const variantClasses = {
    default: "bg-white border border-slate-200 shadow-sm",
    elevated: "bg-white border border-slate-200 shadow-lg",
    outlined: "bg-transparent border-2 border-slate-200",
    glass: "bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl"
  };
  
  const hoverClasses = hover ? "hover:shadow-xl hover:scale-[1.02] hover:border-slate-300" : "";
  
  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card };
