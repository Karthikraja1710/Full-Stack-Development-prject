import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { CartItemComponent } from '../components/CartItemComponent';
import { CartSummaryComponent } from '../components/CartSummaryComponent';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ShoppingCart, ShoppingBag, ArrowLeft } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, isLoading, updateQuantity, removeItem } = useCart();
  const { showToast } = useToast();

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    try {
      await updateQuantity(itemId, quantity);
      showToast('Cart Updated', 'Item quantity updated.', 'info');
    } catch (err: any) {
      showToast('Error', err?.response?.data?.detail || 'Failed to update quantity.', 'error');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeItem(itemId);
      showToast('Item Removed', 'Product removed from your cart.', 'info');
    } catch (err: any) {
      showToast('Error', err?.response?.data?.detail || 'Failed to remove item.', 'error');
    }
  };

  if (isLoading && !cart) {
    return <LoadingSpinner message="Loading your shopping cart..." />;
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider">
            <ShoppingCart className="w-4 h-4" />
            <span>Shopping Cart</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Your Cart ({cart?.total_quantity || 0} items)
          </h1>
        </div>

        <Link
          to="/products"
          className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      {isEmpty ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Your cart is empty</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Looks like you haven't added any products to your cart yet. Explore our catalog and add items you love!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-2xl shadow-xl transition-all"
          >
            Start Shopping Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Item List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <CartItemComponent
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            ))}
          </div>

          {/* Cart Summary Card */}
          <div className="lg:col-span-4">
            {cart && <CartSummaryComponent summary={cart} />}
          </div>
        </div>
      )}
    </div>
  );
};
