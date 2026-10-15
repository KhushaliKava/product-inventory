import React from 'react';
import { Filter } from 'lucide-react';

const CategoryFilter = ({ categories = [], selectedCategory, onChange }) => {
  return (
    <div className="flex items-center gap-2.5">
      <label htmlFor="category-select" className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
        <Filter size={15} />
        <span>Category</span>
      </label>
      <div className="relative">
        <select
          id="category-select"
          className="appearance-none bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-sm pl-3.5 pr-8 py-2 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all cursor-pointer w-full sm:w-auto"
          value={selectedCategory}
          onChange={(e) => onChange(e.target.value)}
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
  );
};

export default CategoryFilter;
