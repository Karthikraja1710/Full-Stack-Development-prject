import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShoppingBag, Lock, Mail, Eye, EyeOff, ArrowRight, Shield, User as UserIcon } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      showToast('Welcome Back!', 'Successfully signed in to ShopSphere', 'success');
      navigate('/products');
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Invalid email or password.';
      setError(msg);
      showToast('Login Failed', msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoUser = () => {
    setEmail('user@shopsphere.com');
    setPassword('user123');
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@shopsphere.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-xl shadow-brand-950/50">
            <ShoppingBag className="w-7 h-7 stroke-[2.5]" />
          </div>
          <span className="text-3xl font-black text-white tracking-tight">ShopSphere</span>
        </div>
        <h2 className="mt-6 text-center text-2xl font-extrabold text-slate-100 tracking-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-xs text-slate-400">
          Thiranex Internship Task 3 - E-Commerce Application
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0 space-y-6">
        {/* Quick Demo Login Preset Buttons */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs space-y-2.5 backdrop-blur-xl">
          <span className="font-bold text-slate-300 block uppercase tracking-wider text-[10px]">
            ⚡ Quick Demo Accounts (Click to Autofill):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleFillDemoUser}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-200 font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5 text-brand-400" />
              Demo User
            </button>
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-amber-300 font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Demo Admin
            </button>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl py-8 px-6 sm:px-10 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-6 p-4 bg-rose-950/50 border border-rose-500/30 rounded-2xl text-rose-200 text-xs leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold rounded-xl shadow-lg shadow-brand-950/50 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] disabled:opacity-50"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-800 pt-6">
            <p className="text-xs text-slate-400">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-brand-400 hover:text-brand-300 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
