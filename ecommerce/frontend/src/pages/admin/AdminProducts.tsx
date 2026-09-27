import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import type { Product, ProductCreate } from '../../types';
import { ProductFormModal } from '../../components/ProductFormModal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Plus, Edit3, Trash2, Package, Search } from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete dialog states
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get<Product[]>('/api/products');
      setProducts(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to fetch products.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreateOrUpdateProduct = async (data: ProductCreate) => {
    setIsSaving(true);
    try {
      if (productToEdit) {
        await api.put(`/api/products/${productToEdit.id}`, data);
        showToast('Product Updated', `"${data.name}" was updated successfully.`, 'success');
      } else {
        await api.post('/api/products', data);
        showToast('Product Created', `"${data.name}" was added to catalog.`, 'success');
      }
      fetchProducts();
    } catch (err: any) {
      showToast('Error', err?.response?.data?.detail || 'Failed to save product.', 'error');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteProductId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/products/${deleteProductId}`);
      showToast('Product Deleted', 'Product removed from store.', 'info');
      setDeleteProductId(null);
      fetchProducts();
    } catch (err: any) {
      showToast('Error', err?.response?.data?.detail || 'Failed to delete product.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Package className="w-4 h-4" />
            <span>Admin Product Management</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">Product Catalog</h1>
        </div>

        <button
          onClick={() => {
            setProductToEdit(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter products by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
        />
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchProducts} />}

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner message="Fetching product catalog..." />
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            product.image_url ||
                            'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'
                          }
                          alt={product.name}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-800"
                        />
                        <div>
                          <div className="font-bold text-slate-100 text-sm">{product.name}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-300">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-black text-white text-sm">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.stock_quantity <= 0 ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-500/30">
                          Out of Stock
                        </span>
                      ) : product.stock_quantity <= 5 ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                          Low Stock ({product.stock_quantity})
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          {product.stock_quantity} in stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setProductToEdit(product);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteProductId(product.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        productToEdit={productToEdit}
        isLoading={isSaving}
        onClose={() => {
          setIsModalOpen(false);
          setProductToEdit(null);
        }}
        onSubmit={handleCreateOrUpdateProduct}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteProductId}
        title="Delete Product"
        message="Are you sure you want to delete this product? It will be removed from the store catalog."
        confirmText="Yes, Delete"
        isLoading={isDeleting}
        onConfirm={handleDeleteProduct}
        onClose={() => setDeleteProductId(null)}
      />
    </div>
  );
};
