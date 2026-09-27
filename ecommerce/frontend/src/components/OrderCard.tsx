import React from 'react';
import { Link } from 'react-router-dom';
import type { Order, OrderStatus } from '../types';
import { Package, Calendar, MapPin, Eye, CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const statusStyles: Record<OrderStatus, { bg: string; icon: any }> = {
    Pending: { bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400', icon: Clock },
    Confirmed: { bg: 'bg-sky-500/10 border-sky-500/30 text-sky-400', icon: CheckCircle2 },
    Processing: { bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400', icon: Package },
    Shipped: { bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400', icon: Truck },
    Delivered: { bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', icon: CheckCircle2 },
    Cancelled: { bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400', icon: XCircle },
  };

  const statusConfig = statusStyles[order.status] || statusStyles.Pending;
  const StatusIcon = statusConfig.icon;

  const formattedDate = new Date(order.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-slate-700 transition-all backdrop-blur-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Order #{order.id}</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border ${statusConfig.bg} flex items-center gap-1.5 self-start sm:self-center`}
        >
          <StatusIcon className="w-4 h-4" />
          {order.status}
        </span>
      </div>

      {/* Shipping destination & Items Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1">
            Shipping Destination
          </span>
          <p className="font-semibold text-slate-200">{order.shipping_name}</p>
          <p className="text-slate-400 mt-0.5 leading-relaxed flex items-start gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{order.shipping_address}</span>
          </p>
        </div>

        <div>
          <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1">
            Order Items ({order.items.length})
          </span>
          <div className="space-y-1">
            {order.items.slice(0, 2).map((item) => (
              <div key={item.id} className="flex justify-between text-slate-300">
                <span className="truncate max-w-[200px]">
                  {item.quantity}x {item.product?.name || 'Product'}
                </span>
                <span className="font-semibold">${(item.unit_price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            {order.items.length > 2 && (
              <p className="text-[11px] text-slate-500 italic">
                + {order.items.length - 2} more item(s)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Total & Link */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-semibold block">Total Amount</span>
          <span className="text-xl font-black text-white">${order.total_amount.toFixed(2)}</span>
        </div>

        <Link
          to={`/orders/${order.id}`}
          className="px-4 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition-all"
        >
          <Eye className="w-4 h-4" />
          View Details
        </Link>
      </div>
    </div>
  );
};
