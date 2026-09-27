import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-4 md:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white">DevBlog</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              A high-performance full-stack blogging platform built for developers to publish insights, discuss code, and collaborate.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/posts" className="hover:text-indigo-400 transition-colors">All Articles</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition-colors">Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition-colors">Create Account</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Tech Stack</h4>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-indigo-300">FastAPI</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-sky-300">React 19</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-blue-300">TypeScript</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-emerald-300">PostgreSQL</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-teal-300">Tailwind CSS</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-purple-300">JWT Auth</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DevBlog Platform. Built for Thiranex Internship Task 4.</p>
          <div className="flex items-center gap-2">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by Thiranex Intern</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
