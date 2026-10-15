import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

const StockBadge = ({ stock, size = 'md' }) => {
  const stockCount = Number(stock) || 0;
  const sizeClasses = size === 'lg' ? 'px-3 py-1.5 text-sm' : size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  if (stockCount > 10) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 ${sizeClasses}`}>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
        <span>In Stock</span>
      </span>
    );
  }

  if (stockCount > 0 && stockCount <= 10) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 ${sizeClasses}`}>
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse-dot shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
        <AlertTriangle size={13} className="text-amber-600 dark:text-amber-400" />
        <span>Only {stockCount} left</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 ${sizeClasses}`}>
      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse-dot shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
      <XCircle size={13} className="text-rose-600 dark:text-rose-400" />
      <span>Out of Stock</span>
    </span>
  );
};

export default StockBadge;
