import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const SortSelect = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2.5">
      <label htmlFor="sort-select" className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
        <ArrowUpDown size={15} />
        <span>Sort By</span>
      </label>
      <div className="relative">
        <select
          id="sort-select"
          className="appearance-none bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-sm pl-3.5 pr-8 py-2 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all cursor-pointer w-full sm:w-auto"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="newest">Newest Added</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default SortSelect;
