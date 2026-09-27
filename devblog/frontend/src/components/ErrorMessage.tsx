import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-3 my-4">
      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-rose-300">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs font-semibold text-rose-400 hover:text-rose-200 underline"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
};
