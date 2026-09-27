import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = "Loading content...",
  size = "md"
}) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
      <div
        className={`${sizeClasses[size]} rounded-full border-indigo-500/20 border-t-indigo-500 animate-spin`}
      />
      {text && <p className="text-sm font-medium text-slate-400">{text}</p>}
    </div>
  );
};
