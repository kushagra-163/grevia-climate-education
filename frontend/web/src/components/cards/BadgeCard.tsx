import React from 'react';
import { Card } from '../ui/Card';
import { Lock } from 'lucide-react';

interface BadgeCardProps {
  badge: {
    title: string;
    description: string;
    icon: string;
    code: string;
  };
  isUnlocked?: boolean;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, isUnlocked = false }) => {
  return (
    <Card className={`flex items-center space-x-4 ${isUnlocked ? 'bg-earth-surface border-earth-primary/40' : 'opacity-60 bg-earth-secondary/40 border-earth-border'}`}>
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center border text-xl ${
          isUnlocked
            ? 'bg-earth-primary-soft border-earth-primary/40 text-earth-primary-light shadow-sm'
            : 'bg-earth-secondary border-earth-border text-earth-subtle'
        }`}
      >
        {isUnlocked ? badge.icon || '🏅' : <Lock className="w-5 h-5 text-earth-subtle" />}
      </div>
      <div>
        <h4 className={`font-bold text-sm ${isUnlocked ? 'text-earth-text' : 'text-earth-muted'}`}>{badge.title}</h4>
        <p className="text-xs text-earth-muted mt-0.5 line-clamp-2">{badge.description}</p>
        <span className={`text-[10px] uppercase font-bold tracking-wider mt-1 block ${isUnlocked ? 'text-earth-primary-light' : 'text-earth-subtle'}`}>
          {isUnlocked ? 'Unlocked' : 'Locked'}
        </span>
      </div>
    </Card>
  );
};
