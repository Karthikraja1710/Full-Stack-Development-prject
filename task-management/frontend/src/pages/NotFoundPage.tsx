import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-brand-400 mb-6 shadow-2xl">
        <FileQuestion className="w-16 h-16" />
      </div>
      <h1 className="text-4xl font-black text-white tracking-tight">404 - Page Not Found</h1>
      <p className="text-slate-400 text-sm mt-2 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-2xl shadow-xl flex items-center gap-2 transition-all"
      >
        <Home className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
};
