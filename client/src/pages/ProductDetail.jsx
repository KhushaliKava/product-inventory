import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Calendar,
  User,
  Tag,
  Package,
  Layers,
  AlertCircle
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StockBadge from '../components/StockBadge';
import Loader from '../components/Loader';
import ConfirmModal from '../components/ConfirmModal';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Delete state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data?.success) {
          setProduct(res.data.data);
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Product not found or failed to load';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/products/${id}`);
      success('Product removed successfully');
      navigate('/products');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete product';
      toastError(msg);
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Loader message="Loading product details..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-sm">
          <AlertCircle size={44} className="text-rose-500 mb-4" />
          <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2">
            Product Not Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {error || 'The requested product could not be located.'}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(product.price || 0);

  const formattedCreatedDate = new Date(product.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const imageUrl = product.image?.startsWith('/')
    ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${product.image}`
    : product.image;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors">
      {/* Top Breadcrumb & Nav */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </Link>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <Link
              to={`/admin/products/${product._id}/edit`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-all cursor-pointer"
            >
              <Edit3 size={15} />
              <span>Edit</span>
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all cursor-pointer"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 size={15} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors">
        {/* Left: Product Image */}
        <div className="relative w-full h-80 sm:h-96 lg:h-[450px] bg-slate-100 dark:bg-slate-800/60 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center">
          {product.image && !imageError ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500">
              <Package size={64} />
              <span className="text-sm">No image provided for this item</span>
            </div>
          )}
        </div>

        {/* Right: Product Information */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
              <Layers size={13} /> {product.category}
            </span>
            <StockBadge stock={product.stock} size="lg" />
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight leading-snug mb-3">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 mb-4">
            <span className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white tracking-tight">
              {formattedPrice}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Available Units: <strong className="text-slate-900 dark:text-white">{product.stock}</strong>
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Product Description
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Audit / Metadata Info */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Tag size={14} /> Product ID:
              </span>
              <code className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700">
                {product._id}
              </code>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <User size={14} /> Added By:
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {product.createdBy?.name || 'Administrator'}
                {product.createdBy?.email ? ` (${product.createdBy.email})` : ''}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Calendar size={14} /> Date Added:
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{formattedCreatedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Product"
        itemName={product.name}
        message="Are you sure you want to delete this product? It will be permanently removed from inventory."
        confirmText="Confirm Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleting}
      />
    </div>
  );
};

export default ProductDetail;
