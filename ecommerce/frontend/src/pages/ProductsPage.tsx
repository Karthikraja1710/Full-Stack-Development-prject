import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import type { Product } from '../types';
import { ProductGrid } from '../components/ProductGrid';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { ErrorMessage } from '../components/ErrorMessage';
import { ArrowUpDown } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const { addToCart } = useCart();
  const { showToast } = useToast();

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError('');

    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (sortBy) params.append('sort_by', sortBy);
    if (order) params.append('order', order);

    try {
      const response = await api.get<Product[]>(`/api/products?${params.toString()}`);
      setProducts(response.data);

      // Extract unique categories dynamically
      const uniqueCats = Array.from(new Set(response.data.map((p) => p.category)));
      if (uniqueCats.length > 0) {
        setCategories((prev) => Array.from(new Set([...prev, ...uniqueCats])));
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to fetch products.');
    } finally {
      setIsLoading(false);
    }
  }, [category, search, sortBy, order]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId, 1);
      showToast('Item Added to Cart', 'Product successfully added to your shopping cart.', 'success');
    } catch (err: any) {
      showToast('Error', err?.response?.data?.detail || 'Failed to add item to cart.', 'error');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setSortBy('created_at');
    setOrder('desc');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Product Catalog</h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore our wide range of authentic products with real-time stock availability.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-xl space-y-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
          <CategoryFilter
            categories={categories.length > 0 ? categories : ['Electronics', 'Fashion', 'Home & Kitchen']}
            selectedCategory={category}
            onSelectCategory={setCategory}
          />

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <select
                value={`${sortBy}-${order}`}
                onChange={(e) => {
                  const [s, o] = e.target.value.split('-');
                  setSortBy(s);
                  setOrder(o as 'asc' | 'desc');
                }}
                className="appearance-none pl-9 pr-8 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="created_at-desc">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && <ErrorMessage message={error} onRetry={fetchProducts} />}

      {/* Product Grid */}
      <ProductGrid
        products={products}
        isLoading={isLoading}
        onAddToCart={handleAddToCart}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};
