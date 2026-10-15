import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Trash2, Package } from 'lucide-react';
import StockBadge from './StockBadge';

const ProductCard = ({ product, isAdmin, onDeleteClick }) => {
  const [imageError, setImageError] = useState(false);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(product.price || 0);

  const imageUrl = product.image?.startsWith('/')
    ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${product.image}`
    : product.image;

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative w-full h-52 bg-slate-100 dark:bg-slate-800/50 overflow-hidden">
        <Link to={`/products/${product._id}`} className="block w-full h-full">
          {product.image && !imageError ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/60">
              <Package size={36} />
              <span className="text-xs">No image provided</span>
            </div>
          )}
        </Link>
        <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950/75 backdrop-blur-md text-white border border-white/20 uppercase tracking-wider">
          {product.category}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-2">
          <StockBadge stock={product.stock} size="sm" />
        </div>

        <h3 className="font-heading font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          <Link to={`/products/${product._id}`}>{product.name}</Link>
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 mb-4 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Footer */}
        <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-auto">
          <span className="font-heading font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
            {formattedPrice}
          </span>

          <div className="flex items-center gap-1.5">
            <Link
              to={`/products/${product._id}`}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer"
              title="View details"
              aria-label="View product details"
            >
              <Eye size={16} />
            </Link>

            {isAdmin && (
              <>
                <Link
                  to={`/admin/products/${product._id}/edit`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-200 dark:hover:border-cyan-800 transition-all cursor-pointer"
                  title="Edit product"
                  aria-label="Edit product"
                >
                  <Edit3 size={15} />
                </Link>
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-800 transition-all cursor-pointer"
                  onClick={() => onDeleteClick(product)}
                  title="Delete product"
                  aria-label="Delete product"
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
