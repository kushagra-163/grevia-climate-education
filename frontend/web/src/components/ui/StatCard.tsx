import React from 'react';
import { Card } from './Card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'emerald' | 'cyan' | 'amber' | 'teal';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'emerald',
}) => {
  const colorMap = {
    emerald: 'text-earth-primary-light bg-earth-primary-soft border-earth-primary/30',
    cyan: 'text-earth-accent bg-earth-accent-soft border-earth-accent/30',
    amber: 'text-earth-amber bg-earth-amber-soft border-earth-amber/30',
    teal: 'text-earth-primary-light bg-earth-primary-soft border-earth-primary/30',
  };

  return (
    <Card hoverEffect className="flex items-center space-x-4">
      <div className={`p-3 rounded-xl border ${colorMap[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-semibold text-earth-muted uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-earth-text mt-0.5">{value}</h3>
        {subtitle && <p className="text-xs text-earth-subtle mt-0.5">{subtitle}</p>}
      </div>
    </Card>
  );
};
