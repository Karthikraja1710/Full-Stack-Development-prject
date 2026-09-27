import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Order } from '../types';
import { OrderCard } from '../components/OrderCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Package, ShoppingBag } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await api.get<Order[]>('/api/orders');
        setOrders(response.data);
      } catch (err: any) {
        setError(err?.response?.data?.detail || 'Failed to fetch order history.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading your order history..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider">
          <Package className="w-4 h-4" />
          <span>Customer Account</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight mt-1">My Orders</h1>
        <p className="text-xs text-slate-400 mt-0.5">Track and view your past orders</p>
      </div>

      {error && <ErrorMessage message={error} />}

      {orders.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No orders placed yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            You haven't placed any orders with ShopSphere yet. Browse our catalog and enjoy seamless shopping!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-2xl transition-all"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};
