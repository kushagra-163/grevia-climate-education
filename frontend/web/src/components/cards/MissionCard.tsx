import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Target, Award, CheckCircle } from 'lucide-react';

interface MissionCardProps {
  mission: {
    _id: string;
    title: string;
    description: string;
    type: 'solo' | 'community';
    target: number;
    targetUnit: string;
    rewardPoints: number;
  };
  isJoined?: boolean;
  progress?: number;
  isCompleted?: boolean;
  onJoin?: (id: string) => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  isJoined = false,
  progress = 0,
  isCompleted = false,
  onJoin,
}) => {
  const percentage = Math.min(100, Math.round((progress / mission.target) * 100));

  return (
    <Card hoverEffect className="flex flex-col justify-between h-full bg-earth-surface border-earth-border">
      <div>
        <div className="flex items-center justify-between mb-3">
          <Badge variant={mission.type === 'community' ? 'cyan' : 'emerald'}>
            {mission.type === 'community' ? 'Community Mission' : 'Solo Mission'}
          </Badge>
          <div className="flex items-center space-x-1 text-earth-amber text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>+{mission.rewardPoints} Pts</span>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-earth-primary-soft border border-earth-primary/20 text-earth-primary-light">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-earth-text text-base leading-snug">{mission.title}</h3>
            <p className="text-xs text-earth-muted mt-1 line-clamp-2">{mission.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-earth-border">
        {isJoined ? (
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-earth-muted">Progress: {progress} / {mission.target} {mission.targetUnit}</span>
              <span className="text-earth-primary-light font-bold">{percentage}%</span>
            </div>
            <div className="w-full bg-earth-secondary rounded-full h-2 overflow-hidden border border-earth-border">
              <div
                className="bg-earth-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            {isCompleted && (
              <div className="flex items-center space-x-1.5 text-xs text-earth-primary-light font-semibold mt-2">
                <CheckCircle className="w-4 h-4" />
                <span>Mission Completed!</span>
              </div>
            )}
          </div>
        ) : (
          <Button
            onClick={() => onJoin && onJoin(mission._id)}
            variant="outline"
            className="w-full"
            size="sm"
          >
            Accept Mission
          </Button>
        )}
      </div>
    </Card>
  );
};
