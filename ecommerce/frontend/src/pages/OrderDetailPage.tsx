import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import type { Order } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { ArrowLeft, Package, Calendar, MapPin, User, Mail, Phone, CheckCircle2, ShieldCheck } from 'lucide-react';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setError('');
        const res = await api.get<Order>(`/api/orders/${id}`);
        setOrder(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.detail || 'Order not found or access denied.');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner message="Loading order details..." />;
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto py-12">
        <ErrorMessage message={error || 'Order not found'} />
        <Link to="/orders" className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 mt-4">
          <ArrowLeft className="w-4 h-4" /> Return to My Orders
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(order.created_at).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Navigation link */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Order History
      </Link>

      {/* Main Order Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
        {/* Banner Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
                Order Receipt
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Confirmed
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              Order #{order.id}
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Placed on {formattedDate}</span>
            </p>
          </div>

          <div className="text-left sm:text-right bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-500 font-bold uppercase block">Current Status</span>
            <span className="text-lg font-extrabold text-emerald-400">{order.status}</span>
          </div>
        </div>

        {/* Shipping Information & Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-950/60 rounded-2xl border border-slate-800">
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4 text-brand-400" />
              Recipient Details
            </h4>
            <p className="text-sm font-bold text-slate-100">{order.shipping_name}</p>
            <p className="text-xs text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              {order.shipping_email}
            </p>
            <p className="text-xs text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              {order.shipping_phone}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-400" />
              Delivery Destination
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">{order.shipping_address}</p>
          </div>
        </div>

        {/* Order Items Table */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-brand-400" />
            Purchased Items
          </h4>
          <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-2xl overflow-hidden">
            {order.items.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4 bg-slate-950/40">
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={
                      item.product?.image_url ||
                      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={item.product?.name}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-800"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-100 truncate">
                      {item.product?.name || 'Product'}
                    </p>
                    <p className="text-xs text-slate-400">
                      ${item.unit_price.toFixed(2)} x {item.quantity} unit(s)
                    </p>
                  </div>
                </div>

                <span className="font-bold text-sm text-white shrink-0">
                  ${(item.unit_price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Calculation Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-col items-end space-y-2 text-xs">
          <div className="flex justify-between w-full max-w-xs text-slate-400">
            <span>Items Subtotal</span>
            <span className="text-slate-200">${order.total_amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-full max-w-xs text-slate-400">
            <span>Shipping</span>
            <span className="text-emerald-400 font-bold">FREE</span>
          </div>
          <div className="flex justify-between w-full max-w-xs text-base font-bold text-white pt-2 border-t border-slate-800">
            <span>Total Paid</span>
            <span className="text-2xl font-black text-brand-400">${order.total_amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-2 text-xs text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Demo Checkout Process Complete — Order is being processed by ShopSphere.</span>
        </div>
      </div>
    </div>
  );
};
