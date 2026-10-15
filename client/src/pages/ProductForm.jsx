import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Upload,
  Link as LinkIcon,
  Package,
  Layers,
  DollarSign,
  Boxes,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';

const ProductForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageInputMode, setImageInputMode] = useState('url');

  const [existingCategories, setExistingCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // Fetch categories for suggestion dropdown
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/products/categories');
        if (res.data?.success) {
          setExistingCategories(res.data.data);
        }
      } catch (err) {
        console.warn('Could not fetch categories:', err);
      }
    };
    fetchCats();
  }, []);

  // If in edit mode, fetch existing product
  useEffect(() => {
    if (!isEditMode) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data?.success) {
          const p = res.data.data;
          setFormData({
            name: p.name || '',
            description: p.description || '',
            price: p.price !== undefined ? p.price.toString() : '',
            stock: p.stock !== undefined ? p.stock.toString() : '',
            category: p.category || '',
            image: p.image || ''
          });
          if (p.image) {
            setPreviewUrl(
              p.image.startsWith('/')
                ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${p.image}`
                : p.image
            );
          }
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to load product data for editing';
        setGeneralError(msg);
        toastError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode, toastError]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (errors.image) setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, image: url }));
    setPreviewUrl(url);
    setSelectedFile(null);
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Product name is required';
    } else if (formData.name.trim().length < 2 || formData.name.trim().length > 100) {
      errs.name = 'Product name must be between 2 and 100 characters';
    }

    if (!formData.description.trim()) {
      errs.description = 'Description is required';
    } else if (formData.description.trim().length > 1000) {
      errs.description = 'Description cannot exceed 1000 characters';
    }

    if (formData.price === '' || isNaN(Number(formData.price))) {
      errs.price = 'Price is required and must be a valid number';
    } else if (Number(formData.price) < 0) {
      errs.price = 'Price cannot be negative';
    }

    if (formData.stock === '' || isNaN(Number(formData.stock))) {
      errs.stock = 'Stock count is required and must be an integer';
    } else if (!Number.isInteger(Number(formData.stock))) {
      errs.stock = 'Stock must be an integer';
    } else if (Number(formData.stock) < 0) {
      errs.stock = 'Stock cannot be negative';
    }

    if (!formData.category.trim()) {
      errs.category = 'Category is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      let payload;
      let headers = {};

      if (selectedFile) {
        const data = new FormData();
        data.append('name', formData.name.trim());
        data.append('description', formData.description.trim());
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('category', formData.category.trim());
        data.append('image', selectedFile);
        payload = data;
        headers = { 'Content-Type': 'multipart/form-data' };
      } else {
        payload = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: Number(formData.price),
          stock: parseInt(formData.stock, 10),
          category: formData.category.trim(),
          image: formData.image.trim()
        };
      }

      if (isEditMode) {
        await api.put(`/products/${id}`, payload, { headers });
        success(`"${formData.name}" updated successfully!`);
        navigate(`/products/${id}`);
      } else {
        await api.post('/products', payload, { headers });
        success(`"${formData.name}" added to inventory!`);
        navigate('/products');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Failed to save product. Please verify all fields.';
      setGeneralError(msg);
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Loader message="Loading product data..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to={isEditMode ? `/products/${id}` : '/products'}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{isEditMode ? 'Cancel Edit' : 'Back to Inventory'}</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-8 shadow-sm transition-colors">
        <div className="flex items-center gap-4 pb-4 mb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
            <Package size={24} />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">
              {isEditMode ? 'Edit Product Details' : 'Add New Inventory Item'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isEditMode
                ? 'Update pricing, inventory stock level, and product specifications'
                : 'Enter complete product specifications to publish to the active catalog'}
            </p>
          </div>
        </div>

        {generalError && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs font-semibold mb-6">
            <AlertCircle size={18} className="shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Core Fields */}
            <div className="space-y-5">
              {/* Product Name */}
              <div>
                <label htmlFor="prod-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Package className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" size={18} />
                  <input
                    id="prod-name"
                    type="text"
                    className={`w-full bg-slate-50 dark:bg-slate-800/70 border rounded-xl text-slate-900 dark:text-white text-sm pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all ${
                      errors.name
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                    }`}
                    placeholder="e.g. Sony WH-1000XM5 Headphones"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    maxLength={100}
                  />
                </div>
                {errors.name && <span className="text-xs text-rose-500 font-medium mt-1 block">{errors.name}</span>}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="prod-category" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Layers className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" size={18} />
                  <input
                    id="prod-category"
                    type="text"
                    list="categories-list"
                    className={`w-full bg-slate-50 dark:bg-slate-800/70 border rounded-xl text-slate-900 dark:text-white text-sm pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all ${
                      errors.category
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                    }`}
                    placeholder="e.g. Audio, Electronics, Wearables"
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value });
                      if (errors.category) setErrors((prev) => ({ ...prev, category: '' }));
                    }}
                  />
                  <datalist id="categories-list">
                    {existingCategories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                {errors.category && <span className="text-xs text-rose-500 font-medium mt-1 block">{errors.category}</span>}
              </div>

              {/* Price & Stock Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="prod-price" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Price (USD) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <DollarSign className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" size={18} />
                    <input
                      id="prod-price"
                      type="number"
                      step="0.01"
                      min="0"
                      className={`w-full bg-slate-50 dark:bg-slate-800/70 border rounded-xl text-slate-900 dark:text-white text-sm pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all ${
                        errors.price
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                      }`}
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => {
                        setFormData({ ...formData, price: e.target.value });
                        if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
                      }}
                    />
                  </div>
                  {errors.price && <span className="text-xs text-rose-500 font-medium mt-1 block">{errors.price}</span>}
                </div>

                <div>
                  <label htmlFor="prod-stock" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Stock Units <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Boxes className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" size={18} />
                    <input
                      id="prod-stock"
                      type="number"
                      step="1"
                      min="0"
                      className={`w-full bg-slate-50 dark:bg-slate-800/70 border rounded-xl text-slate-900 dark:text-white text-sm pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all ${
                        errors.stock
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                      }`}
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) => {
                        setFormData({ ...formData, stock: e.target.value });
                        if (errors.stock) setErrors((prev) => ({ ...prev, stock: '' }));
                      }}
                    />
                  </div>
                  {errors.stock && <span className="text-xs text-rose-500 font-medium mt-1 block">{errors.stock}</span>}
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="prod-description" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">{formData.description.length} / 1000</span>
                </div>
                <textarea
                  id="prod-description"
                  rows={4}
                  className={`w-full bg-slate-50 dark:bg-slate-800/70 border rounded-xl text-slate-900 dark:text-white text-sm p-3.5 outline-none focus:ring-2 focus:ring-indigo-500/30 resize-y transition-all ${
                    errors.description
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                  }`}
                  placeholder="Detailed specifications, features, key selling points..."
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                  }}
                  maxLength={1000}
                />
                {errors.description && (
                  <span className="text-xs text-rose-500 font-medium mt-1 block">{errors.description}</span>
                )}
              </div>
            </div>

            {/* Right Column: Image Upload & Preview */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Product Image
                </label>

                {/* Mode Selector Tabs */}
                <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 mb-3">
                  <button
                    type="button"
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      imageInputMode === 'url'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    onClick={() => setImageInputMode('url')}
                  >
                    <LinkIcon size={13} /> Image Web URL
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      imageInputMode === 'file'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    onClick={() => setImageInputMode('file')}
                  >
                    <Upload size={13} /> File Upload
                  </button>
                </div>

                {imageInputMode === 'url' ? (
                  <div className="relative flex items-center">
                    <LinkIcon className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" size={18} />
                    <input
                      type="url"
                      className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.image}
                      onChange={handleUrlChange}
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-6 text-center bg-slate-50 dark:bg-slate-800/50 cursor-pointer transition-colors">
                    <input
                      type="file"
                      id="file-upload-input"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload-input" className="flex flex-col items-center cursor-pointer">
                      <Upload size={28} className="text-indigo-600 dark:text-indigo-400 mb-2" />
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Click to choose image file
                      </span>
                      <span className="text-xs text-slate-400 mt-1">PNG, JPG, WebP up to 5MB</span>
                      {selectedFile && (
                        <span className="mt-3 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                          {selectedFile.name}
                        </span>
                      )}
                    </label>
                  </div>
                )}
              </div>

              {/* Live Preview Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                  <ImageIcon size={15} /> Live Preview
                </div>
                <div className="w-full h-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 overflow-hidden flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                      onError={() => setPreviewUrl('')}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
                      <Package size={36} />
                      <span className="text-xs">Image preview will show here</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-slate-200 dark:border-slate-800">
            <Link
              to={isEditMode ? `/products/${id}` : '/products'}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-tr from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50"
              disabled={submitting}
            >
              <Save size={18} />
              <span>{submitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
