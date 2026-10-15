import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Boxes } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#090d16] transition-colors">
      <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl">
        <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-200 dark:border-amber-800/60 inline-flex items-center justify-center mb-5">
          <ShieldAlert size={40} />
        </div>
        <div className="text-4xl font-heading font-extrabold text-slate-900 dark:text-white mb-2">
          403
        </div>
        <h1 className="font-heading font-bold text-xl text-slate-900 dark:text-white mb-3">
          Access Restricted
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
          You do not have administrative privileges to access this resource or perform this action.
          Only authenticated administrators can manage or mutate inventory items.
        </p>
        <div className="flex justify-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-tr from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <Boxes size={18} />
            <span>Return to Inventory</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
