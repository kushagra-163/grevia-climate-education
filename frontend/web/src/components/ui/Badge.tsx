import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'cyan' | 'rose' | 'slate';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'emerald', className }) => {
  const styles = {
    emerald: 'bg-earth-primary-soft text-earth-primary-light border-earth-primary/30',
    amber: 'bg-earth-amber-soft text-earth-amber border-earth-amber/30',
    cyan: 'bg-earth-secondary text-earth-muted border-earth-border',
    rose: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
    slate: 'bg-earth-secondary text-earth-muted border-earth-border',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
