import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  rows?: number;
}

const Textarea: React.FC<TextareaProps> = ({ 
  className, 
  label,
  error,
  rows = 4,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={cn(
          "block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder-slate-500 transition-all duration-200",
          "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
          "disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed",
          "resize-none",
          error && "border-red-300 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export { Textarea };
