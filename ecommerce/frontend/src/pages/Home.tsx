import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import type { Product } from '../types';
import { ProductGrid } from '../components/ProductGrid';
import { ShoppingBag, Sparkles, ArrowRight, ShieldCheck, Truck, Clock, RefreshCw } from 'lucide-react';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get<Product[]>('/api/products');
        setProducts(res.data.slice(0, 8));
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId, 1);
      showToast('Item Added to Cart', 'Product successfully added to your shopping cart.', 'success');
    } catch (err: any) {
      showToast('Error', err?.response?.data?.detail || 'Failed to add item to cart.', 'error');
    }
  };

  return (
    <div className="space-y-12 pb-16 animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-14 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Next-Gen E-Commerce Experience</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Discover Quality Products at <span className="text-brand-400">ShopSphere</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Welcome to ShopSphere, your premium online marketplace for cutting-edge electronics, fashion trends, and lifestyle essentials.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/products"
              className="px-6 py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-sm rounded-2xl shadow-xl shadow-brand-950/50 flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Free Worldwide Shipping',
            desc: 'On all orders with no minimum spend required',
            icon: Truck,
          },
          {
            title: 'Secure Demo Checkout',
            desc: 'Simulated order processing with instant confirmation',
            icon: ShieldCheck,
          },
          {
            title: 'Real-Time Inventory',
            desc: 'Automated stock management & order tracking',
            icon: Clock,
          },
          {
            title: 'Easy Returns & Support',
            desc: '24/7 dedicated customer assistance',
            icon: RefreshCw,
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-start gap-4 backdrop-blur-xl"
            >
              <div className="p-3 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-xl shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-100">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Featured Products</h2>
            <p className="text-xs text-slate-400 mt-1">Handpicked trending items available in stock</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
          >
            <span>Browse All Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductGrid products={products} isLoading={isLoading} onAddToCart={handleAddToCart} />
      </section>
    </div>
  );
};
