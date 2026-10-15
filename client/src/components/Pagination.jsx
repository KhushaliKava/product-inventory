import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange, onLimitChange }) => {
  const { page = 1, limit = 10, total = 0, pages = 1 } = pagination || {};

  if (total === 0) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;

    if (pages <= maxVisible) {
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (page <= 3) {
        pageNumbers.push(1, 2, 3, 4, '...', pages);
      } else if (page >= pages - 2) {
        pageNumbers.push(1, '...', pages - 3, pages - 2, pages - 1, pages);
      } else {
        pageNumbers.push(1, '...', page - 1, page, page + 1, '...', pages);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-2 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm transition-colors">
      <div className="text-sm text-slate-600 dark:text-slate-400">
        Showing <span className="font-semibold text-slate-900 dark:text-white">{startItem}</span> to{' '}
        <span className="font-semibold text-slate-900 dark:text-white">{endItem}</span> of{' '}
        <span className="font-semibold text-slate-900 dark:text-white">{total}</span> products
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="limit-select" className="text-xs text-slate-500 dark:text-slate-400">Show:</label>
          <select
            id="limit-select"
            className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs px-2.5 py-1.5 outline-none cursor-pointer"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
          >
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="w-9 h-9 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous Page"
          >
            <ChevronLeft size={18} />
          </button>

          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`dots-${idx}`} className="text-slate-400 dark:text-slate-600 px-1 text-sm">
                  ...
                </span>
              );
            }
            return (
              <button
                key={p}
                type="button"
                className={`min-w-9 h-9 px-2 rounded-lg flex items-center justify-center text-xs font-semibold transition-all cursor-pointer ${
                  p === page
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            );
          })}

          <button
            type="button"
            className="w-9 h-9 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pages}
            aria-label="Next Page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
