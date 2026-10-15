import React from 'react';
import { Loader2 } from 'lucide-react';

export const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm animate-pulse">
    <div className="w-full h-52 bg-slate-200 dark:bg-slate-800" />
    <div className="p-5 flex flex-col gap-3">
      <div className="w-20 h-5 bg-slate-200 dark:bg-slate-800 rounded-full" />
      <div className="w-4/5 h-5 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="w-2/3 h-3.5 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-2">
        <div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

const Loader = ({ message = 'Loading inventory...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 gap-3 text-center">
      <Loader2 className="text-indigo-600 dark:text-indigo-400 animate-spin" size={36} />
      {message && <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{message}</p>}
    </div>
  );
};

export default Loader;
