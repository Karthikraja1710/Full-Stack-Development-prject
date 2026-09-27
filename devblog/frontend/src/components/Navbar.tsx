import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Terminal,
  PenSquare,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Compass,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                DevBlog
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-mono font-medium bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                v1.0
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive('/') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Home
            </Link>
            <Link
              to="/posts"
              className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive('/posts') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" /> Explore Posts
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/create"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-sm font-medium border border-indigo-500/30 transition-all hover:scale-[1.02]"
                >
                  <PenSquare className="w-4 h-4" /> Create Post
                </Link>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive('/dashboard') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>

                <div className="h-4 w-px bg-slate-800" />

                <div className="flex items-center gap-3">
                  <Link
                    to={`/authors/${user?.id}`}
                    className="flex items-center gap-2 text-sm text-slate-300 hover:text-white group"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-indigo-400 font-semibold group-hover:border-indigo-500/50">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{user?.name}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-indigo-400 font-medium py-2"
          >
            Home
          </Link>
          <Link
            to="/posts"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-indigo-400 font-medium py-2"
          >
            Explore Posts
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-indigo-300 font-medium py-2"
              >
                + Create Post
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-indigo-400 font-medium py-2"
              >
                Dashboard
              </Link>
              <Link
                to={`/authors/${user?.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-indigo-400 font-medium py-2"
              >
                Profile ({user?.name})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left text-rose-400 font-medium py-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center text-slate-300 bg-slate-900 border border-slate-800 py-2 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center text-white bg-indigo-600 py-2 rounded-lg font-medium"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
