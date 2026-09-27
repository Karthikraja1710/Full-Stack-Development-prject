import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import type { OrderCreate, Order } from '../types';
import { CheckoutForm } from '../components/CheckoutForm';
import { ErrorMessage } from '../components/ErrorMessage';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { user } = useAuth();
  const { cart, refreshCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
        <p className="text-xs text-slate-400">Please add items to your cart before proceeding to checkout.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-bold text-xs rounded-2xl"
        >
          <ShoppingBag className="w-4 h-4" /> Go to Shop
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (data: OrderCreate) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post<Order>('/api/orders', data);
      await refreshCart();
      showToast('Order Placed Successfully!', `Order #${response.data.id} has been confirmed.`, 'success');
      navigate(`/orders/${response.data.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Failed to place order. Please try again.';
      setError(msg);
      showToast('Order Failed', msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Cart
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tight">Checkout</h1>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <CheckoutForm
        cartSummary={cart}
        initialUserData={{ name: user?.name, email: user?.email }}
        isLoading={isLoading}
        onSubmitOrder={handleSubmitOrder}
      />
    </div>
  );
};
