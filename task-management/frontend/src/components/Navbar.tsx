import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Plus, LogOut, Menu } from 'lucide-react';

interface NavbarProps {
  onOpenMobileSidebar: () => void;
  onOpenCreateTaskModal: () => void;
  isWsConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileSidebar,
  onOpenCreateTaskModal,
  isWsConnected = true,
}) => {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-xl px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left side: Mobile menu toggle + Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-brand-950/50">
            <CheckSquare className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-lg font-black text-white tracking-tight">TaskFlow</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
              SaaS v1.0
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Live Sync, Create Button, Profile Menu */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Real-time WebSockets Live Sync Indicator */}
        <div
          title={isWsConnected ? 'Real-time WebSocket Sync Active' : 'Offline / Reconnecting'}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isWsConnected ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isWsConnected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
          </span>
          <span className="text-slate-400">Sync:</span>
          <span className={isWsConnected ? 'text-emerald-400' : 'text-amber-400'}>
            {isWsConnected ? 'Live' : 'Connecting'}
          </span>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onOpenCreateTaskModal}
          className="px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-brand-950/50 flex items-center gap-1.5 transition-all transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Task</span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 font-bold text-xs flex items-center justify-center">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hidden sm:inline-block text-xs font-semibold text-slate-200 pr-1">
              {user?.name || 'User'}
            </span>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in">
              <div className="px-3 py-2.5 border-b border-slate-800 mb-1">
                <p className="text-xs font-bold text-slate-200">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
