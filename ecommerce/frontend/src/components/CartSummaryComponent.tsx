import React from 'react';
import { Link } from 'react-router-dom';
import type { CartSummary } from '../types';
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react';

interface CartSummaryProps {
  summary: CartSummary;
}

export const CartSummaryComponent: React.FC<CartSummaryProps> = ({ summary }) => {
  const subtotal = summary.subtotal;
  const shipping = 0.0; // Free shipping demo
  const total = (subtotal + shipping).toFixed(2);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6 sticky top-24">
      <h3 className="text-lg font-bold text-white tracking-tight pb-4 border-b border-slate-800">
        Order Summary
      </h3>

      <div className="space-y-3 text-xs">
        <div className="flex justify-between text-slate-300">
          <span>Subtotal ({summary.total_quantity} items)</span>
          <span className="font-semibold text-slate-100">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            Standard Shipping
          </span>
          <span className="font-semibold text-emerald-400">FREE</span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline">
        <span className="text-sm font-bold text-white">Estimated Total</span>
        <span className="text-2xl font-black text-brand-400 tracking-tight">${total}</span>
      </div>

      <Link
        to="/checkout"
        className="w-full py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold rounded-2xl shadow-xl shadow-brand-950/50 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
      >
        <span>Proceed to Checkout</span>
        <ArrowRight className="w-4 h-4 stroke-[3]" />
      </Link>

      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Safe & Secure Demo Checkout</span>
      </div>
    </div>
  );
};
