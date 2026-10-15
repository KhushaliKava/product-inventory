import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const Toast = ({ toasts, onClose }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100%-48px)] pointer-events-none" aria-live="polite">
      {toasts.map((toast) => {
        let IconComponent = CheckCircle2;
        let borderClass = 'border-l-4 border-l-emerald-500';
        let iconColor = 'text-emerald-500';

        if (toast.type === 'error') {
          IconComponent = AlertCircle;
          borderClass = 'border-l-4 border-l-rose-500';
          iconColor = 'text-rose-500';
        } else if (toast.type === 'warning') {
          IconComponent = AlertTriangle;
          borderClass = 'border-l-4 border-l-amber-500';
          iconColor = 'text-amber-500';
        } else if (toast.type === 'info') {
          IconComponent = Info;
          borderClass = 'border-l-4 border-l-indigo-500';
          iconColor = 'text-indigo-500';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl transition-all ${borderClass}`}
          >
            <IconComponent className={`${iconColor} shrink-0`} size={20} />
            <div className="text-sm font-medium text-slate-800 dark:text-slate-100 flex-1 leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => onClose(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              aria-label="Dismiss alert"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
