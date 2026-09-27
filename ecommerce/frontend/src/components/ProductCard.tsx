import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { ShoppingCart, Eye, Check, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => Promise<void>;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    try {
      await onAddToCart(product.id);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    } catch (err) {
      // Error handled by parent toast
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 hover:shadow-2xl transition-all flex flex-col justify-between group backdrop-blur-xl">
      <div>
        {/* Product Image Container */}
        <div className="relative aspect-4/3 w-full bg-slate-950 overflow-hidden">
          <img
            src={
              product.image_url ||
              'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'
            }
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80';
            }}
          />
          {/* Category Badge */}
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 border border-slate-700 text-slate-200 backdrop-blur-md">
            {product.category}
          </span>

          {/* Stock Badge */}
          <div className="absolute top-3 right-3">
            {isOutOfStock ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-950/90 text-rose-300 border border-rose-500/40 backdrop-blur-md flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-rose-400" />
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950/90 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                Only {product.stock_quantity} Left
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                In Stock
              </span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="p-5">
          <Link to={`/products/${product.id}`} className="group-hover:text-brand-400 transition-colors">
            <h3 className="font-bold text-base text-slate-100 line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description || 'Premium quality product available on ShopSphere.'}
          </p>
        </div>
      </div>

      {/* Footer Price & Add to Cart Action */}
      <div className="p-5 pt-0 flex items-center justify-between gap-3 border-t border-slate-800/60 mt-2">
        <div>
          <span className="text-xs font-semibold text-slate-400 block">Price</span>
          <span className="text-xl font-black text-white tracking-tight">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/products/${product.id}`}
            className="p-2.5 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors"
            title="View product details"
          >
            <Eye className="w-4 h-4" />
          </Link>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock || isAdding}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
              addedSuccess
                ? 'bg-emerald-600 text-white'
                : isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-950/50 hover:scale-105'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                Added!
              </>
            ) : isAdding ? (
              'Adding...'
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
