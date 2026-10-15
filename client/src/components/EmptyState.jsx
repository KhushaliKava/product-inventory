import React from 'react';
import { PackageSearch, RotateCcw } from 'lucide-react';

const EmptyState = ({
  icon: Icon = PackageSearch,
  title = 'No products found',
  description = 'Try adjusting your search terms or filters to find what you are looking for.',
  actionText = 'Reset Filters',
  onAction
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center my-6 shadow-sm transition-colors">
      <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
        <Icon size={36} />
      </div>
      <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
        >
          <RotateCcw size={16} />
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
