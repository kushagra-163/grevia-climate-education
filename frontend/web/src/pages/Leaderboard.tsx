import React, { useEffect, useState } from 'react';
import { gamificationApi } from '../api/gamificationApi';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Trophy, Medal, Crown } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const [scope, setScope] = useState<'global' | 'class' | 'school'>('global');
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [scope]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await gamificationApi.getLeaderboard(scope);
      setEntries(res.leaderboard || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-earth-amber fill-earth-amber" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-earth-muted fill-earth-muted" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-earth-accent fill-earth-accent" />;
    return <span className="text-xs font-bold text-earth-subtle">#{rank}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-earth-amber-soft border border-earth-amber/30 flex items-center justify-center text-earth-amber">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-earth-text">Climate Impact Leaderboard</h1>
            <p className="text-xs text-earth-muted">Track top climate champions across global, class, and school networks.</p>
          </div>
        </div>

        {/* Scope Tabs */}
        <div className="flex items-center space-x-1 p-1 bg-earth-secondary rounded-xl border border-earth-border self-start sm:self-auto">
          {(['global', 'class', 'school'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setScope(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                scope === tab
                  ? 'bg-earth-primary text-white shadow-sm'
                  : 'text-earth-muted hover:text-earth-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <Card className="p-0 overflow-hidden border-earth-border">
        {loading ? (
          <div className="p-8 text-center text-earth-subtle text-sm animate-pulse">
            Loading climate leaderboard...
          </div>
        ) : (
          <div className="divide-y divide-earth-border">
            {entries.map((entry) => (
              <div
                key={entry.userId}
                className="flex items-center justify-between p-4 hover:bg-earth-secondary/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 flex items-center justify-center">
                    {getRankBadge(entry.rank)}
                  </div>
                  <div>
                    <h4 className="font-bold text-earth-text text-sm">{entry.userName}</h4>
                    <p className="text-xs text-earth-muted">
                      {entry.city}, {entry.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge variant="emerald">{entry.points} Pts</Badge>
                </div>
              </div>
            ))}

            {entries.length === 0 && (
              <div className="p-8 text-center text-earth-subtle text-sm">
                No leaderboard entries recorded for this scope yet.
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
