import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus,
  RefreshCw,
  Boxes,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  PackageOpen
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useDebounce from '../hooks/useDebounce';
import ProductCard from '../components/ProductCard';
import FilterToolbar from '../components/FilterToolbar';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import { SkeletonGrid } from '../components/Loader';

const ProductList = () => {
  const { isAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter States
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchInput, 400);

  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);
  const [limit, setLimit] = useState(parseInt(searchParams.get('limit'), 10) || 12);

  // Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete Modal State
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/products/categories');
        if (res.data?.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.warn('Could not fetch categories list:', err);
      }
    };
    fetchCategories();
  }, []);

  // Sync state to URL search params
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (category) params.category = category;
    if (sort && sort !== 'newest') params.sort = sort;
    if (page > 1) params.page = page;
    if (limit !== 12) params.limit = limit;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, category, sort, page, limit, setSearchParams]);

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/products', {
        params: {
          search: debouncedSearch,
          category,
          sort,
          page,
          limit
        }
      });

      if (res.data?.success) {
        setProducts(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch inventory products. Please try again.';
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, sort, page, limit, toastError]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchChange = (val) => {
    setSearchInput(val);
    setPage(1);
  };

  const handleCategoryChange = (val) => {
    setCategory(val);
    setPage(1);
  };

  const handleSortChange = (val) => {
    setSort(val);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setCategory('');
    setSort('newest');
    setPage(1);
  };

  // Handle Delete
  const confirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/products/${productToDelete._id}`);
      success(`"${productToDelete.name}" deleted successfully`);
      setProductToDelete(null);
      fetchProducts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete product';
      toastError(msg);
    } finally {
      setDeleting(false);
    }
  };

  // Quick Stats Calculation
  const stats = useMemo(() => {
    const totalUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
    const outOfStockCount = products.filter((p) => p.stock === 0).length;
    const totalValue = products.reduce((acc, p) => acc + (p.price || 0) * (p.stock || 0), 0);

    return {
      totalUnits,
      lowStockCount,
      outOfStockCount,
      totalValue: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(totalValue)
    };
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            Warehouse & Stock Control
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            Product Inventory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
            Live catalog overview with real-time stock monitoring, pricing, and multi-tier filtering.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isAdmin && (
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-tr from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus size={18} />
              <span>Add Product</span>
            </Link>
          )}
        </div>
      </div>

      {/* Inventory Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Boxes size={24} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Total Catalog Items</span>
            <span className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white mt-0.5 block">
              {pagination.total || 0}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Stock Units on Page</span>
            <span className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white mt-0.5 block">
              {stats.totalUnits}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Low Stock Alerts</span>
            <span className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white mt-0.5 block">
              {stats.lowStockCount}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Page Inventory Value</span>
            <span className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white mt-0.5 block">
              {stats.totalValue}
            </span>
          </div>
        </div>
      </div>

      {/* Unified Filters Toolbar (Search + Category + Sort) */}
      <FilterToolbar
        search={searchInput}
        onSearchChange={handleSearchChange}
        placeholder="Search by product name..."
        categories={categories}
        selectedCategory={category}
        onCategoryChange={handleCategoryChange}
        sort={sort}
        onSortChange={handleSortChange}
      />

      {/* Main Content Area */}
      {loading ? (
        <SkeletonGrid count={limit} />
      ) : error ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center my-6 shadow-sm">
          <AlertTriangle size={40} className="text-rose-500 mb-4" />
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-2">
            Failed to Load Products
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
            {error}
          </p>
          <button
            onClick={fetchProducts}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title={searchInput || category ? 'No matching products found' : 'No products in inventory yet'}
          description={
            searchInput || category
              ? "We couldn't find any items matching your active search and filter criteria."
              : 'The warehouse catalog is currently empty. Get started by adding your first product.'
          }
          actionText={searchInput || category ? 'Clear Filters' : 'Refresh Catalog'}
          onAction={searchInput || category ? handleResetFilters : fetchProducts}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isAdmin={isAdmin}
                onDeleteClick={setProductToDelete}
              />
            ))}
          </div>

          <Pagination
            pagination={pagination}
            onPageChange={(newPage) => setPage(newPage)}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!productToDelete}
        title="Delete Product"
        itemName={productToDelete?.name}
        message="Are you sure you want to remove this item from the warehouse catalog? All inventory records for this item will be removed."
        confirmText="Confirm Delete"
        onConfirm={confirmDelete}
        onCancel={() => setProductToDelete(null)}
        loading={deleting}
      />
    </div>
  );
};

export default ProductList;
