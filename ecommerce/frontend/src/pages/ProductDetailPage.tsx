import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import type { Product } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { ShoppingCart, Plus, Minus, ArrowLeft, AlertCircle, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError('');
        const res = await api.get<Product>(`/api/products/${id}`);
        setProduct(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.detail || 'Product not found.');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || product.stock_quantity <= 0 || isAdding) return;
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity);
      showToast('Added to Cart', `Added ${quantity} x "${product.name}" to your shopping cart.`, 'success');
    } catch (err: any) {
      showToast('Error', err?.response?.data?.detail || 'Failed to add item to cart.', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <ErrorMessage message={error || 'Product not found'} />
        <Link to="/products" className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 mt-4">
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Back Button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Product Catalog</span>
      </Link>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Image */}
        <div className="lg:col-span-6 relative aspect-square w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
          <img
            src={
              product.image_url ||
              'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'
            }
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-950 text-brand-400 border border-brand-500/20 inline-block mb-3">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              {product.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-4 border-y border-slate-800 py-4">
            <span className="text-3xl font-black text-white tracking-tight">
              ${product.price.toFixed(2)}
            </span>
            <div>
              {isOutOfStock ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-rose-950 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stock_quantity} available)
                </span>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Description
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {product.description || 'High quality product carefully curated for ShopSphere customers.'}
            </p>
          </div>

          {/* Quantity Selector & Add to Cart Action */}
          {!isOutOfStock && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Quantity:
                </span>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-2xl p-1.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-slate-400 hover:text-white disabled:opacity-30 rounded-xl hover:bg-slate-900 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    disabled={quantity >= product.stock_quantity}
                    className="p-2 text-slate-400 hover:text-white disabled:opacity-30 rounded-xl hover:bg-slate-900 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-black rounded-2xl shadow-xl shadow-brand-950/50 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
              >
                <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
                <span>{isAdding ? 'Adding to Cart...' : 'Add to Shopping Cart'}</span>
              </button>
            </div>
          )}

          {/* Guarantee bar */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Fast Free Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span>Genuine Quality Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
