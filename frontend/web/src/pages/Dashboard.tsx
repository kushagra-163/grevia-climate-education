import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { userApi } from '../api/userApi';
import { climateApi } from '../api/climateApi';
import { gamificationApi } from '../api/gamificationApi';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ClimateInsightCard } from '../components/cards/ClimateInsightCard';
import { Award, BrainCircuit, Flame, Sparkles, PlusCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, updateUserPoints } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [climate, setClimate] = useState<any>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    if (user) {
      userApi.getUserProfile(user.id).then((res) => setProfile(res.profile)).catch(() => {});
      climateApi.getCurrent(user.city || 'Berlin', user.country || 'Global').then((res) => setClimate(res.climate)).catch(() => {});
    }
  }, [user]);

  const handleQuickEcoAction = async (type: string) => {
    setLoadingAction(true);
    try {
      const res = await gamificationApi.logAction(type);
      setActionSuccess(`Action Logged! +${res.action.pointsEarned} Pts (${res.action.co2SavedKg}kg CO₂ saved)`);
      if (user) {
        updateUserPoints((user.points || 0) + res.action.pointsEarned);
      }
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-8 rounded-3xl border border-earth-border">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-earth-primary-light uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Welcome back</span>
          </div>
          <h1 className="text-3xl font-black text-earth-text">{user?.name || 'Climate Learner'}</h1>
          <p className="text-sm text-earth-muted mt-1">Ready to explore new climate insights and make an impact today?</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/quiz">
            <Button size="md" className="space-x-2">
              <BrainCircuit className="w-4 h-4" />
              <span>Start Adaptive Quiz</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Points" value={`${user?.points || 0}`} subtitle="Verified ledger points" icon={Award} color="emerald" />
        <StatCard title="Active Streak" value={`${profile?.streakDays || 1} Days`} subtitle="Daily active learning" icon={Flame} color="amber" />
        <StatCard title="CO₂ Savings" value={`${profile?.estimatedCo2SavedKg || 0} kg`} subtitle="Cumulative environmental impact" icon={Sparkles} color="cyan" />
        <StatCard title="Quizzes Taken" value={`${profile?.totalQuizzesTaken || 0}`} subtitle="Adaptive assessments" icon={BrainCircuit} color="teal" />
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): NASA Climate & Recommended Content */}
        <div className="lg:col-span-2 space-y-6">
          <ClimateInsightCard climate={climate} />

          {/* Quick Eco-Action Logger */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-earth-text flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-earth-primary-light" />
                <span>Log Today's Eco-Action</span>
              </h3>
              <Badge variant="emerald">Instant Points</Badge>
            </div>

            {actionSuccess && (
              <div className="p-3 rounded-xl bg-earth-primary-soft border border-earth-primary/30 text-xs text-earth-primary-light flex items-center space-x-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-earth-primary-light" />
                <span>{actionSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { type: 'used_public_transport', label: '🚌 Public Transport (+50 pts)' },
                { type: 'recycled_plastic', label: '♻️ Recycled Waste (+30 pts)' },
                { type: 'saved_electricity', label: '⚡ Saved Electricity (+40 pts)' },
                { type: 'used_reusable_bottle', label: '💧 Reusable Bottle (+20 pts)' },
                { type: 'reduced_shower_time', label: '🚿 Short Shower (+25 pts)' },
                { type: 'planted_tree', label: '🌱 Planted Tree (+150 pts)' },
              ].map((act) => (
                <button
                  key={act.type}
                  disabled={loadingAction}
                  onClick={() => handleQuickEcoAction(act.type)}
                  className="p-3 rounded-xl bg-earth-secondary hover:bg-earth-primary-soft border border-earth-border hover:border-earth-primary/40 text-left transition-all text-xs font-semibold text-earth-text hover:text-earth-primary-light"
                >
                  {act.label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (1 col): Eco-Tip & Quick Navigation */}
        <div className="space-y-6">
          <Card className="bg-earth-primary-soft border-earth-primary/30 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-earth-primary-light uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Today's Eco-Tip</span>
            </div>
            <h4 className="font-bold text-earth-text text-base">Energy Phantom Loads</h4>
            <p className="text-xs text-earth-muted leading-relaxed">
              Electronics in standby mode account for up to 10% of residential energy consumption. Using smart power strips can eliminate phantom draw automatically.
            </p>
            <Link to="/eco-coach" className="inline-flex items-center space-x-1.5 text-xs text-earth-primary-light font-bold hover:underline">
              <span>Ask Eco-Coach AI for more tips</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>

          <Card className="space-y-4">
            <h4 className="font-bold text-earth-text text-sm">Quick Jump</h4>
            <div className="space-y-2">
              <Link to="/missions" className="block p-3 rounded-xl bg-earth-secondary hover:bg-earth-elevated text-xs font-medium text-earth-muted hover:text-earth-text transition-colors">
                🎯 Active Missions & Challenges
              </Link>
              <Link to="/leaderboard" className="block p-3 rounded-xl bg-earth-secondary hover:bg-earth-elevated text-xs font-medium text-earth-muted hover:text-earth-text transition-colors">
                🏆 Global & Class Rankings
              </Link>
              <Link to="/profile" className="block p-3 rounded-xl bg-earth-secondary hover:bg-earth-elevated text-xs font-medium text-earth-muted hover:text-earth-text transition-colors">
                👤 My Skill Profile & Badges
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
