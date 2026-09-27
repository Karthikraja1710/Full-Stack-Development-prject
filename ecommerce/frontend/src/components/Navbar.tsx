import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ShoppingCart, Shield, LogOut, Package, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-xl px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Trigger + Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-brand-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-brand-950/50">
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tight">ShopSphere</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Thiranex Task 3
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-slate-800 rounded-full px-3 py-1.5 shadow-inner">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive ? 'bg-brand-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive ? 'bg-brand-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`
            }
          >
            Shop Products
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive ? 'bg-brand-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`
              }
            >
              My Orders
            </NavLink>
          )}
        </nav>

        {/* Right: Admin Button, Cart Badge, Profile */}
        <div className="flex items-center gap-3">
          {/* Admin Dashboard Quick Link */}
          {isAdmin && (
            <Link
              to="/admin"
              className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-950/50 flex items-center gap-1.5 transition-all transform hover:scale-105"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin Panel</span>
            </Link>
          )}

          {/* Cart Counter Button */}
          <Link
            to="/cart"
            className="relative p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white rounded-xl transition-all group"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-500 text-white font-bold text-[10px] flex items-center justify-center shadow-lg shadow-brand-950 animate-bounce">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* User Auth Dropdown */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 font-bold text-xs flex items-center justify-center">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline-block text-xs font-semibold text-slate-200 pr-1 max-w-[100px] truncate">
                  {user?.name}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2.5 border-b border-slate-800 mb-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-200 truncate">{user?.name}</p>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                        {user?.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                  </div>

                  <Link
                    to="/orders"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-xl transition-colors mb-1"
                  >
                    <Package className="w-4 h-4 text-brand-400" />
                    My Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-500/10 rounded-xl transition-colors mb-1"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 pb-2 border-t border-slate-800 mt-3 space-y-2 animate-fade-in">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900 rounded-xl"
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900 rounded-xl"
          >
            Shop Products
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900 rounded-xl"
            >
              My Orders
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-sm font-semibold text-amber-400 hover:bg-amber-500/10 rounded-xl"
            >
              Admin Panel
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
};
