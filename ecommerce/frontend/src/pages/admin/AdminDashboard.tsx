import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import type { AdminStats, Order } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Package, ShoppingBag, Clock, CheckCircle2, Users, DollarSign, ArrowRight, Shield } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setIsLoading(true);
        setError('');
        const [statsRes, ordersRes] = await Promise.all([
          api.get<AdminStats>('/api/admin/stats'),
          api.get<Order[]>('/api/admin/orders'),
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.slice(0, 5));
      } catch (err: any) {
        setError(err?.response?.data?.detail || 'Failed to fetch admin metrics.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading Admin Dashboard..." />;
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: stats ? `$${stats.total_revenue.toFixed(2)}` : '$0.00',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      title: 'Total Orders',
      value: stats?.total_orders || 0,
      icon: ShoppingBag,
      color: 'text-brand-400',
      bg: 'bg-brand-500/10',
      border: 'border-brand-500/20',
    },
    {
      title: 'Pending Orders',
      value: stats?.pending_orders || 0,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      title: 'Delivered Orders',
      value: stats?.delivered_orders || 0,
      icon: CheckCircle2,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
    },
    {
      title: 'Catalog Products',
      value: stats?.total_products || 0,
      icon: Package,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      title: 'Registered Users',
      value: stats?.total_users || 0,
      icon: Users,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Shield className="w-4 h-4" />
              <span>ShopSphere Admin Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Executive Store Overview
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-lg">
              Manage product inventory, process customer orders, and monitor sales performance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/products"
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-950/50 flex items-center gap-2 transition-all"
            >
              <Package className="w-4 h-4" />
              Manage Products
            </Link>
            <Link
              to="/admin/orders"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Manage Orders
            </Link>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* KPI Cards Grid */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Key Performance Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl border ${card.border} bg-slate-900/80 backdrop-blur-xl shadow-xl flex items-center justify-between transition-all hover:scale-[1.02]`}
              >
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {card.title}
                  </span>
                  <span className="text-3xl font-black text-white tracking-tight">{card.value}</span>
                </div>
                <div className={`p-3.5 rounded-2xl ${card.bg} ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Orders Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Recent Customer Orders</h2>
            <p className="text-xs text-slate-400">Latest orders submitted across the store</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center">
            <p className="text-slate-400 text-xs">No orders placed yet.</p>
          </div>
        ) : (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Order ID</th>
                    <th className="px-6 py-3.5">Customer</th>
                    <th className="px-6 py-3.5">Total Amount</th>
                    <th className="px-6 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-800/40">
                      <td className="px-6 py-4 font-bold text-white">#{o.id}</td>
                      <td className="px-6 py-4 font-semibold text-slate-200">{o.shipping_name}</td>
                      <td className="px-6 py-4 font-black text-white">${o.total_amount.toFixed(2)}</td>
                      <td className="px-6 py-4 font-bold text-emerald-400">{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
