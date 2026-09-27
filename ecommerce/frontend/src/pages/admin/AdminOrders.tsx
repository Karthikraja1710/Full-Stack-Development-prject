import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import type { Order, OrderStatus } from '../../types';
import { OrderTable } from '../../components/OrderTable';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ShoppingBag, Filter } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const url = statusFilter ? `/api/admin/orders?status=${statusFilter}` : '/api/admin/orders';
      const response = await api.get<Order[]>(url);
      setOrders(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to fetch admin orders.');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, { status });
      showToast('Status Updated', `Order #${orderId} status changed to "${status}".`, 'success');
      fetchOrders();
    } catch (err: any) {
      showToast('Error', err?.response?.data?.detail || 'Failed to update order status.', 'error');
    }
  };

  const handleViewOrderDetails = (order: Order) => {
    navigate(`/orders/${order.id}`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShoppingBag className="w-4 h-4" />
            <span>Admin Order Management</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">Customer Orders</h1>
        </div>

        {/* Status Filter Dropdown */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-9 pr-8 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchOrders} />}

      {isLoading ? (
        <LoadingSpinner message="Fetching customer orders..." />
      ) : (
        <OrderTable
          orders={orders}
          onStatusChange={handleStatusChange}
          onViewOrderDetails={handleViewOrderDetails}
        />
      )}
    </div>
  );
};
