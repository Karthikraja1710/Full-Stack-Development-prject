import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 text-indigo-400 flex items-center justify-center shadow-xl">
        <FileQuestion className="w-8 h-8" />
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-extrabold text-slate-100">404 - Page Not Found</h1>
        <p className="text-slate-400 text-sm">
          The requested article or page does not exist or may have been moved.
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-600/20"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Home
      </Link>
    </div>
  );
};
