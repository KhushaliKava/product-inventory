import React from 'react';
import { Search, X, Filter, ArrowUpDown } from 'lucide-react';

const FilterToolbar = ({
  search,
  onSearchChange,
  placeholder = 'Search by product name...',
  categories = [],
  selectedCategory,
  onCategoryChange,
  sort,
  onSortChange
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3 md:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 shadow-sm transition-colors">
      {/* Search Input */}
      <div className="flex-1 max-w-full md:max-w-md relative flex items-center">
        <Search className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" size={18} />
        <input
          type="text"
          className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-sm pl-10 pr-9 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          placeholder={placeholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search products"
        />
        {search && (
          <button
            type="button"
            className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category and Sort Dropdowns */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
        {/* Category Dropdown */}
        <div className="flex items-center justify-between sm:justify-start gap-2.5">
          <label htmlFor="category-select" className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
            <Filter size={15} />
            <span>Category</span>
          </label>
          <div className="relative">
            <select
              id="category-select"
              className="appearance-none bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-sm pl-3.5 pr-8 py-2 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all cursor-pointer w-full sm:w-auto"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center justify-between sm:justify-start gap-2.5">
          <label htmlFor="sort-select" className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
            <ArrowUpDown size={15} />
            <span>Sort By</span>
          </label>
          <div className="relative">
            <select
              id="sort-select"
              className="appearance-none bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-sm pl-3.5 pr-8 py-2 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all cursor-pointer w-full sm:w-auto"
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="newest">Newest Added</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterToolbar;
