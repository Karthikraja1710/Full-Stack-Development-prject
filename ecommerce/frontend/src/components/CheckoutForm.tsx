import React, { useState } from 'react';
import type { OrderCreate, CartSummary } from '../types';
import { User, Mail, Phone, MapPin, Building, LandPlot, Hash, CheckCircle2, ShieldCheck } from 'lucide-react';

interface CheckoutFormProps {
  cartSummary: CartSummary;
  initialUserData?: { name?: string; email?: string };
  isLoading?: boolean;
  onSubmitOrder: (data: OrderCreate) => Promise<void>;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  cartSummary,
  initialUserData,
  isLoading = false,
  onSubmitOrder,
}) => {
  const [shippingName, setShippingName] = useState(initialUserData?.name || '');
  const [shippingEmail, setShippingEmail] = useState(initialUserData?.email || '');
  const [shippingPhone, setShippingPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = `${streetAddress}, ${city}, ${state} ${postalCode}`;
    await onSubmitOrder({
      shipping_name: shippingName,
      shipping_email: shippingEmail,
      shipping_phone: shippingPhone,
      shipping_address: fullAddress,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Shipping Address Inputs */}
      <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Shipping Information</h2>
          <p className="text-xs text-slate-400 mt-1">
            Please enter your delivery destination details for this order.
          </p>
        </div>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="John Doe"
                value={shippingName}
                onChange={(e) => setShippingName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Email & Phone Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={shippingEmail}
                  onChange={(e) => setShippingEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Phone Number <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Street Address <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="123 Innovation Way, Suite 400"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* City, State, Zip Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                City <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="New York"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                State <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="NY"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
                <LandPlot className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Postal Code <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="10001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Review Sidebar */}
      <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 h-fit">
        <h3 className="text-lg font-bold text-white tracking-tight pb-4 border-b border-slate-800">
          Order Summary ({cartSummary.total_quantity} items)
        </h3>

        {/* Item mini list */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {cartSummary.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={
                    item.product?.image_url ||
                    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={item.product?.name}
                  className="w-10 h-10 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-800"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-200 truncate">{item.product?.name}</p>
                  <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-bold text-slate-100">
                ${((item.product?.price || 0) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal</span>
            <span className="text-slate-200">${cartSummary.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Shipping</span>
            <span className="text-emerald-400 font-bold">FREE</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800/80">
            <span>Total Amount</span>
            <span className="text-xl font-black text-brand-400">${cartSummary.subtotal.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black rounded-2xl shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50"
        >
          {isLoading ? (
            <span>Placing Order...</span>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>Place Order (Demo Checkout)</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          No real payment required. Order will be processed instantly.
        </p>
      </div>
    </form>
  );
};
