import React from 'react';
import type { Order, OrderStatus } from '../types';
import { Eye, Calendar } from 'lucide-react';

interface OrderTableProps {
  orders: Order[];
  onStatusChange: (orderId: number, status: OrderStatus) => Promise<void>;
  onViewOrderDetails: (order: Order) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onStatusChange,
  onViewOrderDetails,
}) => {
  const statusBadges: Record<OrderStatus, string> = {
    Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Confirmed: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    Processing: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    Shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    Delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  if (orders.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center my-6">
        <p className="text-slate-400 text-sm font-medium">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl mb-8">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status Action</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {orders.map((order) => {
              const dateStr = new Date(order.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-white whitespace-nowrap">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-100">{order.shipping_name}</div>
                    <div className="text-xs text-slate-400 truncate">{order.shipping_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{dateStr}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-black text-white">
                    ${order.total_amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                        statusBadges[order.status] || 'bg-slate-950 border-slate-800 text-slate-200'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => onViewOrderDetails(order)}
                      className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors"
                      title="Inspect Order Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
