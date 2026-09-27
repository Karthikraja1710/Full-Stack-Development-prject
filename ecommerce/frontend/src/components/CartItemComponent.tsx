import React, { useState } from 'react';
import type { CartItem } from '../types';
import { Plus, Minus, Trash2, AlertCircle } from 'lucide-react';

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (itemId: number, quantity: number) => Promise<void>;
  onRemoveItem: (itemId: number) => Promise<void>;
}

export const CartItemComponent: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const product = item.product;
  const isMaxStockReached = item.quantity >= (product?.stock_quantity || 0);

  const handleIncrement = async () => {
    if (isMaxStockReached || isUpdating) return;
    setIsUpdating(true);
    setErrorMsg('');
    try {
      await onUpdateQuantity(item.id, item.quantity + 1);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.detail || 'Failed to update quantity.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrement = async () => {
    if (item.quantity <= 1 || isUpdating) return;
    setIsUpdating(true);
    setErrorMsg('');
    try {
      await onUpdateQuantity(item.id, item.quantity - 1);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.detail || 'Failed to update quantity.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await onRemoveItem(item.id);
    } catch (err) {
      // Handled by parent
    } finally {
      setIsUpdating(false);
    }
  };

  if (!product) return null;

  const itemTotal = (product.price * item.quantity).toFixed(2);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-xl shadow-lg">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <img
          src={
            product.image_url ||
            'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'
          }
          alt={product.name}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-slate-950 shrink-0 border border-slate-800"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800 inline-block mb-1">
            {product.category}
          </span>
          <h4 className="font-bold text-sm sm:text-base text-slate-100 truncate">{product.name}</h4>
          <p className="text-xs text-brand-400 font-bold mt-0.5">${product.price.toFixed(2)} each</p>
          {errorMsg && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {errorMsg}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
        {/* Quantity Controls */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-2xl p-1">
          <button
            onClick={handleDecrement}
            disabled={item.quantity <= 1 || isUpdating}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded-xl hover:bg-slate-900 transition-colors"
            title="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-bold text-slate-100">{item.quantity}</span>
          <button
            onClick={handleIncrement}
            disabled={isMaxStockReached || isUpdating}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded-xl hover:bg-slate-900 transition-colors"
            title={isMaxStockReached ? 'Maximum available stock reached' : 'Increase quantity'}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Item Total Price */}
        <div className="text-right min-w-[80px]">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Total</span>
          <span className="text-base font-black text-white">${itemTotal}</span>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={isUpdating}
          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
          title="Remove item from cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
