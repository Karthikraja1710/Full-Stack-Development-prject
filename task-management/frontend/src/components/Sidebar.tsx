import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, X, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { user, logout } = useAuth();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'All Tasks',
      path: '/tasks',
      icon: ListTodo,
    },
  ];

  const content = (
    <aside className="w-64 h-full bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between p-4 select-none">
      <div>
        {/* Navigation Items */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Main Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-950/50'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Project Context Badge */}
        <div className="mt-8 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 text-brand-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Thiranex Internship</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Task 2: Full-Stack Task Management Web Application
          </p>
        </div>
      </div>

      {/* User Footer */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-200 truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-[calc(100vh-65px)] sticky top-[65px] shrink-0">
        {content}
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
          />
          <div className="relative z-10 w-64 h-full bg-slate-950 shadow-2xl animate-slide-in">
            <button
              onClick={onCloseMobile}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  );
};
