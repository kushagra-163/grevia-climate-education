import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="block text-xs font-semibold text-earth-muted uppercase tracking-wider">{label}</label>}
      <input
        className={clsx(
          'w-full px-4 py-2.5 bg-earth-surface border rounded-xl text-earth-text placeholder:text-earth-subtle text-sm focus:outline-none focus:ring-2 focus:ring-earth-primary/50 transition-all',
          error ? 'border-rose-500/80 focus:ring-rose-500/50' : 'border-earth-border focus:border-earth-primary',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
};
